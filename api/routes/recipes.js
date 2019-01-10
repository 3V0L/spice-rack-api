const express = require('express');
const mongoose = require('mongoose');
const url = require('url');

const RecipeModel = require('../models/recipes');

const router = express.Router();

router.get('/', (req, res) => {
  RecipeModel.find()
    .select('_id title ingredients time')
    .exec()
    .then((recipes) => {
      if (recipes.length > 0) {
        const response = {
          totalCount: recipes.length,
          recipes,
        };
        res.status(200).json(response);
      } else {
        res.status(200).json({ message: 'No recipes available.' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'An error occured while fetching data' });
    });
});

router.post('/', (req, res) => {
  const recipe = new RecipeModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    ingredients: req.body.ingredients,
    time: req.body.time,
  });
  recipe.save().then((result) => {
    res.status(201).json({
      message: 'Recipe Created',
      createdRecipe: {
        _id: result.id,
        title: result.title,
        ingredients: result.ingredients,
        time: result.time,
      },
    });
  })
    .catch((error) => {
      // Retrieve error field
      const field = Object.keys(error.errors)[0];
      res.status(422).json({
        message: error.errors[field].message,
      });
    });
});

router.get('/:recipeId', (req, res) => {
  RecipeModel.findById(req.params.recipeId)
    .select('_id title ingredients time')
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
  RecipeModel.updateOne(
    { _id: req.params.recipeId },
    { $set: req.body },
  )
    .exec()
    .then(() => {
      // Generate URL for getting the Patched record
      const requrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl,
      });
      const result = {
        message: 'Recipe Updated.',
        request: {
          description: 'Request to retrieve updated record',
          type: 'GET',
          url: requrl,
        },
      };
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to update.' });
    });
});

router.delete('/:recipeId', (req, res) => {
  RecipeModel.remove({ _id: req.params.recipeId })
    .exec()
    .then(() => {
      res.status(200).json({ message: 'The recipe was deleted' });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

module.exports = router;
