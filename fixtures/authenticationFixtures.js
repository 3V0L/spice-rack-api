const authFixtures = {};

authFixtures.signUp = {
  name: 'User123',
  email: 'user@mail.com',
  password: 'Test123',
};

authFixtures.testUser = {
  _id: '5c59bebf00098e7b829bf1d7',
  name: 'test user',
  email: 'test@mail.com',
  password: '$2b$10$YUNaLhd.KU0JxqRZ4O.BzeuE9exMNrNiyGpJw5eSTh1ZlncR8ez5q',
};

authFixtures.testUserLogin = { email: 'test@mail.com', password: 'Test123' };

authFixtures.secondTestUser = {
  _id: '5c6d0d3ce86b200804d06b32',
  name: 'second user',
  email: 'second@mail.com',
  password: '$2b$10$2BdKZFJDiVvHGuPaMB/xzOAvLz9YEAocqQhghfRn4if5Yaw7reqWC',
};

authFixtures.secondTestUserLogin = {
  email: 'test@mail.com',
  password: 'Test123',
};

module.exports = authFixtures;
