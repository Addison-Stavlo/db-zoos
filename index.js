const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig.development)

//middleware functions
function checkBody(req,res,next) {
  if(req.body.name){
    next();
  }
  else{
    res.status(400).json({message: 'please provide a name field'})
  }
}

// endpoints here
server.get('/', (req, res) => {
  res.send('api working...')
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/zoos/:id', (req, res) => {
  db('zoos').where({id: req.params.id})
    .then(zoo => {
      if(zoo.length){
        res.status(200).json(zoo)
      }
      else{
        res.status(404).json({message: 'zoo not found...'})
      }
    })
    .catch(err=>res.status(500).json(err))
});

server.post('/api/zoos', checkBody, (req, res) => {
  db('zoos').insert(req.body)
    .then(ids => {
      db('zoos').where({id: ids[0]})
        .then(zoo => {
          res.status(201).json({message: `item added successfully`, item: zoo})
        })
    })
    .catch(err => {
      if(err.errno == 19){
        res.status(500).json({message: `name already used`})
      }
      else {
        res.status(500).json(err) 
      }    
    })
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
