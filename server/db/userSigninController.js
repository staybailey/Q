var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {

  addUser : function (req, res, next) {
    console.log('req.body is...', req.body);
    User.findOne({facebook_id: req.body.id})
      .then(function(result){
        if(!result) {
          var newUser = new User({name: req.body.name, id: req.body.id});
          newUser.save();
          res.send(201);
        } else {
          res.send(200);
        }
      })
  }


}
