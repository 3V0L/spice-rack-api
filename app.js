const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const authRoutes = require('./api/routes/users');
const recipeRoutes = require('./api/routes/recipes');
const personalRecipeRoutes = require('./api/routes/personalRecipes');
const returnURLMapping = require('./api/helpers/mapReturnObjects');
const favouritesRecipeRoutes = require('./api/routes/favourites');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

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

app.get('/', (req, res) => {
  res.status(200).json({
    requests: returnURLMapping.startMethods(req),
  });
});

app.use('/my-recipes', personalRecipeRoutes);
app.use('/recipes', recipeRoutes);
app.use('/auth', authRoutes);
app.use('/favourites', favouritesRecipeRoutes);
app.use((req, res) => {
  res.status(404).send('Route Not Valid.');
});

module.exports = app;
