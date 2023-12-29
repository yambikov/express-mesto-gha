// routes/cards.js

const cardsRouter = require('express').Router(); // создаем роуты карточек
const {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validation');

cardsRouter.post('/', validateCreateCard, createCard); // полный путь /cards/
cardsRouter.get('/', getCards); // полный путь /cards/
cardsRouter.delete('/:cardId', validateCardId, deleteCard); // полный путь /cards/:cardId
cardsRouter.put('/:cardId/likes', validateCardId, addCardLike); // полный путь /cards/:cardId
cardsRouter.delete('/:cardId/likes', validateCardId, removeCardLike);

module.exports = cardsRouter;
