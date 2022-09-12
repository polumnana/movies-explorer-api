const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../utils/config');

const User = require('../models/user');

const Statuses = require('../utils/statuses');
const ErrorsDescription = require('../errors/ErrorsDescription');

const {
  BadRequestError, InternalServerError, NotFoundError, UnauthorizedError, ConflictError,
} = require('../errors/Errors');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(ErrorsDescription[404]));
        return;
      }
      res.status(Statuses.ok).send(user);
    })
    .catch(() => {
      next(new InternalServerError(ErrorsDescription[500]));
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(ErrorsDescription[404]));
        return;
      }
      res.status(Statuses.ok).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(ErrorsDescription[409]));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorsDescription[400]));
        return;
      }
      next(new InternalServerError(ErrorsDescription[500]));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        jwtSecret,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(new UnauthorizedError(ErrorsDescription[401]));
        return;
      }
      next(new InternalServerError(ErrorsDescription[500]));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(Statuses.created).send({
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError(ErrorsDescription[409]));
            return;
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError(ErrorsDescription[400]));
            return;
          }
          next(new InternalServerError(ErrorsDescription[500]));
        });
    })
    .catch(() => {
      next(new InternalServerError(ErrorsDescription[500]));
    });
};
