// controllers/users.js

const http2 = require('http2');
const bcrypt = require('bcryptjs'); // Добавляем bcryptjs
const userModel = require('../models/user');
const { ErrorMessages } = require('../utils/errors');
// const jwt = require('jsonwebtoken');
const { isAuthorized } = require('../middlewares/auth');

// registerAdmin // app.post('/signup', createUser);
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  console.log("REGISTER CONTROLLER");

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  };

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      return userModel.create({ name, about, avatar, email, password: hashedPassword })
    })
    .then((admin) => {
      return res.status(201).send(admin);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
}

// authAdmin // userRouter.post('/signin', login);
const login = (req, res) => { 
  const { email, password } = req.body;
  console.log("AUTH CONTROLLER");

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  };

  userModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, function (err, isValidPassword) {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неверный пароль' });
        }
        return res.status(200).send({ message: 'Вы успешно вошли' });
      });
    });
}

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


const getUsers = (req, res) => {
  userModel.find()
    .then((data) => {
      res.status(http2.constants.HTTP_STATUS_OK).send(data);
    })
    .catch(() => res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: ErrorMessages.ServerError500 }));
};

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
//     res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: ErrorMessages.ServerError500 });
//   }
// };


const getUserById = (req, res) => {
  const { userId } = req.params;
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

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

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

