const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe, updateUserInfo,
} = require('../controllers/userControllers');

// возвращает пользователя из БД
router.get('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), getUserMe);

// обновляет информацию о пользователе
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
