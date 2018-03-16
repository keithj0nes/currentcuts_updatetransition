const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");
const moment = require('moment');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
const stripe = require("stripe")("sk_test_O4Zh9ql3gliRLlGILelnZ4rz");


const app = module.exports = express();

// var userSchema

//sync to database
// var conn = massive.connectSync({
//   connectionString : "postgres://postgres:@localhost/ccv"
//   // connectionString: config.psqlConnString
// });

// app.set('db', conn); // add your connection to express
// var db = app.get('db'); // declare a db object for requests
let db = null;
const connectionInfo = "postgres://postgres:@localhost/ccv"
massive(connectionInfo).then(instance => {
  app.set('db', instance); // add your connection to express
  db = app.get('db'); // declare a db object for requests

  // console.log(db, 'db');
  // console.log(db, 'app newwww');
});

const mainCtrl = require("./controllers/mainCtrl.js");
const usersCtrl = require("./controllers/usersCtrl.js");
const adminCtrl = require("./controllers/adminCtrl.js");

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors());
app.use(express.static(__dirname + "/public"));    //current file directory + /public folder
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {
      profile: profile,
      token: accessToken
    }
    console.log('firing facebook login');

    try {
      db.get_user_by_fbid([profile.id]).then(user => {
        console.log('get_user_by_fbid');
        let firstName = profile.name.givenName;
        let lastName = profile.name.familyName;
        let email = profile.emails[0].value;
        let id = profile.id;

        if (!user[0]) {
          db.add_user([firstName, lastName, email, id]).then(user => {
            console.log("add_user");
            done(null, user);
          })
        } else {
          console.log("not a new users");
          done(null, user)
        }
      });

    }
    catch(err){
      console.log('get facebook user error', err);
      return done(err)
    }

  }
));

passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
  function(req, email, password, done) {
    console.log('hello world');
    db.users.findOne({ email: email }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      if(user.facebookid){
        return done(null, false, { message: 'This email has already been signed up through Facebook. Please login with Facebook to continue' });
      }
      bcrypt.compare(password, user.pass_hash, (err, comparedValue) => {
        if(comparedValue === false || comparedValue === undefined || comparedValue === null){

          return done(null, false, { message: 'Incorrect email or password' });
        } else {
          return done(null, user);
        }
      })
    });
  }
));


passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
  function(req, email, password, done) {

    let r = req.body;
    db.users.findOne({ email: email }).then(user => {
      // if (err) { return done(err); }
      if (user) {
        if (user.facebookid){
          return done(null, false, {message: 'This email has already been signed up through Facebook. Please login with Facebook to continue'})
        }
        return done(null, false, {message: 'Email is already being used'});
      } else {
        bcrypt.hash(password, 10, function(err, hash) {
          db.users.insert({firstname: r.firstname, lastname: r.lastname, email: req.body.email, pass_hash: hash, registered: moment().format()}).then(newUser => {
            // if(err){}
            return done(null, newUser)
          })
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    if(user[0]) {
      user = user[0];
    }
    done(null, user);
});

//FACEBOOK OAUTH
app.get("/auth/facebook", passport.authenticate('facebook', { scope: 'email'}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: '/#/', successRedirect:'/#/login-success'}))



app.post('/auth/login', function(req, res, next){
  passport.authenticate('local-login', function(err, user, info){
    if (err){
      return next(err);
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.send({ success : false, message : info.message });
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded' });
    });
  })(req, res, next)

});

app.post('/auth/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : info.message });
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded' });
    });
  })(req, res, next);
});

//USERS
app.put("/api/user/account", usersCtrl.isAuthenticated, usersCtrl.updateBasicAccount);
app.put("/api/user/account/pass", usersCtrl.isAuthenticated, usersCtrl.updatePass);
app.post("/api/user/favorites", usersCtrl.isAuthenticated, usersCtrl.updateFavorite);
app.get("/api/user/favorites", usersCtrl.isAuthenticated, usersCtrl.getFavorites);
app.get("/api/user/orders", usersCtrl.isAuthenticated, usersCtrl.getOrderHistory);
app.get("/api/user/orders/:id", usersCtrl.isAuthenticated, usersCtrl.getOrderHistoryById);
app.get('/api/user/logout', usersCtrl.isAuthenticated, usersCtrl.logout);


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true,
  auth: {
      user: config.nodemailerAuth.username, // Your email id
      pass: config.nodemailerAuth.pass // Your password
  }
});

app.put("/api/user/resetpassword", function(req, res){

  console.log(req.body, "loggin req.body");
  db.users.findOne({email: req.body.email}, (err, user) => {
    if(err){console.log(err); res.status(500).send(err)}

    console.log(user, "logging user");
    if(!user){
      res.send({success: false, message: "Email was not found"})
    } else if(user.facebookid){
      res.send({success: false, message: "Facebook users cannot reset password, please log in with Facebook"})
    } else {
      let rtoken = jwt.sign({email: user.email}, 'secret', {expiresIn: "1h"});
      console.log(rtoken, "logging rtoken");

      db.users.update({id: user.id, resettoken: rtoken}, (err, newUser) => {
        console.log(newUser, "new user");

        let text = "Hello " + user.firstname + ', <br><br> Please reset your password by clicking the link below: <br><br><a href="http://localhost:3010/#/passwordreset/' + newUser.resettoken +'">RESET PASSWORD</a>'

        var mailOptions = {
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

})

app.get("/api/user/resetpassword/:token", function(req, res){

  console.log(req.params.token, "req.params.token");
  let token = req.params.token;

  db.users.findOne({resettoken: token}, (err, user) => {
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

})

app.put("/api/user/savepassword/:token", function(req, res){

  //user token instead of email?
  // db.users.findOne({email: req.body.email}, (err, user) => {
  console.log(req.body, "reqbody");
  db.users.findOne({resettoken: req.params.token}, (err, user) => {

    if(req.body.pass == null || req.body.pass == "") {
      res.send({success: false, message: "Password not provied"});
    } else {
      bcrypt.hash(req.body.pass, 10, (err, hash) => {
        db.users.update({id: user.id, resettoken: null, pass_hash: hash}, (err, updatedUser) => {


          var mailOptions = {
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
})



// app.get("/api/checkauth", usersCtrl.loggedIn);
app.get("/api/checkauth", usersCtrl.isAuthenticated, function(req, res){
  console.log(req.reqUserAdmin, "ypu");
  if(req.reqUserAdmin){
    res.send(req.reqUserAdmin)
  } else {
    res.send({reqUserAdmin: false})
  }
});

app.get("/api/currentuser", usersCtrl.getCurrentUser)


//ORDERS
app.post("/api/email", mainCtrl.mail);



app.get("/api/order/:id/thankyou", function(req, res, next){
  /////// NEED TO SET SOME SORT OF EXPIRATION
 console.log("firing thank you now");
  // setTimeout(function(){
    db.get_thank_you_by_id([req.params.id]).then(order => {
      // if(err){
      //   console.log(err);
      //   res.status(500).send(err)
      // }
      // change tyexpired to true after 5 seconds, returning nothing to the front end
      setTimeout(function(){
        db.orders.update({id: req.params.id, tyexpired: true}).then(newOrder => {
          console.log(newOrder, "tyexpired has been updated to true");
        })
      }, 5000);

      console.log(order, "logging order in thankyou");
      res.send(order)
    })
  // }, 1000)

})

//CART
app.post("/api/cart", mainCtrl.addProductsToCart);
app.get("/api/cart", mainCtrl.getProductsInCart);
app.delete("/api/cart/:id", mainCtrl.deleteProductsInCart);
app.put("/api/cart", (req, res, next) => {
  console.log(req.body, "UPDATE CART");
  req.session.cart = req.body;
  res.send(req.session.cart);
})

/////// CONTACT ///////
app.post("/api/contact", mainCtrl.sendContactEmail)
/////// CONTACT ///////


/////// PRODUCTS ///////
app.get("/api/products", mainCtrl.getAllProducts);

// app.get("/api/products", function(req, res, next){
//   try {
//     db.get_all_products([]).then(products => {
//       console.log("products shown");
//       return res.send(products)
//     })
//   }
//   catch(err){
//     console.log(err, 'err');
//     return res.status(500).send(err)
//   }
// });


app.get("/api/products/:id", mainCtrl.getProductById);
app.get("/api/products/:id/details", mainCtrl.getProductById2);
app.get("/api/search/:name", mainCtrl.getProductByName);
app.get("/api/products/category/:id", mainCtrl.getProductByCategory);
/////// PRODUCTS ///////


/////// ADMIN ///////
app.get("/api/admin/products", adminCtrl.getAllAdminProducts);
app.get("/api/admin/products/:id/details", adminCtrl.getProductDetails);
app.get("/api/admin/orders/open", adminCtrl.getOpenOrders);
app.get("/api/admin/orders/closed", adminCtrl.getClosedOrders);
app.get("/api/admin/orders/count", adminCtrl.getOrderCount);

app.post("/api/admin/products", adminCtrl.addProductToDB);

app.put("/api/admin/products/:id", adminCtrl.updateProductById);
app.put("/api/admin/products/:id/sizeprice", adminCtrl.addSizePrice);
app.put("/api/admin/products/:id/categories", adminCtrl.updateCategories);

app.delete("/api/admin/products/:id", adminCtrl.deleteProductById);
app.delete("/api/admin/products/:id/sizeprice", adminCtrl.deleteSizePrice);
app.delete("/api/admin/products/:id/categories", adminCtrl.deleteCategories);

app.put("/api/admin/orders/open/:index", adminCtrl.completeOrder);
/////// ADMIN ///////



// NOT MVP
// app.post("/api/users/:id");
// app.put("/api/users/:id");
// app.delete("/api/users/:d");


app.post("/api/charge", function(req, res, next){

  // Get the credit card details submitted by the form
  var token = req.body.stripeToken; // Using Express
  var guestUser = req.body.stripeTokenCard.metadata;
  console.log(req.body, "LOgging Body");
  console.log(guestUser, "logging guestUser");
  // Create a charge: this will charge the user's card
  var charge = stripe.charges.create({
    amount: req.body.price, // Amount in cents
    currency: "usd",
    source: token,
    description: "Decal Purchase",
    // metadata: {"guestUser": req.body.stripeTokenCard.metadata}
    metadata: {'guestUser': guestUser.guestUser}


  }, function(err, charge) {
    console.log(req.body.price, "req.body.price 2");
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      console.log("Your card was declined");
    } else {
      console.log("Your payment was successful");
      mainCtrl.addOrder(req,res,charge);
      console.log("sending charge");
      console.log(charge, "CHARGE in SERVER");
      // res.status(200).send(charge);

    }
  });

})


//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
