const router = require('express').Router();

const {
  getMovies, postMovies, deleteMovie,
} = require('../controllers/movieControllers');
const { validateCreateMovie, validateDeleteMovie } = require('../utils/validateRoutes');

// возвращает все сохраненные текущим пользователем фильмы
router.get('/', getMovies);

// создает фильм
router.post('/', validateCreateMovie, postMovies);

// удаляет фильм по id
router.delete('/:id', validateDeleteMovie, deleteMovie);

module.exports = router;
