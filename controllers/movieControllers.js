const Movie = require('../models/movie');

const Statuses = require('../utils/statuses');
const ErrorsDescription = require('../errors/ErrorsDescription');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbidenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const ownerMovie = req.user._id;

  Movie.find({ ownerMovie })
    .then((movies) => {
      res.status(Statuses.ok).send(movies);
    })
    .catch(() => {
      next(new InternalServerError(ErrorsDescription[500]));
    });
};

module.exports.postMovies = (req, res, next) => {
  const ownerMovie = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    owner: ownerMovie,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => {
      res.status(Statuses.created).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorsDescription[400]));
        return;
      }
      next(new InternalServerError(ErrorsDescription[500]));
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError(ErrorsDescription[404]));
        return;
      }
      const ownerMovie = movie.owner;
      const userId = req.user._id;
      if (ownerMovie.toString() !== userId) {
        next(new ForbidenError(ErrorsDescription[403]));
        return;
      }
      Movie.findByIdAndRemove(req.params.id)
        .then((removedMovie) => {
          if (!removedMovie) {
            next(new NotFoundError(ErrorsDescription[404]));
            return;
          }
          res.status(Statuses.ok).send(movie);
        })
        .catch(() => {
          next(new InternalServerError(ErrorsDescription[500]));
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ErrorsDescription[400]));
        return;
      }
      next(new InternalServerError(ErrorsDescription[500]));
    });
};
