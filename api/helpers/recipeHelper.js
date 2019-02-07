const recipeHelper = {};

recipeHelper.convertToObject = (req) => {
  let object = req;
  if (typeof object === 'string') {
    object = JSON.parse(object);
  }
  return object;
};

recipeHelper.updateRecipe = (body, file) => {
  const updateObject = {};
  Object.keys(body).forEach((key) => {
    if (key === 'instructions' && body.instructions) {
      updateObject[key] = recipeHelper.convertToObject(body.instructions);
    } else if (file) {
      updateObject.recipeImage = file.path;
    } else {
      updateObject[key] = body[key];
    }
  });
  return updateObject;
};

module.exports = recipeHelper;
