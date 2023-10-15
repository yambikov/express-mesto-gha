const userRouter = require('express').Router(); // создаем роуты юзера

const { createUser, getUsers, getUserById } = require('../controllers/users');

userRouter.get('/users', getUsers); // get all users

userRouter.get('/users/:userId', getUserById); // get user by id

userRouter.post('/users', createUser); // create user

module.exports = userRouter;
