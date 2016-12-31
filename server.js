const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const massive = require("massive");
const config = require("./config.js");
const passport = require("passport");

const app = module.exports = express();

//sync to database
var conn = massive.connectSync({
  connectionString : "postgres://postgres:@localhost/ccv"
});
// add your connection to express
app.set('db', conn);
// declare a db object for requests
var db = app.get('db');

const mainCtrl = require("./controllers/mainCtrl.js")


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





// MVP
app.get("/api/products", mainCtrl.getAllProducts);
app.get("/api/products/:id", mainCtrl.getProductById);
app.get("/api/search/:name", mainCtrl.getProductByName);

app.post("/api/cart", mainCtrl.addProductsInCart);
app.post("/api/order", mainCtrl.addOrder);
// app.get("/auth/paypal", passport.authenticate)


// NOT MVP
app.post("/api/products", mainCtrl.addProductToDB);
app.put("/api/products/:id", mainCtrl.updateProductById);



app.delete("/api/products/:id", mainCtrl.deleteProductById);
//
// app.post("/api/users/:id");
// app.put("/api/users/:id");
// app.delete("/api/users/:d");


//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})





  // {
  //   "name": "Hey man",
  //   "description": "Wanddfasdgas decal",
  //   "price": 4,
  //   "img1": "linktoimageone",
  //   "img2": "linktoimage2"
  // },
