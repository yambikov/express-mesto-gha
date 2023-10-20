const http2 = require('http2');
const UserModel = require('../models/user');
const { ErrorMessages } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return UserModel.create({ name, about, avatar }) // Создаём нового пользователя
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.Users400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((data) => {
      if (!data) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ErrorMessages.UserId404 });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.Error400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })

    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.UsersMe400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  })
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.UsersMe400 });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};
