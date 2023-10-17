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

const updateUser = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        // Если data равен null, значит пользователь с указанным _id не найден
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (!name && !about) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(req.user._id);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        // Если data равен null, значит пользователь с указанным _id не найден
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (!avatar) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
