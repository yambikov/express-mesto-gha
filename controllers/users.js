const UserModel = require('../models/user');
const ErrorMessages = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return UserModel.create({ name, about, avatar }) // Создаём нового пользователя
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: ErrorMessages.Users400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    // eslint-disable-next-line arrow-body-style, no-unused-vars
    .catch((err) => {
      return res.status(500).send({ message: ErrorMessages.ServerError500 });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: ErrorMessages.UserId404 });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      console.log(err);
      // if (err.name === 'CastError') {
      //   return res.status(400).send({ message: err.message });
      // }
      res.status(500).send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
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
        return res.status(404).send({ message: ErrorMessages.UsersMe404 });
      }
      if (!name && !about) {
        return res.status(400).send({ message: ErrorMessages.UsersMe400 });
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(req.user._id);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: ErrorMessages.UsersMe400 });
      }
      return res.status(500).send({ message: ErrorMessages.ServerError500 });
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
        return res.status(404).send({ message: ErrorMessages.UsersAvatar404 });
      }
      if (!avatar) {
        return res.status(400).send({ message: ErrorMessages.UsersAvatar400 });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: ErrorMessages.ServerError500 }));
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
