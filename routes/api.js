const express = require('express')
const router = express.Router()
const Metadata = require('../models/metadata');
const async = require('async')

router.use(function(req, res, next) {
    console.log('Loading...');
    next();
});

router.get('/tags', (req, res, next) => {

  let queries = []
  queries.push(function (cb) {
    Metadata.distinct('CL_Name', (err, docs) => {
        if (err) {
            throw cb(err)
        }
        cb(null, docs)
    });
  })

  queries.push(function (cb) {
    Metadata.distinct('SM_Name', (err, docs) => {
        if (err) {
            throw cb(err)
        }
        cb(null, docs)
    });
  })

  async.parallel(queries, function(err, docs) {
    if (err) {
        throw err
    }

    var obj1 = [];
    docs[0].forEach(function(tag, i){
       obj1[i] = {name: 'CL_Name', tag}
    })

    var obj2 = [];
    docs[1].forEach(function(tag, i){
       obj2[i] = { name: 'SM_Name', tag}
    })

    res.json(obj1.concat(obj2))
  })

})

router.post('/search', (req, res, next) => {

  let data = req.body
  let fields = []
  data.forEach( (d, i) => {
    let values = {}
    values[d.name] = d.tag
    fields.push(values)
  })

  Metadata.find({$or:fields}, { _id: 1, det_plate: 1, SM_Name: 1} , (err, model) => {

    let data = {
      model
    }

    res.json(data)
  }).limit(50)


})

module.exports = router
