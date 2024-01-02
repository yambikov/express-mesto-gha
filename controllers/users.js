// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs'); // Добавляем bcryptjs
const userModel = require('../models/user');
const { generateJwtToken } = require('../utils/jwt');

const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundErr');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('REGISTER CONTROLLER');
  return bcrypt
    .hash(password, HASH_SALT_ROUNDS)
    .then((hashedPassword) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }))
    .then((user) => {
      // Избегаем возврата пароля в ответе
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      return next(err); // Передаем ошибку дальше для централизованной обработки
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('AUTH_CONTROLLER');

  return userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = generateJwtToken({ id: user._id });
      return res
        .status(http2.constants.HTTP_STATUS_OK)
        .send({ message: 'Вы успешно вошли', id: user._id, token });
    })
    .catch(next);
};

function getUsers(req, res, next) {
  console.log('getUsers_CONTROLLER');
  userModel
    .find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(next);
}

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  console.log('getUserById CONTROLLER');
  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })

    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  console.log('updateUser_CONTROLLER');
  userModel
    .findByIdAndUpdate(
      req.user.id,
      { name, about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )

    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  console.log('updateAvatar_CONTROLLER');

  userModel
    .findByIdAndUpdate(
      req.user.id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true,
      },
    )
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user.id; // Получаем id из аутентифицированного пользователя в объекте запроса
  console.log('getCurrentUser_CONTROLLER');
  console.log(req.user.id);

  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
