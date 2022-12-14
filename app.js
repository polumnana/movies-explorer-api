require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { limiter } = require('./utils/limiter');

const { port, db } = require('./utils/config');

const handleErrors = require('./errors/handleErrors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

// Слушаем порт
const app = express();

// подключение к серверу mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => {
  });

// подключение логгера запросов
app.use(requestLogger);

app.use(helmet());
app.use(limiter);
app.use(express.json());

app.use(cors());
app.use(router);

// подключение логгера ошибок
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(port);
