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

isAuthenticated = (req, res, next) => {
  if(req.user){
    // console.log("req.user true");
    if(req.user.admin){
      // console.log("req.user.admin true");
      req.reqUserAdmin = {reqUserAdmin: true} //use this method to pass a variable through next()
      return next()
    }
    req.reqUser = {reqUser: true};
    // console.log("no admin");
    return next();
  } else {
    // console.log("sending no user lol");
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


//PRODUCTS
app.get("/api/admin/products", (req,res) => {
  db.admin_get_all_products([], function(err, products){
    if(err){
      console.log(err);
      return res.status(500).send(err)
    }
    console.log("admin products shown");
    return res.send(products)
  })
});

app.get("/api/products", mainCtrl.getAllProducts);
app.get("/api/products/:id", mainCtrl.getProductById);
app.get("/api/products/:id/details", mainCtrl.getProductById2);
app.get("/api/search/:name", mainCtrl.getProductByName);
app.get("/api/cat/:id", mainCtrl.getProductByCategory); //////////// not working
app.post("/api/products", mainCtrl.addProductToDB);
app.put("/api/products/:id", mainCtrl.updateProductById);
app.delete("/api/products/:id", mainCtrl.deleteProductById);


app.get("/api/admin/products/:id/details", function(req, res){
  var wholeProduct = {};
  db.run("SELECT prices.price, sizes.height, sizes.width FROM products INNER JOIN product_price_size ON products.id = product_price_size.productId INNER JOIN prices ON prices.id = product_price_size.priceId INNER JOIN sizes ON sizes.id  = product_price_size.sizeId WHERE products.id = $1 order by product_price_size.id", [req.params.id], function(err, product){
    if(err){
      console.log(err);
      return res.status(500).send(err)
    }
    console.log("getProductById2");
    wholeProduct.product = product;

    db.run("SELECT count(*) FROM favorites WHERE product_id = $1", [req.params.id], (err, totalFavs) => {
      if(err){
        console.log(err);
        res.status(500).send(err);
      }

      wholeProduct.totalFavs = totalFavs;

      if(req.user){
        db.favorites.findOne({user_id: req.user.id, product_id: req.params.id}, (err, found) => {
          if(err){
            console.log(err);
            res.status(500).send(err);
          }

          if(found){
            wholeProduct.favFound = true;
            // console.log(wholeProduct, "holdprodcut");
            res.send(wholeProduct)

          } else {
            // no favorite found
            res.send(wholeProduct)
          }
        })
      } else {
        res.send(wholeProduct)
      }
    })

  })
})

//admin
app.put("/api/products/:id/sizeprice", (req, res) => {
  console.log(req.params.id, "req.params.id haha");
  console.log(req.body, "req.body");
  let index = req.body.index;
  let height = req.body.height;
  let width = req.body.width;
  let price = req.body.price;
  let loopCount = 0;

  // NEED TO FIND OBJ ID TO UPDATE SPECIFIC ITEM IN OBJ

  db.sizes.findOne({height: height, width: width}, (err, foundSize) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }

    if(foundSize){
      console.log("the same size was found");
      db.prices.findOne({price: price}, (err, foundPrice) => {
        if(err){
          console.log(err);
          res.status(500).send(err);
        }

        if(foundPrice){
          console.log("the same price was found");

          //trying to find out how to get correct index in product_price_size table from frontend - problem: it's sorted by price in front end
          db.run("SELECT * FROM product_price_size WHERE productid = $1", [req.params.id], (err, product) => {
            if(err){
              console.log(err);
              res.status(500).send(err);
            }

            console.log(product, "logging product 244");
            product.forEach(function(r, i){
              if(index === i){
                console.log(r, "found the correct index");
                loopCount++

                db.product_price_size.save({id: r.id, priceid: foundPrice.id, sizeid: foundSize.id }, function(err, updatedPrice){
                  if(err){
                    console.log(err);
                    res.status(500).send(err)
                  }

                  console.log(updatedPrice, "updated price after .save()");
                })

              } else {
                console.log("cant find it");
              }
            })

            console.log(loopCount);

            if(!loopCount){
              console.log("running this part because loopCount = " + loopCount);
                db.product_price_size.insert({productid: req.params.id, priceid: foundPrice.id, sizeid: foundSize.id}, (err, addedPps) => {
                  if(err){
                    console.log(err);
                    res.status(500).send(err);
                  }
                  console.log(addedPps, "THESE CONNECT NEW ROW YAYYY");
                })

            }

          })
        } else {
          console.log("price not in db");
          db.prices.insert({price: price}, (err, addedPrice) => {
            if(err){
              console.log(err);
              res.status(500).send(err);
            }
            if(addedPrice){
              console.log("new price added");

              db.run("SELECT * FROM product_price_size WHERE productid = $1", [req.params.id], (err, product) => {
                if(err){
                  console.log(err);
                  res.status(500).send(err);
                }

                console.log(product, "logging product 341");
                product.forEach(function(r, i){
                  if(index === i){
                    console.log(r, "he be de correct index");
                    loopCount++

                    db.product_price_size.save({id: r.id, priceid: addedPrice.id, sizeid: foundSize.id }, function(err, updatedPrice){
                      if(err){
                        console.log(err);
                        res.status(500).send(err)
                      }

                      console.log(updatedPrice, "UPDATED PRICE AFTER SAVE()");
                    })

                  } else {
                    console.log("cant find it");
                  }
                })

                console.log(loopCount);

                if(!loopCount){
                  console.log("running this part because loopCount = " + loopCount);
                  db.product_price_size.insert({productid: req.params.id, priceid: addedPrice.id, sizeid: foundSize.id}, (err, addedPps) => {
                    if(err){
                      console.log(err);
                      res.status(500).send(err);
                    }
                    console.log(addedPps, "added a new price then connected them!");
                  })
                }
              })
            }
          })
        }
      })
    } else {
      console.log("sizes werent found");
      // db.sizes.insert({height: height, width: width}, (err, addedSize) => {
      //   if(err){
      //     console.log(err);
      //     res.status(500).send(err)
      //   }
      //   console.log(addedSize, "new size added");
      //   if(addedSize){
      //     console.log("new size added = true");
      //     // db.product_price_size.insert({productid: req.params.id, sizeid: addedSize.id}, (err, pps) => {
      //     //   if(err){
      //     //     console.log(err);
      //     //     res.status(500).send(err);
      //     //   }
      //     //   console.log(pps, "product_price_size");
      //     // })
      //   }
      // })
    }



  }) //end db.sizes.findOne
})

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


looper = (array, index, loopCount) => {

  array.forEach(function(r, i){
    if(index === i){
      console.log(r, "found the correct index");
      loopCount++

      db.product_price_size.save({id: r.id, priceid: foundPrice.id, sizeid: foundSize.id }, function(err, updatedPrice){
        if(err){
          console.log(err);
          res.status(500).send(err)
        }

        console.log(updatedPrice, "updated price after .save()");
      })

    } else {
      console.log("cant find it");
    }
  })

}



//listening
app.listen(config.port, function(){
  console.log("listening on port", config.port);
})
