// routes/users.js

const userRouter = require('express').Router(); // создаем роуты юзера
const {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users'); // импортируем контроллеры

userRouter.get('/', getUsers); // полный путь /users/ так как в app.use('/users', userRouter);
userRouter.get('/:userId', getUserById); // полный путь /users/:userId'
userRouter.post('/', createUser); // полный путь /users/
userRouter.post('/login', login); // полный путь /users/login
userRouter.patch('/me', updateUser); // полный путь /users/me
userRouter.patch('/me/avatar', updateAvatar); // полный путь /users/me/avatar

module.exports = userRouter;
