const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

app.use((req, res, next) => {
  req.user = {
    _id: '652ba3c78f45280218a223f7',
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
