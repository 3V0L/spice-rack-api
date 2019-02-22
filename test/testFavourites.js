/* eslint-disable no-undef */
const expect = require('expect');
const request = require('supertest');

const Recipes = require('../api/models/recipes');
const User = require('../api/models/users');
const app = require('../server');
const recipeFixtures = require('../fixtures/recipeFixtures');
const authFixtures = require('../fixtures/authenticationFixtures');


describe('Favourites', () => {
  let token;
  beforeEach((done) => {
    Recipes.remove({}, () => {
    });
    const createRecipe = new Recipes(recipeFixtures.testUserRecipe);
    createRecipe.save(() => {});
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

  after((done) => {
    User.remove({}, () => {
    });
    done();
  });

  it('Add a recipe to favourites', (done) => {
    request(app)
      .post(`/favourites/${recipeFixtures.testUserRecipe._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Recipe added to Favourites.');
      })
      .end(done);
  });

  it('Try to add to favourites again and get conflict', (done) => {
    request(app)
      .post(`/favourites/${recipeFixtures.testUserRecipe._id}`)
      .set('authorization', token)
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Recipe already in favourites');
      })
      .end(done);
  });

  it('Retrieve favourites', (done) => {
    request(app)
      .get('/favourites')
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('count');
        expect(res.body.recipes.length).toBe(1);
      })
      .end(done);
  });

  it('Delete favourites', (done) => {
    request(app)
      .delete(`/favourites/${recipeFixtures.testUserRecipe._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Recipe has been removed from favourites');
      })
      .end(done);
  });
});
