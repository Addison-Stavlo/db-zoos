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
    db('zoos').where({id: req.params.id})
    .then(zoo => {
      if(zoo.length){
        next();
      }
      else{
        res.status(404).json({message: `zoo of id ${req.params.id} not found...`})
      }
    })
  }

  //endpoints
  router.get('/', (req, res) => {
    db('zoos')
      .then(zoos => {
        res.status(200).json(zoos)
      })
      .catch(err => res.status(500).json(err));
  });
  
  router.get('/:id', (req, res) => {
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
  
  router.post('/', checkBody, (req, res) => {
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
  
  router.put('/:id', checkBody, checkID, (req,res) => {
    db('zoos').where({id: req.params.id}).update(req.body)
      .then(count => {
        db('zoos').where({id: req.params.id})
          .then(zoo => res.status(200).json({message: `successfully updated item`, item: zoo}))
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
    db('zoos').where({id: req.params.id}).del()
      .then(count => {
        res.status(200).json({message: `successfully deleted zoo of id ${req.params.id}`})
      })
      .catch(err => res.status(500).json(err) )
  })

  module.exports = router;