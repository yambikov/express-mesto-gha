// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs'); // Добавляем bcryptjs
const userModel = require('../models/user');
const { ErrorMessages } = require('../utils/errors');

// const jwt = require('jsonwebtoken');
const { generateJwtToken } = require('../utils/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT_ROUNDS = 10;

// registerAdmin // app.post('/signup', createUser);
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  console.log('REGISTER CONTROLLER');

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  }

  return bcrypt.hash(password, HASH_SALT_ROUNDS)
    .then((hashedPassword) => userModel.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((admin) => res.status(201).send(admin))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

// authAdmin // userRouter.post('/signin', login);
const login = (req, res) => {
  const { email, password } = req.body;
  console.log('AUTH_CONTROLLER');

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  }

  return userModel.findOne({ email }).select('+password') // так как в модели отключили видимость пароля, нужно использовать select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Такого пользователя не существует' });
      }
      return bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неверный пароль' });
        }
        const token = generateJwtToken({
          id: user._id,
        });
        console.log(token);
        return res.status(200).send({ message: 'Вы успешно вошли', id: user._id, token });
      });
    });
};

const getUsers = (req, res) => {
  console.log('getUsers_CONTROLLER');
  userModel.find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 }));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  console.log('getUserById CONTROLLER');
  userModel.findById(userId)
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
  console.log('updateUser_CONTROLLER');
  userModel.findByIdAndUpdate(req.user._id, { name, about }, {
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
//
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log('updateAvatar_CONTROLLER');

  userModel.findByIdAndUpdate(req.user._id, { avatar }, {
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
  login,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
};

// OLD CODE
// authAdmin // userRouter.post('/signin', login);
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("AUTH CONTROLLER");

//     if (!email || !password) {
//       return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
//     }

//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.status(401).send({ message: 'Такого пользователя не существует' });
//     }

//     bcrypt.compare(password, user.password, function (err, isValidPassword) {
//       if (!isValidPassword) {
//         return res.status(401).send({ message: 'Неверный пароль' });
//       }
//       return res.status(200).send({ message: 'Вы успешно вошли' });
//     });
//   } catch (error) {
//     return res.status(500).send({ message: 'Произошла ошибка при обработке запроса' });
//   }
// };
// const createUser = (req, res) => {
//   const { name, about, avatar, email, password } = req.body;
//   // Хешируем пароль
//   bcrypt.hash(password, 10) // 10 - количество раундов хеширования
//     .then((hashedPassword) => {
//       // Создаем нового пользователя с хешированным паролем
//       return UserModel.create({ name, about, avatar, email, password: hashedPassword });
//     })
//     .then((data) => {
//       res.status(http2.constants.HTTP_STATUS_CREATED).send(data);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST)
//           .send({ message: ErrorMessages.Users400 });
//       }
//       return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
//         .send({ message: ErrorMessages.ServerError500 });
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;
//   console.log('123');

//   return UserModel.findUserByCredentials(email, password)
//     .then((user) => {
//       // создадим токен
//       const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

//       // вернём токен
//       res.send({ token });
//     })
//     .catch((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };
// const getUsers = async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     //console.log(req.headers);
//     if (!(await isAuthorized(token))) {
//       return res.status(401).send({ message: 'Необходима авторизация' });
//     }

//     const users = await userModel.find();
//     res.status(http2.constants.HTTP_STATUS_OK).send(users);
//   } catch (error) {
//     res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
// .send({ message: ErrorMessages.ServerError500 });
//   }
// };
