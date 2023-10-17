const CardModel = require('../models/card');

const createCard = (res, req) => {
  const { name, link } = req.body;
  console.log(req.body);

  return CardModel.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};
const getCards = (res, req) => {};
const deleteCard = (res, req) => {};
const addCardLike = (res, req) => {};
const removeCardLike = (res, req) => {};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addCardLike,
  removeCardLike,
}