// routes/users.js

const userRouter = require('express').Router(); // создаем роуты юзера
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers); // полный путь /users/ так как в app.use('/users', userRouter);
userRouter.get('/me', getCurrentUser); // полный путь /users/me
userRouter.get('/:userId', getUserById); // полный путь /users/:userId'

userRouter.patch('/me', updateUser); // полный путь /users/me
userRouter.patch('/me/avatar', updateAvatar); // полный путь /users/me/avatar

module.exports = userRouter;
