// app.js

const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { isAuthorized } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
// const auth = require('./middlewares/auth');

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

// app.use((req, res, next) => {
//   req.user = {
//     _id: '65836f46845b0ea1fba4d4bf',
//   };
//   next();
// });

app.post('/signin', isAuthorized, login);
app.post('/signup', isAuthorized, createUser);

app.patch('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(router);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
