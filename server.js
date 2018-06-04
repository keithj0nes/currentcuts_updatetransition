const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");
const flash = require('connect-flash');
const stripe = require("stripe")(config.stripeKeyTest);

////////////////////////
////////////////////////
const aws = require("aws-sdk");
const multer = require('multer');
const multerS3 = require("multer-s3");
////////////////////////
////////////////////////


const app = module.exports = express();
//sync to database
let db = null;
const connectionInfo = "postgres://postgres:@localhost/ccv"
// const connectionInfo = config.psqlConnString;
massive(connectionInfo, {excludeMatViews: true}).then(instance => {
  app.set('db', instance); // add your connection to express
  db = app.get('db'); // declare a db object for requests
}).catch(err => {
  console.log(err, 'massive err');
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
////////////////
////////////////
////////////////
////////////////
app.use(cors({origin: true, credentials: true}));
////////////////
////////////////
////////////////
////////////////
////////////////

app.use(express.static(__dirname + "/public"));    //current file directory + /public folder
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


const bname = "currentcuts";
const ukey = "";
const usec = "";

// app.post("/api/upload", upload.any(), function(req, res){
app.post("/api/upload",  function(req, res){

  console.log(req.body, 'body');
  console.log(req.file, 'file');


  let s3 = new aws.S3({
    accessKeyId: ukey,
    secretAccessKey: usec//,
    // Bucket: bname
  })
  var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'currentcuts',
        acl: 'public-read',
        metadata: function ( req, file, cb){
          cb( null, {fieldname: file.fieldname});
        },
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    }),
    fileFilter: function(req, file, callback) {
      console.log(file, 'file');

      //get extension by getting file type after last dot
      const ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg') {
        // return callback(res.end('Only images are allowed'), null)
        console.log('only images!');
        return callback(res.send({accepted: false, message: 'Please submit only image files'}), false)

        // res.send('only images!')
      }

      callback(null, true)
    }
  }).fields([
      {name: 'productImgOne', maxCount: 1},
      {name: 'productImgTwo', maxCount: 1},
      {name: 'productImgThree', maxCount: 1},
      {name: 'productShowcase', maxCount: 5},
  ]);

  upload(req, res, function(err){
    if(err){
      console.log(err, 'err22');

      // return res.send(err)
    }
    // res.send('file uploaded!')
  })




  //   res.send('sent')
    // function uploadToS3(file){
    //   let s3bucket = new aws.S3({
    //     accessKeyId: ukey,
    //     secretAccessKey: usec//,
    //     // Bucket: bname
    //   })
    //
    //   s3bucket.createBucket(() => {
    //     var params = {
    //       Bucket: bname,
    //       Key: file.name,
    //       Body: file.data
    //     }
    //
    //     s3bucket.upload({params, (err, data) => {
    //       if (err) {
    //         console.log(err, 'error');
    //         return err
    //       }
    //
    //       console.log(data, 'SUCCESSSSS!');
    //       return data
    //     }})
    //   })
    // }
})

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
app.get("/api/products/more", productsCtrl.getMoreProducts);

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
  // Create a charge: this will charge the user's card
  const charge = stripe.charges.create({
    amount: req.body.price, // Amount in cents
    currency: "usd",
    source: token,
    description: "Decal Purchase",
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
      // res.status(200).send(charge);
    }
  });

})


//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
