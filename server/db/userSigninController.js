var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {

  addUser : function (req, res, next) {
    console.log('req.body is...', req.body);
  }


}