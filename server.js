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

isAuthenticated = (req, res, next) => {
  if(req.user){
    if(req.user.admin){
      req.reqUserAdmin = {reqUserAdmin: true} //use this method to pass a variable through next()
      return next()
    }
    req.reqUser = {reqUser: true};
    return next();
  } else {
    res.send({reqUser: false})
  }
}

// isAdmin = (req, res, next) => {
//   console.log("running isAdmin");
//   if(req.user){
//     if(req.user.admin){
//       console.log("req.user.admin is true");
//       return next();
//     } else {
//       console.log("sending not an admin");
//       res.send({reqUserAdmin: false})
//     }
//   } else {
//     console.log("sending no logged in user");
//     res.send({reqUser: false})
//   }
// }

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
  // console.log(user, "loggin user in serializeUser");
    done(null, user);
});

passport.deserializeUser(function(user, done) {
  // console.log(user, "logging user in deserializeUser");
    if(user[0]) {
      user = user[0];
    }
    done(null, user);
});

//FACEBOOK OAUTH
app.get("/auth/facebook", passport.authenticate('facebook', { scope: 'email'}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {
failureRedirect: '/#/', successRedirect:'/#/login-success'
}))

//USERS
app.put("/api/user/email", isAuthenticated, usersCtrl.updateEmail);
app.post("/api/user/favorites", isAuthenticated, usersCtrl.updateFavorite);
app.get("/api/user/favorites", isAuthenticated, usersCtrl.getFavorites);
app.get("/api/user/orders", isAuthenticated, usersCtrl.getOrderHistory);
app.get("/api/user/orders/:id", isAuthenticated, usersCtrl.getOrderHistoryById);
app.get('/api/user/logout', isAuthenticated, usersCtrl.logout);

// app.get("/api/checkauth", usersCtrl.loggedIn);
app.get("/api/checkauth", isAuthenticated, function(req, res){
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
    db.get_thank_you_by_id([req.params.id], function(err, order){
      if(err){
        console.log(err);
        res.status(500).send(err)
      }
      // change tyexpired to true after 5 seconds, returning nothing to the front end
      setTimeout(function(){
        db.orders.update({id: req.params.id, tyexpired: true}, function(err, newOrder){
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
      // console.log(charge, "CHARGE in SERVER");
      // res.status(200).send(charge);

    }
  });

})


//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
