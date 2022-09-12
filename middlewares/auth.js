const jwt = require('jsonwebtoken');
const ErrorsDescription = require('../errors/ErrorsDescription');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { jwtSecret } = require('../utils/config');

module.exports = (req, res, next) => {
  // достаём заголовок авторизации
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(ErrorsDescription.badToken);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
  // попытка сделать верификацию токена
    payload = jwt.verify(token, jwtSecret);
  } catch (err) {
    // ошибка, если не получилось
    throw new UnauthorizedError(ErrorsDescription.badToken);
  }

  // запись пейлоуда в объект запроса
  req.user = payload;

  next();
};
