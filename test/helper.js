const request = require('supertest');

const app = require('../server');
const authFixtures = require('../fixtures/authenticationFixtures');

const User = require('../api/models/users');

const testHelpers = {};

testHelpers.loginUserOne = (done) => {
  const createUser = new User(authFixtures.testUser);
  let token;
  createUser.save(() => {
    request(app)
      .post('/profile/login')
      .send(authFixtures.testUserLogin)
      .expect(200)
      .expect((res) => {
        res.body = { token };
      })
      .end(done);
  });
  return token;
};

module.exports = testHelpers;
