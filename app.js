const { errors } = require('celebrate');
const express = require('express');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');

const NotFoundError = require('./errors/NotFoundError');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

app.use(requestLogger); // подключение логгера запросов

// роуты, которым авторизация нужна
app.use('/users', routerUsers);
app.use('/movies', routerMovies);

// несуществующие роуты
app.use('*', () => {
  throw new NotFoundError({ message: 'Страницы не существует' });
});

app.use(errorLogger); // подключение логгера ошибок
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
