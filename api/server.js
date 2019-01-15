const express = require('express');
const helmet = require('helmet');
const zoosRouter = require('../zoos/zoos.js');
const server = express();

server.use(express.json());
server.use(helmet());

//endpoints
server.use('/api/zoos', zoosRouter);

server.get('/', (req, res) => {
    res.send('api working...')
  });

module.exports = server;