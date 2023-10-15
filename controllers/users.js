const UserModel = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return UserModel.create({ name, about, avatar }) // Создаём нового пользователя
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      // console.log(err);
      // так как ниже мы пишем { message: 'Server error' }, то что действительно произошло
      // становиться непонятным, поэтому, чтобы дебажить нужно использовать console.log(err)
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    // eslint-disable-next-line arrow-body-style, no-unused-vars
    .catch((err) => {
      return res.status(500).send({ message: 'Server error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user ID' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
