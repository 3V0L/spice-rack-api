const http = require('http');
const chalk = require('chalk');
const mongoose = require('mongoose');
const debug = require('debug')('app');
require('dotenv').config();

mongoose.connect(process.env.DEV_DB, { useNewUrlParser: true });

const app = require('./app');

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  debug(`Server running on ${chalk.blue(`http://127.0.0.1:${port}`)}`);
});
