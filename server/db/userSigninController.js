var mongoose = require('mongoose');
var User = require('./userModel');

module.exports = {

  addUser : function (req, res, next) {    
    // check if the user is in the db
    User.findOne({id: req.body.id})
      .then(function(result){
        // if not, add her and send back 201
        if (result === null) {          
          var newUser = new User({name: req.body.name, id: req.body.id});
          newUser.save();
          res.sendStatus(201);
        } else {
          res.sendStatus(200);
        }
      });
  }
}
