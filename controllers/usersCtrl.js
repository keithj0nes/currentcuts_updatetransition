const app = require("../server.js");
const config = require("../config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = {

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

  resetPasswordEmail: function(req, res){
    const db = app.get('db');

    console.log(req.body, "loggin req.body");
    db.users.findOne({email: req.body.email}).then(user => {
      // if(err){console.log(err); res.status(500).send(err)}

      console.log(user, "logging user");
      if(!user){
        res.send({success: false, message: "Email was not found"})
      } else if(user.facebookid){
        res.send({success: false, message: "Facebook users cannot reset password, please log in with Facebook"})
      } else {
        let rtoken = jwt.sign({email: user.email}, 'secret', {expiresIn: "1h"});
        console.log(rtoken, "logging rtoken");

        db.users.update({id: user.id, resettoken: rtoken}).then(newUser => {
          console.log(newUser, "new user");

          let text = "Hello " + user.firstname + ', <br><br> Please reset your password by clicking the link below: <br><br><a href="http://localhost:3010/#/passwordreset/' + newUser.resettoken +'">RESET PASSWORD</a>'

          const mailOptions = {
            from: 'currentcutstest@gmail.com',                  // sender address
            // to: b.email,                                        // list of receivers
            bcc: 'currentcutstest@gmail.com',                   // list of bcc receivers
            subject: 'Reset your password',     // Subject line
            // text: text //,                                   // plaintext body
            html: text                                          // html body
          };

          //send email
          transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                res.json({yo: 'error'});
            }else{
                console.log('Message sent: ' + info.response);
                res.json({yo: info.response});
            };
          });
          res.send({success: true, message: "An email has been sent"})

        })

      }
    })
  },

  resetPasswordToken: function(req, res){
    const db = app.get('db');

    console.log(req.params.token, "req.params.token");
    let token = req.params.token;

    db.users.findOne({resettoken: token}).then(user => {
      console.log(user);
      if(user){
        jwt.verify(token, 'secret', (err, decoded) => {
          if(err){
            console.log("falure");
            res.send({success: false, message: 'Invalid token'})
          } else {
            console.log("SUCCESSSSSSSS");
            res.send({success: true, user: user})
          }
        })
      } else {
        res.send({success: false, message: 'Token not found'})
      }


    })
  },

  savePassword: function(req, res){
    const db = app.get('db');
    console.log(req.body, "reqbody");
    db.users.findOne({resettoken: req.params.token}).then(user => {

      if(req.body.pass == null || req.body.pass == "") {
        res.send({success: false, message: "Password not provied"});
      } else {
        bcrypt.hash(req.body.pass, 10, (err, hash) => {
          db.users.update({id: user.id, resettoken: null, pass_hash: hash}).then(updatedUser => {


            const mailOptions = {
              from: 'Current Cuts Admin, currentcutstest@gmail.com',                  // sender address
              // to: b.email,                                        // list of receivers
              bcc: 'currentcutstest@gmail.com',                   // list of bcc receivers
              subject: 'Your password has been reset',     // Subject line
              // text: text //,                                   // plaintext body
              html: "Hello " + user.firstname + ', <br><br> Your password has been successfully reset! <br><br>'
            };

            //send email
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);
                  res.json({yo: 'error'});
              }else{
                  console.log('Message sent: ' + info.response);
                  res.json({yo: info.response});
              };
            });


            res.send({success: true, message: "Your password has been updated"})
          })
        })
      }
    })
  }
}


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
      user: config.nodemailerAuth.username, // Your email id
      pass: config.nodemailerAuth.pass // Your password
  }
});
