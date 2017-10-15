const app = require("../server.js");
const db = app.get('db');
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
    db.users.findOne({email: req.body.email}, (err, findEmail) => {
      if(err){
        console.log(err);
        res.status(500).send(err);
      }
      if(findEmail){
        if(findEmail.email != req.user.email){
          res.send({success: false})
        } else {
          db.users.update({id: req.user.id, email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname}, function(err, user){
            if(err){
              console.log(err);
              res.status(500).send(err)
            }
            req.user.email = user.email;
            req.user.firstname = user.firstname;
            req.user.lastname = user.lastname;
            res.send({success: true})
          })
        }
      } else {
        db.users.update({id: req.user.id, email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname}, function(err, user){
          if(err){
            console.log(err);
            res.status(500).send(err)
          }
          req.user.email = user.email;
          req.user.firstname = user.firstname;
          req.user.lastname = user.lastname;
          res.send({success: true})
        })
      }
    })

  },

  updatePass: function(req, res){
    console.log(req.body, "logging body of password hahaah");

    bcrypt.compare(req.body.currentPass, req.user.pass_hash, (err, comparedValue) => {
      console.log(comparedValue, "do passwords match");
      if(comparedValue === false || comparedValue === undefined || comparedValue === null){
        console.log("passwords DONT match!!!");
        res.send({passwordUpdated: false, passwordMatch: false})
      } else {
        console.log("passwords DO match, update new password!");

        bcrypt.hash(req.body.newPass, 10, (err, hash) => {
          console.log(hash, "logging hash");
          console.log(req.user.pass_hash, "lloggin pass_hash");

          db.users.update({id: req.user.id, pass_hash: hash}, (err, updatedUser) => {
            console.log(updatedUser, "logging updated userrr");
            req.user.pass_hash = hash;
            res.send({passwordUpdated: true})
          })

        })
      }
    })
  },

  updateFavorite: function(req, res){
    db.favorites.findOne({user_id: req.user.id, product_id: req.body.productId}, (err, found) => {
      if(err){
        console.log(err);
        res.status(500).send(err);
      }

      if(found){
        db.run("DELETE FROM favorites WHERE user_id = $1 and product_id = $2", [req.user.id, req.body.productId], (err, deleted) =>{
          if(err){
            console.log(err);
            res.status(500).send(err);
          }
          db.run("SELECT count(*) FROM favorites WHERE product_id = $1", [req.body.productId], (err, totalFavs) => {
            if(err){
              console.log(err);
              res.status(500).send(err);
            }
            res.send(totalFavs)
          })
        })
      } else {
        db.favorites.insert({user_id: req.user.id, product_id: req.body.productId}, (err, fav) => {
          if(err){
            console.log(err);
            res.status(500).send(err)
          }
          db.run("SELECT count(*) FROM favorites WHERE product_id = $1", [req.body.productId], (err, totalFavs) => {
            if(err){
              console.log(err);
              res.status(500).send(err);
            }
            res.send(totalFavs)
          })
        })
      }
    })
  },

  getFavorites: function(req, res){
    db.get_favorites_by_user_id([req.user.id], (err, userFavs) => {
      if(err){
        console.log(err);
        res.status(500).send(err);
      }
      console.log(userFavs, "logging userFavs");
      res.send(userFavs);
    })
  },

  getOrderHistory: function(req, res){
    db.orderhistory([req.user.id], function(err, history){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      return res.status(200).send(history)
    })
  },

  getOrderHistoryById: function(req, res){
    db.get_order_details_by_id([req.params.id, req.user.id], function(err, order){
      if(err){
        console.log(err);
        res.status(500).send(err)
      }
      // if order id is not associated with user id, results = false, else send order
      if(order.length <= 0){
        console.log("NO RESULTS SHOW");
        res.send({results: false})
      } else {
        console.log(order, "history being sent");
        res.status(200).send(order)
      }
    })
  },

  logout: function(req, res){
    console.log(req.user, "user in serverjs");
    req.logout();
    res.redirect('/');
    console.log(req.user, "user in serverjs after logged out");
  }


}
