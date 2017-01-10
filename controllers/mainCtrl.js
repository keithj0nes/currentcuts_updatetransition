const app = require("../server.js");
const db = app.get('db');


module.exports = {

//get
  getAllProducts: function(req, res, next){
    db.get_all_products([], function(err, products){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log("products shown");
      return res.send(products)
    })
  },

  getProductById: function(req, res, next){
    db.get_product_by_id([req.params.id], function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log("Specific item");
      return res.send(product)

    })

  },

  //simple search
  getProductByName: function(req, res, next){
    const searchTerm = "%" + req.params.name + "%";
    console.log(searchTerm);
    db.get_product_by_name([searchTerm], function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log("Searched item", req.params.name);
      return res.send(product)

    })

  },

  getProductByCategory: function(req, res, next){
    console.log(req.params.id);
    db.get_product_by_cat([req.params.id], function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log("Specific item");
      return res.send(product)
    })
  },

//post
  addProductToDB: function(req, res, next){
    const newProduct = [req.body.name, req.body.description, req.body.price, req.body.img1, req.body.img2];
    db.add_product(newProduct, function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      return res.status(200).send(product)
    })
  },

  addProductsToCart: function(req, res, next){

    if(!req.session.cart){
      req.session.cart = [];
    }

    req.session.cart.push(req.body);
    // console.log(req.session.cart, "after pusshinggg");
    res.send("addProductsInCart");
  },

  getProductsInCart: function(req, res, next){
    res.send(req.session.cart);
  },

  deleteProductsInCart: function(req, res, next){
    req.session.cart.splice(req.params.id, 1);
    res.send(req.session.cart);
  },



  updateProductById: function(req, res, next){
    const updateProduct = [req.body.name, req.body.description, req.body.price, req.body.img1, req.body.img2, req.params.id];
    console.log(updateProduct);
    console.log("update function fired!");
    db.update_product(updateProduct, function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      return res.status(200).send(product)
    })
  },

  addOrder: function(req, res, charge){
    var timeNow = new Date();

    db.orders.insert({
      userid: req.user.id,
      datesold: timeNow
    }, function(err, order){
      if(err){
        console.log("OMG AN AERRYOR", err);
        res.status(500).send(err)
      } else {
        console.log("this should be good");
        for(var i = 0; i < req.session.cart.length; i++){
          console.log(order.id, "HERE IS ORDER.ID");
          console.log(req.session.cart[i].productQuantity, 'PRODUCT QUANTITY');
          db.orderline.insert({
            orderid: order.id,
            productid: req.session.cart[i].productId,
            quantsold: req.session.cart[i].productQuantity
          }, function(err, orderline){
            if(err){
              console.log("ANOTHER ERRORRR", err);

              res.status(500).send(err);
            }
          })
        }
        req.session.cart = [];
        console.log(req.session.cart, "req.session.cart");
        res.status(200).send(charge);
        console.log(charge, "charge sent");

      }
    })


    // id SERIAL PRIMARY KEY,
    // orderId INTEGER REFERENCES orders(id),
    // productId INTEGER REFERENCES products(id),
    // quantSold INT

  },


  //delete

  deleteProductById: function(req, res, next){
    console.log("deleted function fired");
    console.log(req.params.id);
    const deletedProduct = [req.params.id];
    db.delete_product(deletedProduct, function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      return res.status(200).send(product)
    })
  }







}
