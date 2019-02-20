/* eslint-disable no-undef */
const expect = require('expect');
const request = require('supertest');


const User = require('../api/models/users');
const app = require('../server');
const authFixtures = require('../fixtures/authenticationFixtures');


describe('Authentication', () => {
  beforeEach((done) => {
    User.remove({}, () => {
      done();
    });
  });

  it('User should be able to resgister', (done) => {
    request(app)
      .post('/profile/signup')
      .send(authFixtures.signUp)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('User created');
      })
      .end(done);
  });

  it('User should be able to login', (done) => {
    const createUser = new User(authFixtures.testUser);
    createUser.save(() => {
      request(app)
        .post('/profile/login')
        .send(authFixtures.testUserLogin)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('User Logged In.');
          expect(res.body).toHaveProperty('token');
        })
        .end(done);
    });
  });
});
