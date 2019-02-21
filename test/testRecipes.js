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

  describe('Authorized Recipe Functions', () => {
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
  });
});
