require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { limiter } = require('./utils/limiter');

const handleErrors = require('./errors/handleErrors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

// Слушаем 3000 порт
const PORT = process.env.PORT || 3000;
const DB = process.env.DB || 'mongodb://localhost:27017/moviesdb';
const app = express();

// подключение к серверу mongo
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
  });

app.use(helmet());
app.use(limiter);
app.use(express.json());

// подключение логгера запросов
app.use(requestLogger);

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://polumnana.movies.nomorepartiesxyz.ru',
  'http://polumnana.movies.nomorepartiesxyz.ru',
  'localhost:3000',
  'localhost:3002',
];

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(router);

// подключение логгера ошибок
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
