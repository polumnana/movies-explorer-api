const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/userControllers');

// роуты, не требующие авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

// авторизация
router.use(auth);

// роуты, которым авторизация нужна
router.use('/users', routerUsers);
router.use('/movies', routerMovies);

// несуществующие роуты
router.use('*', () => {
  throw new NotFoundError('Страницы не существует');
});

module.exports = router;
