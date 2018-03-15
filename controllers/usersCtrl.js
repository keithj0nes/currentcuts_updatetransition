const app = require("../server.js");
const bcrypt = require('bcrypt')

module.exports = {

  // loggedIn: function(req, res, next) {
  //     if (!req.user) {
  //       res.send({reqUser: false});
  //       return;
  //     } else if (!req.user.admin) {
  //       res.send({reqUserAdmin: false});
  //       return;
  //     } else if (req.user.admin){
  //       res.send({reqUser: true, reqUserAdmin: true})
  //       return;
  //     }
  //     res.status(200).send({reqUser: true});
  // },

  getCurrentUser: function(req,res,next){
    let isFBuser = false;
    if(req.user){
      if(req.user.facebookid){
        isFBuser = true;
      }
      res.status(200).send({firstname:req.user.firstname, lastname:req.user.lastname, email:req.user.email, isFBuser: isFBuser});
    } else {
      res.send({reqUser: false})
    }
  },

  updateBasicAccount: function(req, res){
    const db = app.get('db');
    db.users.findOne({email: req.body.email}).then(findEmail => {
      if(findEmail){
        if(findEmail.email !== req.user.email){
          res.send({success: false})
        } else {
          db.users.update({
            id: req.user.id,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname})
          .then(user => {
            req.user.email = user.email;
            req.user.firstname = user.firstname;
            req.user.lastname = user.lastname;
            res.send({success: true})
          })
        }
      } else {
        db.users.update({
          id: req.user.id,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname})
        .then(user => {
          req.user.email = user.email;
          req.user.firstname = user.firstname;
          req.user.lastname = user.lastname;
          res.send({success: true})
        })
      }
    })
  },

  updatePass: function(req, res){
    const db = app.get('db');
    bcrypt.compare(req.body.currentPass, req.user.pass_hash, (err, comparedValue) => {
      if(comparedValue === false || comparedValue === undefined || comparedValue === null){
        res.send({passwordUpdated: false, passwordMatch: false})
      } else {
        bcrypt.hash(req.body.newPass, 10, (err, hash) => {
          db.users.update({id: req.user.id, pass_hash: hash}).then(updatedUser => {
            req.user.pass_hash = hash;
            res.send({passwordUpdated: true})
          })
        })
      }
    })
  },

  updateFavorite: function(req, res){
    const db = app.get('db');
    db.favorites.findOne({user_id: req.user.id, product_id: req.body.productId}).then(found => {
      if(found){
        db.query("DELETE FROM favorites WHERE user_id = $1 and product_id = $2", [req.user.id, req.body.productId]).then(deleted =>{
          db.query("SELECT count(*) FROM favorites WHERE product_id = $1", [req.body.productId]).then(totalFavs => {
            res.send(totalFavs)
          })
        })
      } else {
        db.favorites.insert({user_id: req.user.id, product_id: req.body.productId}).then(fav => {
          db.query("SELECT count(*) FROM favorites WHERE product_id = $1", [req.body.productId]).then(totalFavs => {
            res.send(totalFavs)
          })
        })
      }
    })
  },

  getFavorites: function(req, res){
    const db = app.get('db');
    db.get_favorites_by_user_id([req.user.id]).then(userFavs => {
      res.send(userFavs);
    })
  },

  getOrderHistory: function(req, res){
    const db = app.get('db');
    db.orderhistory([req.user.id]).then(orderHistory => {
      return res.status(200).send(orderHistory)
    })
  },

  getOrderHistoryById: function(req, res){
    const db = app.get('db');
    db.get_order_details_by_id([req.params.id, req.user.id]).then(order => {
      // if order id is not associated with user id, results = false, else send order
      if(order.length <= 0){
        res.send({results: false})
      } else {
        res.status(200).send(order)
      }
    })
  },

  logout: function(req, res){
    req.logout();
    res.redirect('/');
  }


}
