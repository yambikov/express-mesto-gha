// app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Импортируем dotenv
const router = require('./routes');

// Загружаем переменные окружения из файла .env
dotenv.config();

const { isAuthorized } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

// mongoose.connect(process.env.MONGODB_URI, {
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключено к MongoDB');
});

const app = express();
// const { PORT } = process.env;
const PORT = 3000;

app.use(express.json());

app.post('/signin', isAuthorized, login);
app.post('/signup', isAuthorized, createUser);

app.patch('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.use(router);

app.listen(PORT, () => {
  console.log(`Пример приложения слушает порт ${PORT}`);
});

// OLD CODE
// app.js

// const express = require('express');
// const mongoose = require('mongoose');
// const router = require('./routes');

// const { isAuthorized } = require('./middlewares/auth');
// const { login, createUser } = require('./controllers/users');
// // const auth = require('./middlewares/auth');

// mongoose.connect('mongodb://localhost:27017/mestodb', {
//   useNewUrlParser: true,
// }).then(() => {
//   console.log('Connected to MongoDB');
// });

// const app = express();
// const PORT = 3000;

// app.use(express.json()); // to support JSON-encoded bodies

// // app.post('/signin', login);
// // app.post('/signup', createUser);

// // app.use(auth);

// // app.use((req, res, next) => {
// //   req.user = {
// //     _id: '65836f46845b0ea1fba4d4bf',
// //   };
// //   next();
// // });

// app.post('/signin', isAuthorized, login);
// app.post('/signup', isAuthorized, createUser);

// app.patch('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

// app.use(router);

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });
