const app = require("../server.js");
const db = app.get('db');

module.exports = {

  loggedIn: function(req, res, next) {
      if (!req.user) {
        res.send({reqUser: false});
        return;
      } else if (!req.user.admin) {
        res.send({reqUserAdmin: false});
        return;
      } else if (req.user.admin){
        res.send({reqUser: true, reqUserAdmin: true})
        return;
      }
      res.status(200).send({reqUser: true});
  },

  getCurrentUser: function(req,res,next){
    if(req.user){
      res.status(200).send(req.user.firstname);
    }
  }

}
