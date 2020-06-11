var express = require('express');
var router = express.Router();
var controller = require('../Controller')

/* GET home page. */
router.route('/') 
  .get((req, res, next) => {
    controller.getRemoteData(res, req.query.page)
  })
  .post((req, res, next) => {
    res.send('post')
  })
  .put((req, res, next) => {
    res.send('put')
  })
  .delete((req, res, next) => {
    res.send('delete')
  })

module.exports = router;
