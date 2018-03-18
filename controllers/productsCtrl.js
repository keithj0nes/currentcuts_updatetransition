const app = require("../server.js");

module.exports = {
  getAllProducts: function(req, res, next){
    const db = app.get('db');
    try {
      db.get_all_products([]).then(products => {
        console.log("products shown");
        return res.send(products)
      })
    }
    catch(err){
      console.log(err);
      return res.status(500).send(err)
    }
  },

  getProductById: function(req, res, next){
    const db = app.get('db');
    try {
      db.get_product_by_id([req.params.id]).then((product)=> {
        return res.send(product)
      })
    }
    catch(err){
      console.log(err);
      return res.status(500).send(err)
    }

  },

  getProductById2: function(req, res, next){
    const db = app.get('db');
    try {
      let wholeProduct = {};
      db.get_product_by_id_details([req.params.id]).then(product => {
        // console.log(product, 'getProductById2');
        wholeProduct.product = product;

        try {
          db.query("SELECT count(*) FROM favorites WHERE product_id = $1", [req.params.id]).then(totalFavs => {
            wholeProduct.totalFavs = totalFavs;

            if(req.user){
              try {
                db.favorites.findOne({user_id: req.user.id, product_id: req.params.id}).then(found => {
                  if(found){
                    wholeProduct.favFound = true;
                    res.send(wholeProduct)
                  } else {
                    // no favorite found
                    res.send(wholeProduct)
                  }
                })
              }
              catch(err){
                console.log(err);
                return res.status(500).send(err)
              }
            } else {
              res.send(wholeProduct);
            }
          })
        }
        catch(err){
          console.log(err);
          return res.status(500).send(err)
        }
      })
    }
    catch(err){
      console.log(err);
      return res.status(500).send(err)
    }
  },
  //simple search
  getProductByName: function(req, res, next){
    const db = app.get('db');
    const searchTerm = "%" + req.params.name + "%";
    console.log(searchTerm, "Searched item");
    try {
      db.get_product_by_name([searchTerm]).then(product => {
        return res.send(product)
      })
    }
    catch(err) {
      return res.status(500).send(err)
    }
  },

  getProductByCategory: function(req, res, next){
    const db = app.get('db');
    console.log(req.params.id, "in cat id haha");
    try {
      db.query("SELECT * FROM categories WHERE parent_id = (SELECT id FROM categories WHERE name = $1)", [req.params.id]).then(categoryProducts => {
        if(categoryProducts.length <= 0){
          db.query("SELECT DISTINCT on (products.id) products.*, prices.price FROM products INNER JOIN product_price_size ON products.id = product_price_size.productId INNER JOIN prices ON prices.id = product_price_size.priceId INNER JOIN product_category ON products.id = product_category.product_id INNER JOIN categories ON categories.id = product_category.category_id WHERE active = true AND (archived IS NULL OR archived = false) AND categories.name = $1 ORDER BY products.id, prices.price", [req.params.id]).then(categoryProductsDetails => {
            return res.send({categoryProductsDetails: categoryProductsDetails, bottomlevel: true})
          })
        } else {
          return res.send(categoryProducts);
        }
      })
    }
    catch(err){
      return res.status(500).send(err)
    }
  }
}
