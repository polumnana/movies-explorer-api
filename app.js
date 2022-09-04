const { errors, celebrate, Joi } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/userControllers');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');

const NotFoundError = require('./errors/NotFoundError');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

// подключение к серверу mongo
mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
  })
  .then(() => {
  });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// подключение логгера запросов
app.use(requestLogger);

// роуты, не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', routerUsers);
app.use('/movies', routerMovies);

// несуществующие роуты
app.use('*', () => {
  throw new NotFoundError({ message: 'Страницы не существует' });
});

// подключение логгера ошибок
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});
