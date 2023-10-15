const express = require('express'); // eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const userRouter = require('./routes/routes-users'); // импортируем роуты юзера

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies
app.use('/users', userRouter); // подключаем роуты юзера

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
