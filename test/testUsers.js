/* eslint-disable no-undef */
const expect = require('expect');
const request = require('supertest');

const Recipes = require('../api/models/recipes');
const User = require('../api/models/users');
const app = require('../server');
const recipeFixtures = require('../fixtures/recipeFixtures');
const authFixtures = require('../fixtures/authenticationFixtures');


describe('Users', () => {
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

  it('Get a User profile', (done) => {
    request(app)
      .get(`/profile/single-user/${authFixtures.testUser._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body.user._id).toBe(authFixtures.testUser._id);
      })
      .end(done);
  });

  it('Get all users', (done) => {
    request(app)
      .get('/profile/users')
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('count');
        expect(res.body.results.length).toBe(2);
      })
      .end(done);
  });

  it('Search for test user', (done) => {
    request(app)
      .get('/profile/user/test')
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalCount');
        expect(res.body.result.length).toBe(1);
      })
      .end(done);
  });

  it('Follow a user', (done) => {
    request(app)
      .patch(`/profile/follow/${authFixtures.testUser._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('You are now following this user');
      })
      .end(done);
  });

  it('Follower count for a user', (done) => {
    request(app)
      .get(`/profile/follow-count/${authFixtures.testUser._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('followers');
        expect(res.body).toHaveProperty('following');
      })
      .end(done);
  });

  it('UnFollow a user', (done) => {
    request(app)
      .patch(`/profile/unfollow/${authFixtures.testUser._id}`)
      .set('authorization', token)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('You unfollowed this user');
      })
      .end(done);
  });
});
