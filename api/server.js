const express = require('express');
const helmet = require('helmet');
const zoosRouter = require('../zoos/zoos.js');
const bearsRouter = require('../bears/bears.js');
const server = express();

server.use(express.json());
server.use(helmet());

//endpoints
server.use('/api/zoos', zoosRouter);
server.use('/api/bears', bearsRouter);

server.get('/', (req, res) => {
    res.send('api working...')
  });

module.exports = server;