const express = require('express');
const mongoose = require('mongoose');

const RecipeModel = require('../models/recipes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Routing Sucess.' });
});

router.post('/', (req, res) => {
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    ingridients: req.body.ingridients,
    time: req.body.time,
  });
  recipe.save().then((result) => {
    res.status(201).json({
      message: 'Recipe Created',
      createdRecipe: result,
    });
  })
    .catch((error) => {
      res.status(422).json({
        message: error.message,
        recipe,
      });
    });
});

router.get('/:recipeId', (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .exec()
    .then((record) => {
      if (record) {
        res.status(200).json({ recipe: record });
      } else {
        res.status(404).json({ error: 'Recipe not found.' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occured while fetching the data.',
        error,
      });
    });
});

router.patch('/:recipeId', (req, res) => {
  const recipe = {
    title: req.body.title,
    ingridients: req.body.ingridients,
  };
  res.status(200).json({
    message: `Now patching ${req.params.recipeId}`,
    recipe,
  });
});

router.delete('/:recipeId', (req, res) => {
  res.status(200).json({ message: `Now deleting ${req.params.recipeId}` });
});

module.exports = router;
