const returnMethods = require('../helpers/returnMethods');

const requestURLMapping = {};

requestURLMapping.allRecipes = (req, recipes) => {
  const newRecipes = [];
  recipes.map((entry) => {
    const item = { ...entry };
    item._doc.requests = {
      getRecipe: returnMethods.getSingleRecipe(req, item._doc._id),
      editRecipe: returnMethods.editRecipe(req, item._doc._id),
      deleteRecipe: returnMethods.deleteRecipe(req, item._doc._id),
    };
    newRecipes.push(item._doc);
    return item._doc;
  });
  return newRecipes;
};

requestURLMapping.singleRecipes = (req, recipes) => {
  const item = { ...recipes };
  item._doc.requests = {
    getAllRecipes: returnMethods.getAllMethod(req),
    editRecipe: returnMethods.editRecipe(req, item._doc._id),
    deleteRecipe: returnMethods.deleteRecipe(req, item._doc._id),
  };
  return item._doc;
};

requestURLMapping.addRecipe = (req, recipeId) => {
  const requests = {
    getAllRecipes: returnMethods.getAllMethod(req),
    getSingleRecipe: returnMethods.getSingleRecipe(req, recipeId),
    editRecipe: returnMethods.editRecipe(req, recipeId),
    deleteRecipe: returnMethods.deleteRecipe(req, recipeId),
  };
  return requests;
};

requestURLMapping.startMethods = (req) => {
  const requests = {
    getAllRecipes: returnMethods.getAllMethod(req),
    addRecipe: returnMethods.addRecipe(req),
  };
  return requests;
};

module.exports = requestURLMapping;
