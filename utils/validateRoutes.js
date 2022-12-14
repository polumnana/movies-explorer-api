const { celebrate, Joi } = require('celebrate');
const urlValidate = require('./validateUrl');

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateGetUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlValidate),
    trailerLink: Joi.string().required().pattern(urlValidate),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlValidate),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  validateUpdateUser,
  validateGetUser,
  validateCreateUser,
  validateLogin,
  validateCreateMovie,
  validateDeleteMovie,
};
