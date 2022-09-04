const ErrorsDescription = require('../errors/ErrorsDescription');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/BadRequestError');
const Statuses = require('../utils/statuses');
const User = require('../models/user');

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
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorsDescription[400]));
        return;
      }
      next(new InternalServerError(ErrorsDescription[500]));
    });
};
