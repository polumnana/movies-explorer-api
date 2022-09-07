const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const ErrorsDescription = require('../errors/ErrorsDescription');

const {
  UnauthorizedError,
} = require('../errors/Errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // изменяю поведение по умолчанию
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(ErrorsDescription[401]));
      }
      // пользователь найден: сравниваем переданный пароль и сохраненный в бд хеш
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(ErrorsDescription[401]));
          }
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
