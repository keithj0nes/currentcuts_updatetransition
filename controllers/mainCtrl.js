var app = require("../server.js");
var db = app.get('db');


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

//post
  addProductsInCart: function(req, res, next){
    console.log("addProductsInCart");
    res.send("addProductsInCart");
  },

  addOrder: function(req, res, next){
    console.log("addOrder");
    res.send("addOrder");
  }







}
