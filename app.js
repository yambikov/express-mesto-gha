const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// const UserModel = require('./models/user');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

// app.get('/users', getUsers); // get all users

// app.get('/users/:userId', getUserById); // get user by id

// app.post('/users', createUser); // create user

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
