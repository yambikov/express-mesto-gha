// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs'); // Добавляем bcryptjs
const userModel = require('../models/user');
// const { ErrorMessages } = require('../utils/errors');
const { generateJwtToken } = require('../utils/jwt');
// const errorHandler = require('../middlewares/errorHandler');

const UnauthorizedError = require('../errors/UnauthorizedError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundErr');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT_ROUNDS = 10;

// app.post('/signup', createUser);
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('REGISTER CONTROLLER');
  console.log(req.body);

  // if (!email || !password) {
  //   return res
  //     .status(400)
  //     .send({ message: 'Email или пароль не может быть пустым' });
  // }

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
      // console.log(userWithoutPassword);
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

// userRouter.post('/signin', login);
const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('AUTH_CONTROLLER');

  if (!email || !password) {
    const error = new ValidationError('Email или пароль не может быть пустым');
    return next(error);
  }

  return userModel
    .findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((isValidPassword) => {
          if (!isValidPassword) {
            throw new UnauthorizedError('Неверные логин или пароль');
          }

          const token = generateJwtToken({ id: user._id });
          return res
            .status(http2.constants.HTTP_STATUS_OK)
            .send({ message: 'Вы успешно вошли', id: user._id, token });
        });
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
  // console.log(userId);
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
  // const userId = req;
  console.log('getCurrentUser_CONTROLLER');
  // console.log(userId);

  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
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

// OLD CODE
/*
// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs'); // Добавляем bcryptjs
const userModel = require('../models/user');
const { ErrorMessages } = require('../utils/errors');
const { generateJwtToken } = require('../utils/jwt');
// const errorHandler = require('../middlewares/errorHandler');
const {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  CastError,
  InternalServerError,
  ValudationError,
  ConflictError,
} = require('../utils/errors');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT_ROUNDS = 10;

// app.post('/signup', createUser);
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('REGISTER CONTROLLER');

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'Email или пароль не может быть пустым' });
  }

  return bcrypt
    .hash(password, HASH_SALT_ROUNDS)
    .then((hashedPassword) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }))
    .then((admin) => res.status(201).send(admin))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res
          .status(409)
          .send({ message: 'Такой пользователь уже существует' });
      }
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

// userRouter.post('/signin', login);
const login = (req, res) => {
  const { email, password } = req.body;
  console.log('AUTH_CONTROLLER');

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'Email или пароль не может быть пустым' });
  }

  return userModel
    .findOne({ email })
    .select('+password') // так как в модели отключили видимость пароля,
    нужно использовать select('+password')
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .send({ message: 'Такого пользователя не существует' });
      }
      return bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неверный пароль' });
        }
        const token = generateJwtToken({
          id: user._id,
        });
        // console.log(token);
        return res
          .status(200)
          .send({ message: 'Вы успешно вошли', id: user._id, token });
      });
    });
};

const getUsers = (req, res) => {
  console.log('getUsers_CONTROLLER');
  userModel
    .find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(() => res
      .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  console.log('getUserById CONTROLLER');
  // console.log(userId);
  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ErrorMessages.UserId404 });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.Error400 });
      }
      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 }); // Отправляем ошибку
    });
};

const updateUser = (req, res) => {
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
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.UsersMe400 });
      }
      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};
//
const updateAvatar = (req, res) => {
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
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.UsersMe400 });
      }
      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user.id; // Получаем id из аутентифицированного пользователя в объекте запроса
  // const userId = req;
  console.log('getCurrentUser_CONTROLLER');
  // console.log(userId);

  userModel
    .findById(userId)
    .then((data) => {
      if (!data) {
        return res
          .status(http2.constants.HTTP_STATUS_NOT_FOUND)
          .send({ message: ErrorMessages.UserId404 });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: ErrorMessages.Error400 });
      }
      return res
        .status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: ErrorMessages.ServerError500 });
    });
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

*/
