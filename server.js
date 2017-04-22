const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");
const nodemailer = require("nodemailer");
const FacebookStrategy = require("passport-facebook").Strategy;
var stripe = require("stripe")("sk_test_O4Zh9ql3gliRLlGILelnZ4rz");


const app = module.exports = express();

// var userSchema

//sync to database
var conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/ccv"
  // connectionString: config.psqlConnString
});

app.set('db', conn); // add your connection to express
var db = app.get('db'); // declare a db object for requests

const mainCtrl = require("./controllers/mainCtrl.js");
const usersCtrl = require("./controllers/usersCtrl.js");




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

    db.get_user_by_fbid([profile.id], function(err, user) {
      if (err) {
        return done(err);
      }

      let firstName = profile.name.givenName;
      let lastName = profile.name.familyName;
      let email = profile.emails[0].value;
      let id = profile.id;

      // console.log(firstName, lastName, email, id);

      if (!user[0]) {
        db.add_user([firstName, lastName, email, id], function(err, user){
          if(err){
            console.log(err);
            return done(err);
          }
          done(null, user);
        })
      } else {
        done(null, user)
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
app.get("/auth/facebook", passport.authenticate('facebook'));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
failureRedirect: '/#/', successRedirect:'/#/login-success'
}))

//USERS
app.get("/api/checkauth", usersCtrl.loggedIn);
app.get("/api/currentuser", usersCtrl.getCurrentUser)
app.get('/logout', function(req, res){
  console.log(req.user, "user in serverjs");
  req.logout();
  res.redirect('/');
  console.log(req.user, "user in serverjs after logged out");
});


app.get("/api/orderhistory", function(req,res,next){
  if(req.user){
    db.orderhistory([req.user.id], function(err, history){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      return res.status(200).send(history)
    })
  } else {
    console.log("Unauthorized");
    res.send({requser:false})
  }
})

app.get("/api/order/:id", function(req, res, next){
  if(req.user){
    db.get_order_details_by_id([req.params.id, req.user.id], function(err, order){
      if(err){
        console.log(err);
        res.status(500).send(err)
      }

//// if order id is not associated with user id, results = false, else send order
      if(order.length <= 0){
        console.log("NO RESULTS SHOW");
        res.send({results: false})
      } else {
        console.log(order, "history being sent");
        res.status(200).send(order)
      }

    })
  } else {
    console.log("no user");
    res.send({requser: false})
  }

})

//CART
app.post("/api/cart", mainCtrl.addProductsToCart);
app.get("/api/cart", mainCtrl.getProductsInCart);
app.delete("/api/cart/:id", mainCtrl.deleteProductsInCart);

//PRODUCTS
app.get("/api/products", mainCtrl.getAllProducts);
app.get("/api/products/:id", mainCtrl.getProductById);
app.get("/api/products2/:id", mainCtrl.getProductById2);
app.get("/api/search/:name", mainCtrl.getProductByName);
app.get("/api/cat/:id", mainCtrl.getProductByCategory); //////////// not working
app.post("/api/products", mainCtrl.addProductToDB);
app.put("/api/products/:id", mainCtrl.updateProductById);
app.delete("/api/products/:id", mainCtrl.deleteProductById);

// NOT MVP
// app.post("/api/users/:id");
// app.put("/api/users/:id");
// app.delete("/api/users/:d");

app.post("/api/email", mainCtrl.mail);


app.post("/api/charge", function(req, res, next){

  // Get the credit card details submitted by the form
  var token = req.body.stripeToken; // Using Express

  // Create a charge: this will charge the user's card
  var charge = stripe.charges.create({
    amount: req.body.price, // Amount in cents
    currency: "usd",
    source: token,
    description: "Hello",

  }, function(err, charge) {
    console.log(req.body.price, "req.body.price 2");
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
      console.log("Your card was declined");
    } else {
      console.log("Your payment was successful");
      mainCtrl.addOrder(req,res,charge);
      console.log("sending charge");
      // console.log(charge, "CHARGE in SERVER");
      // res.status(200).send(charge);

    }
  });

})




//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
