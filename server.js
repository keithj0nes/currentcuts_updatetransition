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
// const connectionInfo = config.psqlConnString;


massive(connectionInfo, {excludeMatViews: true}).then(instance => {
  app.set('db', instance); // add your connection to express
  db = app.get('db'); // declare a db object for requests
  // console.log(db, 'db');
  // console.log(db, 'app newwww');
}).catch(err => {
  console.log(err, 'err');
});

const mainCtrl = require("./controllers/mainCtrl.js");
const usersCtrl = require("./controllers/usersCtrl.js");
const cartCtrl = require("./controllers/cartCtrl.js");
const productsCtrl = require("./controllers/productsCtrl.js");
const adminCtrl = require("./controllers/adminCtrl.js");
const authCtrl = require("./controllers/authCtrl.js");

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
app.post("/auth/login", authCtrl.localLogin);
app.post("/auth/signup", authCtrl.localSignup);
app.get("/auth/facebook", authCtrl.fbLogin);
app.get("/auth/facebook/callback", authCtrl.fbCallback);
app.get("/auth/checkauth", authCtrl.isAuthenticated, authCtrl.isAdmin);
app.get("/auth/currentuser", authCtrl.getCurrentUser);
app.get("/auth/logout", authCtrl.isAuthenticated, authCtrl.logout);
/////// AUTH ///////


/////// USERS ///////
app.put("/api/user/account", authCtrl.isAuthenticated, usersCtrl.updateBasicAccount);
app.put("/api/user/account/pass", authCtrl.isAuthenticated, usersCtrl.updatePass);
app.post("/api/user/favorites", authCtrl.isAuthenticated, usersCtrl.updateFavorite);
app.get("/api/user/favorites", authCtrl.isAuthenticated, usersCtrl.getFavorites);
app.get("/api/user/orders", authCtrl.isAuthenticated, usersCtrl.getOrderHistory);
app.get("/api/user/orders/:id", authCtrl.isAuthenticated, usersCtrl.getOrderHistoryById);
app.put("/api/user/resetpassword", usersCtrl.resetPasswordEmail);
app.get("/api/user/resetpassword/:token", usersCtrl.resetPasswordToken);
app.put("/api/user/savepassword/:token", usersCtrl.savePassword);
/////// USERS ///////


/////// ORDERS ///////
app.post("/api/orders/confirmationemail", mainCtrl.confirmationEmail);
app.get("/api/orders/:id/thankyou", mainCtrl.sendThankyou);
/////// ORDERS ///////


/////// CART ///////
app.post("/api/cart", cartCtrl.addToCart);
app.get("/api/cart", cartCtrl.getCart);
app.put("/api/cart", cartCtrl.updateCart);
app.delete("/api/cart/:id", cartCtrl.deleteInCart);
/////// CART ///////


/////// CONTACT ///////
app.post("/api/contact", mainCtrl.sendContactEmail)
/////// CONTACT ///////


/////// PRODUCTS ///////
app.get("/api/products", productsCtrl.getAllProducts);
app.get("/api/products/:id", productsCtrl.getProductById);
app.get("/api/products/:id/details", productsCtrl.getProductById2);
app.get("/api/products/search/:name", productsCtrl.getProductByName);
app.get("/api/products/category/:id", productsCtrl.getProductByCategory);
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
app.put("/api/admin/orders/open/:index", adminCtrl.completeOrder);

app.delete("/api/admin/products/:id", adminCtrl.deleteProductById);
app.delete("/api/admin/products/:id/sizeprice", adminCtrl.deleteSizePrice);
app.delete("/api/admin/products/:id/categories", adminCtrl.deleteCategories);

/////// ADMIN ///////

app.post("/api/charge", function(req, res, next){

  // Get the credit card details submitted by the form
  const token = req.body.stripeToken; // Using Express
  const guestUser = req.body.stripeTokenCard.metadata;
  console.log(req.body, "LOgging Body");
  console.log(guestUser, "logging guestUser");
  // Create a charge: this will charge the user's card
  const charge = stripe.charges.create({
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
