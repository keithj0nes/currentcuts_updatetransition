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
      console.log("products shown", products);
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

  getProductById2: function(req, res, next){
    db.get_product_by_id_details([req.params.id], function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log("getProductById2");
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







} //end module exports



// module.exports = {
//   mail: (req,res,next)=>{
//     const app = require('../index')
//     const nodemailer = require('nodemailer');
//     const hbs = require('nodemailer-express-handlebars');
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       secure: true,
//       auth: {
//         user: process.env.emailAddress,
//         pass: process.env.emailPas
//       }
//     });
//     //
//     if(req.body.order){
//       let text = 'name: '+req.body.name+'\n\n'+'phone: '+req.body.phone+'\n\n'+'order: '+req.body.order+'\n\n'+'message: '+req.body.message;
//       let mailOptions = {
//         from: process.env.emailAddress, // sender address // your email address
//         to: process.env.emailAddress, // list of receivers // their email address
//         subject: 'From:'+req.body.email+'  RETURN', // Subject line
//         text: text//, // plaintext body
//       };
//       transporter.sendMail(mailOptions, function(error, info){
//           if(error){
//               console.log(error);
//               res.send('error');
//           }else{
//               console.log('Message sent: ' + info.response);
//               res.send({yo: info.response});
//           };
//       });
//     }else{
//       let text = 'name: '+req.body.name+'\n\n'+'phone: '+req.body.phone+'\n\n'+'message: '+req.body.message;
//       let mailOptions = {
//         from: process.env.emailAddress, // sender address
//         to: process.env.emailAddress, // list of receivers
//         subject: 'From:'+req.body.email, // Subject line
//         text: text//, // plaintext body
//         // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
//       };
//       transporter.sendMail(mailOptions, function(error, info){
//         if(error){
//           console.log(error);
//           res.send('error');
//         }else{
//           console.log('Message sent: ' + info.response);
//           res.send({yo: info.response});
//         };
//       });
//     }
//   }
// }
