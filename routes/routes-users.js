const userRouter = require('express').Router(); // создаем роуты юзера
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/users'); // импортируем контроллеры

userRouter.get('/', getUsers); // полный путь /users/ так как в app.use('/users', userRouter);

userRouter.get('/:userId', getUserById); // полный путь /users/:userId'

userRouter.post('/', createUser); // полный путь /users/

userRouter.patch('/me', updateUser); // полный путь /users/me

module.exports = userRouter;
