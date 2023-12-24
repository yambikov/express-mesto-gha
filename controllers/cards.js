// controllers/cards.js

const http2 = require('http2');
const CardModel = require('../models/card');
const { ErrorMessages } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  // console.log(req.body);

  return CardModel.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.Cards400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};

const getCards = (req, res) => {
  CardModel.find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 }));
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const data = await CardModel.findByIdAndDelete(cardId).orFail();

    // Если запрос вернул данные, отправляем успешный ответ
    return res.status(http2.constants.HTTP_STATUS_OK).send(data);
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') {
      // Если не найдено документа с указанным ID, отправляем 404 ошибку
      return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: ErrorMessages.CardsId404 });
    } if (err.name === 'CastError') {
      // Если неправильный формат ID, отправляем 400 ошибку
      return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: ErrorMessages.Error400 });
    }
    // В случае других ошибок, отправляем 500 ошибку
    return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 });
  }
};

const addCardLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ErrorMessages.CardsLike404 });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.CardsLike400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

const removeCardLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ErrorMessages.CardsLike404 });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.CardsLike400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
};
