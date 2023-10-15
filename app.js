const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// const UserModel = require('./models/user');
const { createUser, getUsers, getUserById } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.status(200).send('Привет от GET!');
});

app.post('/post', (req, res) => {
  const { name } = req.body;
  res.status(201).send(`Привет от POST! ${name}`);
});

// GET /users — возвращает всех пользователей
app.get('/users', getUsers);

// GET /users/:userId - возвращает пользователя по _id
app.get('/users/:userId', getUserById);

// POST /users — создаёт пользователя
app.post('/users', createUser);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
