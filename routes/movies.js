const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const urlValidate = require('../utils/validate');

const {
  getMovies, postMovies, deleteMovie,
} = require('../controllers/movieControllers');

// возвращает все сохраненные текущим пользователем фильмы
router.get('/', getMovies);

// создает фильм
router.post('/', celebrate({
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
}), postMovies);

// удаляет фильм по id
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
