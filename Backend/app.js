const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
process.env.PORT = 5000;

const HttpError = require('./util/http-error');
const user = require('./routes/user-route');
const admin = require('./routes/admin-route');
const transaction = require('./routes/transaction-route.js');

const app = express();
app.use(bodyParser.json());

app.use('/user', user);
app.use('/admin', admin);
app.use('transaction/', transaction);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect('mongodb://127.0.0.1/jackpot')
  .then(() => {
    console.log('Database Connected!!!!!!!!!');
    app.listen(process.env.PORT, (req, res) => {
      console.log('Server is UP @ PORT: ' + +process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
