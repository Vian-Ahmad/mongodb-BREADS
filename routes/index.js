var express = require('express');
var router = express.Router();

module.exports = function (db) {

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/users/:id/todos', function(req, res, next) {
  res.render('todos', {userid : req.params.id});
});


return router;

}
