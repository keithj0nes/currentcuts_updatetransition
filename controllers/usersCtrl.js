const app = require("../server.js");
const db = app.get('db');


module.exports = {

  loggedIn: function(req, res, next) {
      if (!req.user) {
        res.status(401).send("Please Login");
        return;
      }
      if (!req.user.admin) {
        res.status(403).send("Unauthorized");
        return;
      }
      res.status(200).send(" ");
  },

  getCurrentUser: function(req,res,next){
    res.status(200).send(req.user);
  }






}
