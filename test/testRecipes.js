/* eslint-disable no-undef */
const expect = require('expect');
const request = require('supertest');

const Recipes = require('../api/models/recipes');
const User = require('../api/models/users');
const app = require('../server');
const recipeFixtures = require('../fixtures/recipeFixtures');
const authFixtures = require('../fixtures/authenticationFixtures');


describe('Recipes', () => {
  before((done) => {
    Recipes.remove({}, () => {
      done();
    });
  });

  it('An user should be able to retrieve recipes', (done) => {
    const createRecipe = new Recipes(recipeFixtures.testUserRecipe);
    createRecipe.save(() => {
      request(app)
        .get('/recipes')
        .expect(200)
        .expect((res) => {
          expect(res.body.recipes.length).toBe(1);
          expect(res.body).toHaveProperty('totalCount');
        })
        .end(done);
    });
  });

  it('An user should be able to retrieve one recipe', (done) => {
    request(app)
      .get(`/recipes/${recipeFixtures.testUserRecipe._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.recipe).toHaveProperty('title');
      })
      .end(done);
  });

  describe('Actions on Personal Recipes', () => {
    let token;
    before((done) => {
      Recipes.remove({}, () => {
      });
      const createRecipe = new Recipes(recipeFixtures.testUserRecipe);
      createRecipe.save(() => {});
      const createUser = new User(authFixtures.testUser);
      createUser.save(() => {});
      request(app)
        .post('/profile/login')
        .send(authFixtures.testUserLogin)
        .end((err, res) => {
          ({ token } = res.body);
          done();
        });
    });

    it('A user should be able to create a recipe', (done) => {
      request(app)
        .post('/recipes')
        .set('authorization', token)
        .send(recipeFixtures.addRecipe)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Recipe Created');
        })
        .end(done);
    });

    it('A user should be able to update their recipe', (done) => {
      request(app)
        .patch(`/my-recipes/${recipeFixtures.testUserRecipe._id}`)
        .set('authorization', token)
        .send({ title: 'New title' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Recipe Updated.');
        })
        .end(done);
    });

    it('A user should be able to retrieve all their recipes', (done) => {
      request(app)
        .get('/my-recipes')
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalCount');
          expect(res.body).toHaveProperty('recipes');
        })
        .end(done);
    });

    it('A user should be able to retrieve a single one of their recipes', (done) => {
      request(app)
        .get(`/my-recipes/${recipeFixtures.testUserRecipe._id}`)
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body.recipe._id).toBe(recipeFixtures.testUserRecipe._id);
          expect(res.body).toHaveProperty('recipe');
        })
        .end(done);
    });

    it('A user should be able to delete their recipe', (done) => {
      request(app)
        .delete(`/my-recipes/${recipeFixtures.testUserRecipe._id}`)
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('The recipe was deleted');
        })
        .end(done);
    });
  });

  describe('Actions on Other Users Recipes', () => {
    let token;
    before((done) => {
      Recipes.remove({}, () => {
      });
      const createRecipe = new Recipes(recipeFixtures.testUserRecipe);
      createRecipe.save(() => {});
      const createUser = new User(authFixtures.testUser);
      createUser.save(() => {});
      const createSecondUser = new User(authFixtures.secondTestUser);
      createSecondUser.save(() => {});
      request(app)
        .post('/profile/login')
        .send(authFixtures.secondTestUserLogin)
        .end((err, res) => {
          ({ token } = res.body);
          done();
        });
    });

    it('Retrieve another Users full recipe list', (done) => {
      request(app)
        .get(`/recipes/user/${authFixtures.testUser._id}`)
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalCount');
          expect(res.body.recipes.length).toBe(1);
        })
        .end(done);
    });

    it('Search for a recipe', (done) => {
      request(app)
        .get(`/recipes/search/ingredients/${recipeFixtures.testUserRecipe.ingredients.split(',')[0]}`)
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalCount');
          expect(res.body.recipes.length).toBe(1);
        })
        .end(done);
    });

    it('Search non-existent recipe', (done) => {
      request(app)
        .get('/recipes/search/ingredients/FakeValue')
        .set('authorization', token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('No recipes available. Try other keywords');
        })
        .end(done);
    });

    it('Rate a Recipe', (done) => {
      request(app)
        .post(`/recipes/review/${recipeFixtures.testUserRecipe._id}`)
        .set('authorization', token)
        .send(recipeFixtures.rateRecipe)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Review Added');
        })
        .end(done);
    });
  });
});
