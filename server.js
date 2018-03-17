const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");
const flash = require('connect-flash');
const stripe = require("stripe")("sk_test_O4Zh9ql3gliRLlGILelnZ4rz");


const app = module.exports = express();

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
const usersLoginCtrl = require("./controllers/usersLoginCtrl");

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

/////// AUTH ///////
app.post("/auth/login", usersLoginCtrl.localLogin);
app.post("/auth/signup", usersLoginCtrl.localSignup);
app.get("/auth/facebook", usersLoginCtrl.fbLogin);
app.get("/auth/facebook/callback", usersLoginCtrl.fbCallback);
app.get("/auth/checkauth", usersLoginCtrl.isAuthenticated, usersLoginCtrl.isAdmin)
app.get("/auth/currentuser", usersCtrl.getCurrentUser)
/////// AUTH ///////

/////// USERS ///////
app.put("/api/user/account", usersLoginCtrl.isAuthenticated, usersCtrl.updateBasicAccount);
app.put("/api/user/account/pass", usersLoginCtrl.isAuthenticated, usersCtrl.updatePass);
app.post("/api/user/favorites", usersLoginCtrl.isAuthenticated, usersCtrl.updateFavorite);
app.get("/api/user/favorites", usersLoginCtrl.isAuthenticated, usersCtrl.getFavorites);
app.get("/api/user/orders", usersLoginCtrl.isAuthenticated, usersCtrl.getOrderHistory);
app.get("/api/user/orders/:id", usersLoginCtrl.isAuthenticated, usersCtrl.getOrderHistoryById);
app.get("/api/user/logout", usersLoginCtrl.isAuthenticated, usersLoginCtrl.logout);

app.put("/api/user/resetpassword", usersCtrl.resetPasswordEmail);
app.get("/api/user/resetpassword/:token", usersCtrl.resetPasswordToken);
app.put("/api/user/savepassword/:token", usersCtrl.savePassword);
/////// USERS ///////





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
