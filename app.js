const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const recipeRoutes = require('./api/routes/recipes');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Acess-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200);
  }
  // Call next at end of middleware so we unblock the incoming request due to the OPTIONS request
  next();
});

app.use('/recipes', recipeRoutes);

// app.use((req, res, next) => {
//   const error = new Error('URL not found.');
//   error.status = 404;
//   next(error);
// });

// app.use((error, req, res, next) => {
//   console.error(error.stack);
//   res.status(500).send('Something broke!');
// });

module.exports = app;
