const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const app = module.exports = express();

// var userSchema

//sync to database
var conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/ccv"
});
// add your connection to express
app.set('db', conn);
// declare a db object for requests
var db = app.get('db');

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
    // console.log(profile.emails[0].value);

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




//CART
app.post("/api/cart", mainCtrl.addProductsInCart);
app.post("/api/order", mainCtrl.addOrder);





//PRODUCTS
app.get("/api/products", mainCtrl.getAllProducts);
app.get("/api/products/:id", mainCtrl.getProductById);
app.get("/api/search/:name", mainCtrl.getProductByName);
app.get("/api/cat/:id", mainCtrl.getProductByCategory); //////////// not working
app.post("/api/products", mainCtrl.addProductToDB);
app.put("/api/products/:id", mainCtrl.updateProductById);
app.delete("/api/products/:id", mainCtrl.deleteProductById);

// NOT MVP
// app.post("/api/users/:id");
// app.put("/api/users/:id");
// app.delete("/api/users/:d");


//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
