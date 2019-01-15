const express = require('express');
const router = express.Router();

const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

//middleware functions
function checkBody(req,res,next) {
    if(req.body.name){
      next();
    }
    else{
      res.status(400).json({message: 'please provide a name field'})
    }
  }
  function checkID(req,res,next) {
    db('bears').where({id: req.params.id})
    .then(bears => {
      if(bears.length){
        next();
      }
      else{
        res.status(404).json({message: `bear of id ${req.params.id} not found...`})
      }
    })
  }

  //endpoints
  router.get('/', (req, res) => {
    db('bears')
      .then(bears => {
        res.status(200).json(bears)
      })
      .catch(err => res.status(500).json(err));
  });
  
  router.get('/:id', (req, res) => {
    db('bears').where({id: req.params.id})
      .then(bear => {
        if(bear.length){
          res.status(200).json(bear)
        }
        else{
          res.status(404).json({message: 'bear not found...'})
        }
      })
      .catch(err=>res.status(500).json(err))
  });
  
  router.post('/', checkBody, (req, res) => {
    db('bears').insert(req.body)
      .then(ids => {
        db('bears').where({id: ids[0]})
          .then(bear => {
            res.status(201).json({message: `item added successfully`, item: bear})
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
  
  router.put('/:id', checkBody, checkID, (req,res) => {
    db('bears').where({id: req.params.id}).update(req.body)
      .then(count => {
        db('bears').where({id: req.params.id})
          .then(bear => res.status(200).json({message: `successfully updated item`, item: bear}))
      })
      .catch(err => {
        if(err.errno == 19){
          res.status(500).json({message: `name already used`})
        }
        else {
          res.status(500).json(err) 
        }    
      })
  })
  
  router.delete('/:id', checkID, (req,res) => {
    db('bears').where({id: req.params.id}).del()
      .then(count => {
        res.status(200).json({message: `successfully deleted bear of id ${req.params.id}`})
      })
      .catch(err => res.status(500).json(err) )
  })

  module.exports = router;