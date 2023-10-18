const router = require('express').Router();
const userRouter = require('./users'); // импортируем роуты юзера
const cardsRouter = require('./cards'); // импортируем роуты карточек

router.use('/users', userRouter); // подключаем роуты юзера
router.use('/cards', cardsRouter); // подключаем роуты карточек

module.exports = router; // экспортируем маршрутизатор
