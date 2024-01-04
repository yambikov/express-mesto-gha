// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Импортируем dotenv
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Загружаем переменные окружения из файла .env
dotenv.config();

const { isAuthorized } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundErr');
// mongoose.connect(process.env.MONGODB_URI, {
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключено к MongoDB');
});

const app = express();
// const { PORT } = process.env;
const PORT = 3000;

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов за ним идут все обработчики роутов

app.use('/signin', validateLogin, login);
app.use('/signup', validateCreateUser, createUser);

app.use(isAuthorized);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// errorLogger нужно подключить после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// это обработчик ошибки
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Пример приложения слушает порт ${PORT}`);
});
