const CardModel = require('../models/card');
const { ErrorMessages } = require('../utils/errors');

const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.body);

  return CardModel.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: ErrorMessages.Cards400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 });
    });
};

const getCards = (req, res) => {
  CardModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => res.status(500).send({ message: ErrorMessages.ServerError500 }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndDelete(cardId)
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: ErrorMessages.CardsId404 });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: ErrorMessages.Error400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

const addCardLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: ErrorMessages.CardsLike404 });
      }
      return res.status(200).send(data);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: ErrorMessages.CardsLike400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
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
        return res.status(404).send({ message: ErrorMessages.CardsLike404 });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: ErrorMessages.CardsLike400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
};
