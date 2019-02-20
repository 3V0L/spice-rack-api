const http = require('http');
const chalk = require('chalk');
const mongoose = require('mongoose');
const debug = require('debug')('app');
require('dotenv').config();

const config = require('./config');

const environment = process.env.NODE_ENV || 'production';
mongoose.connect(config[environment], { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const app = require('./app');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  debug(`Server running on ${chalk.blue(`http://127.0.0.1:${port}`)}`);
});

module.exports = server;
