const jwt = require('jsonwebtoken');
const ErrorsDescription = require('../errors/ErrorsDescription');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'arelisivx');
  } catch (err) {
    // ошибка, если не получилось
    throw new UnauthorizedError(ErrorsDescription.badToken);
  }

  // запись пейлоуда в объект запроса
  req.user = payload;

  next();
};
