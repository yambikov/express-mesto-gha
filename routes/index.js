// routes/index.js

const router = require('express').Router();
const http2 = require('http2');
const userRouter = require('./users'); // импортируем роуты юзера
const cardsRouter = require('./cards'); // импортируем роуты карточек
const { ErrorMessages } = require('../utils/errors');
const authRouter2 = require('./auth2');

router.use('/', authRouter2);

router.use('/users', userRouter); // подключаем роуты юзера
router.use('/cards', cardsRouter); // подключаем роуты карточек



router.patch('/*', (req, res) => res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ErrorMessages.Error404 }));

module.exports = router; // экспортируем маршрутизатор
