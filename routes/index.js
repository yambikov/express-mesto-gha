const router = require('express').Router();
const http2 = require('http2');
const userRouter = require('./users'); // импортируем роуты юзера
const cardsRouter = require('./cards'); // импортируем роуты карточек
const { ErrorMessages } = require('../utils/errors');

router.use('/users', userRouter); // подключаем роуты юзера
router.use('/cards', cardsRouter); // подключаем роуты карточек
// http2.constants.HTTP_STATUS_NOT_FOUND

router.patch('/*', (req, res) => res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: ErrorMessages.Error404 }));

module.exports = router; // экспортируем маршрутизатор
