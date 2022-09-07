const router = require('express').Router();
const auth = require('../middlewares/auth');
const routerUsers = require('./users');
const routerMovies = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/userControllers');
const { validateCreateUser, validateLogin } = require('../utils/validateRoutes');

// роуты, не требующие авторизации
router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUser, createUser);

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
