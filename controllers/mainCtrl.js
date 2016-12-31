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

  addProductsInCart: function(req, res, next){
    console.log("addProductsInCart");
    res.send("addProductsInCart");
  },

  addOrder: function(req, res, next){
    console.log("addOrder");
    res.send("addOrder");
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
