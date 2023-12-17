// routes/cards.js

const cardsRouter = require('express').Router(); // создаем роуты карточек
const {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

cardsRouter.post('/', createCard); // полный путь /cards/
cardsRouter.get('/', getCards); // полный путь /cards/
cardsRouter.delete('/:cardId', deleteCard); // полный путь /cards/:cardId
cardsRouter.put('/:cardId/likes', addCardLike); // полный путь /cards/:cardId
cardsRouter.delete('/:cardId/likes', removeCardLike);

module.exports = cardsRouter;
