// routes/users.js

const userRouter = require('express').Router(); // создаем роуты юзера
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
} = require('../middlewares/validation');

userRouter.get('/', getUsers); // полный путь /users/ так как в app.use('/users', userRouter);
userRouter.get('/me', getCurrentUser); // полный путь /users/me
userRouter.get('/:userId', validateUserId, getUserById); // полный путь /users/:userId'

userRouter.patch('/me', validateUpdateUser, updateUser); // полный путь /users/me
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar); // полный путь /users/me/avatar

module.exports = userRouter;
