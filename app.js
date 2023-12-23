// app.js
/* eslint-disable */

const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

// app.post('/signin', login);
// app.post('/signup', createUser);

// app.use(auth);



app.use((req, res, next) => {
  req.user = {
    _id: '65849c8f4ec6a00b47f4683c',
  };
  next();
});




// app.use('/users', userRouter); // подключаем роуты юзера
// app.use('/cards', cardsRouter); // подключаем роуты юзера

// app.patch('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
