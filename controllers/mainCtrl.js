const app = require("../server.js");
const db = app.get('db');
const nodemailer = require("nodemailer");
const config = require("../config.js");
const userCtrl = require("./usersCtrl.js")


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
    console.log(req.user, "loggin userszzzz");

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

    let cartTotal = 0;
    req.session.cart.forEach(function(i){
      cartTotal += i.productQuantity * i.productPrice;
    })

    db.orders.insert({
      userid: req.user.id,
      datesold: timeNow,
      ordertotal: cartTotal
    }, function(err, order){
      if(err){
        console.log("OMG AN AERRYOR", err);
        res.status(500).send(err)
      } else {
        console.log("this should be good");
        req.session.cart.forEach(function(product, index){
          console.log(product, "result in forEach");
          console.log(index, "index in forEach");

          let matches = product.productSize.match(/(\d+)H x (\d+)/);
          let number1 = Number(matches[1]);
          let number2 = Number(matches[2]);
          let obj = {
            height: number1,
            width: number2
          }

          let myPrice = product.productPrice;
          let myProductId = product.productId;
          let myProductQ = product.productQuantity;

          db.sizes.findOne(obj, function(err, sResult){
            if(err){
              console.log(err, "here's an errror");
              res.status(500).send(err)
            }
              console.log(sResult, "result in finding sizes");
              let sizesid = sResult.id;

              db.prices.findOne({price: myPrice}, function(err, pResult){
                if(err){
                  console.log(err, "logging err in productPrice.findOne");
                  res.status(500).send(err)
                }
                  console.log(pResult, "result in finding prices");
                  let pricesid = pResult.id



                  console.log(number1, "FIRST NUMBER");
                  console.log(number2, "SECOND VALUE");
                  console.log(order.id, "HERE IS ORDER.ID");
                  // console.log(req.session.cart[i], 'req.session.cart[i]');
                  db.orderline.insert({
                    orderid: order.id,
                    productid: myProductId,
                    quantsold: myProductQ,
                    sizeid: sizesid,
                    priceid: pricesid
                  }, function(err, orderline){
                    if(err){
                      console.log("ANOTHER ERRORRR", err);
                      res.status(500).send(err);
                    }
                    console.log(orderline, "orderline");
                  }) //end db.orderline.insert

              }) //end db.prices.findOne

          }) //end db.sizes.findOne

        }) // end forEach

        // for(var i = 0; i < req.session.cart.length; i++){
        //
        //   let matches = req.session.cart[i].productSize.match(/(\d+)H x (\d+)/);
        //   let number1 = Number(matches[1]);
        //   let number2 = Number(matches[2]);
        //   let obj = {
        //     height: number1,
        //     width: number2
        //   }
        //
        //   let myPrice = req.session.cart[i].productPrice;
        //   let myProductId = req.session.cart[i].productId;
        //   let myProductQ = req.session.cart[i].productQuantity;
        //   // var sizesid;
        //   // var pricesid;
        //
        //   db.sizes.findOne(obj, function(err, sResult){
        //     if(err){
        //       console.log(err, "here's an errror");
        //       res.status(500).send(err)
        //     }
        //       console.log(sResult, "result in finding sizes");
        //       var sizesid = sResult.id;
        //
        //       db.prices.findOne({price: myPrice}, function(err, pResult){
        //         if(err){
        //           console.log(err, "logging err in productPrice.findOne");
        //           res.status(500).send(err)
        //         }
        //           console.log(pResult, "result in finding prices");
        //           var pricesid = pResult.id
        //
        //
        //
        //           console.log(number1, "FIRST NUMBER");
        //           console.log(number2, "SECOND VALUE");
        //           console.log(order.id, "HERE IS ORDER.ID");
        //           // console.log(req.session.cart[i], 'req.session.cart[i]');
        //           db.orderline.insert({
        //             orderid: order.id,
        //             productid: myProductId,
        //             quantsold: myProductQ,
        //             sizeid: sizesid,
        //             priceid: pricesid
        //           }, function(err, orderline){
        //             if(err){
        //               console.log("ANOTHER ERRORRR", err);
        //               res.status(500).send(err);
        //             }
        //             console.log(orderline, "orderline");
        //           }) //end db.orderline.insert
        //
        //       }) //end db.prices.findOne
        //
        //   }) //end db.sizes.findOne
        //
        //
        //     /////////// try running two queries ////////////////////
        //
        //     //db.sizes.findOne(obj, function(err, sResult){
        //     // if(err){
        //     //   console.log(err, "here's an errror");
        //     //   res.status(500).send(err)
        //     // }
        //     // console.log(number1, "FIRST NUMBER");
        //     // console.log(number2, "SECOND VALUE");
        //     // console.log(order.id, "HERE IS ORDER.ID");
        //     //
        //     //   console.log(sResult, "result in finding sizes");
        //     //   var sizesid = sResult.id;
        //     //
        //     //   db.orderline.insert({
        //     //     orderid: order.id,
        //     //     productid: myProductId,
        //     //     quantsold: myProductQ,
        //     //     sizeid: sizesid
        //     //   }, function(err, orderline){
        //     //     if(err){
        //     //       console.log("ANOTHER ERRORRR", err);
        //     //       res.status(500).send(err);
        //     //     }
        //     //     console.log(orderline, "orderline in sizes");
        //     //   }) //end db.orderline.insert
        //     // }) //end db.sizes.findOne
        //     //
        //     //
        //     //   db.prices.findOne({price: myPrice}, function(err, pResult){
        //     //     if(err){
        //     //       console.log(err, "logging err in productPrice.findOne");
        //     //       res.status(500).send(err)
        //     //     }
        //     //       console.log(pResult, "result in finding prices");
        //     //       var pricesid = pResult.id
        //     //
        //     //
        //     //       // console.log(req.session.cart[i], 'req.session.cart[i]');
        //     //       db.orderline.update({
        //     //         orderid: order.id
        //     //       },
        //     //       {
        //     //         priceid: pricesid
        //     //       }, function(err, orderline){
        //     //         if(err){
        //     //           console.log("ANOTHER ERRORRR", err);
        //     //           res.status(500).send(err);
        //     //         }
        //     //         console.log(orderline, "orderline in prices");
        //     //       }) //end db.orderline.insert
        //     //
        //     //   }) //end db.prices.findOne
        //
        // }
        req.session.cart = [];
        // console.log(req.session.cart, "req.session.cart");
        res.status(200).send(charge);
        // console.log(charge, "charge sent");
      }
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
  },





  mail: (req, res, next) => {
    let b = req.body;
    let productTextInEmail = [];
    let orderTotal = 0;
    let shippingTotal;

    if(!b.user.address2){
      b.user.address2 = " ";
    } else {
      b.user.address2 = b.user.address2 + ", ";
    }

    //Create email HTML
    //req.user.firstname replace this with b.user.recNameLast below
    let text = "Hi " + b.user.recNameFirst + "! " + "<br> Thank you for your purchase <br> Details below: <br><br> <b>Shipping Address:</b> <br> " + b.user.recNameFirst + " " + b.user.recNameLast + "<br>" + b.user.address1 + ", " + b.user.address2 + b.user.city + ", " + b.user.state + ", " + b.user.zip

    b.product.forEach(function(item){
      // console.log(item, "item in product");
      // text2.push( "$" + item.productPrice + ", item color: " + item.productColor);
      let itemTotal = item.productQuantity * item.productPrice;
      orderTotal += itemTotal;
      productTextInEmail.push("<br><br> $" + item.productPrice + ".00 | " + item.productName + "<br> <b>color:</b> " + item.productColor + " | <b>size:</b> " + item.productSize + "<br> <b>quantity:</b> " + item.productQuantity + "<br> Item Total: $" + itemTotal + ".00")
    })

    productTextInEmail.forEach(function(item){
      text += item;
    });

    if(orderTotal < 10){
      shippingTotal = 2;
    } else {
      shippingTotal = 3;
    }

    text += "<br><hr> Order Total: $" + orderTotal + ".00 <br> Shipping Total: $" + shippingTotal + ".00 <br><br> Note from Buyer: " + b.order.note;

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
          user: config.nodemailerAuth.username, // Your email id
          pass: config.nodemailerAuth.pass // Your password
      }
    });

    db.run("SELECT * FROM orders ORDER BY id DESC LIMIT 1",[], function(err, order){
      if(err){
        console.log(err);
        res.send(err);
      }

      var mailOptions = {
        from: 'currentcutstest@gmail.com', // sender address
        to: b.email,                  // list of receivers
        bcc: 'currentcutstest@gmail.com',
        subject: 'Order Confirmation - ' + order[0].id, // Subject line
        // text: text //, // plaintext body
        html: text
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
      });
    })

    // console.log(text);

    // var mailOptions = {
    //   from: 'currentcutstest@gmail.com', // sender address
    //   to: b.email,                  // list of receivers
    //   bcc: 'currentcutstest@gmail.com',
    //   subject: 'Order Confirmation - ' + b.order.number, // Subject line
    //   // text: text //, // plaintext body
    //   html: text
    // };
    //
    // transporter.sendMail(mailOptions, function(error, info){
    //   if(error){
    //       console.log(error);
    //       res.json({yo: 'error'});
    //   }else{
    //       console.log('Message sent: ' + info.response);
    //       res.json({yo: info.response});
    //   };
    // });
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





// { "order": {
// 	"number": 5624,
// 	"note": "here is a note from the buyer"
// 	},
//
//   "email": "currentcutstest@gmail.com",
//   "user": {
//   	"recNameFirst": "Keith",
//     "recNameLast": "THEbest",
//     "address1": "123 4th st.",
//     "address2": "apt 255",
//     "city": "Seattle",
//     "state": "WA",
//     "zip": "99999"
//   },
//   "product": [
//   	{
//   	   "productSize": "3H x 3W",
//        "productColor": "Black",
//        "productQuantity": 1,
//        "productName": "Wanderlust",
//        "productPrice": 2,
//        "productImage": "https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg",
//        "productId": 2
//   	},
//     {
//        "productSize": "3H x 3W",
//        "productColor": "White",
//        "productQuantity": 1,
//        "productName": "Wanderlust",
//        "productPrice": 2,
//        "productImage": "https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg",
//        "productId": 2
//     },
//     {
//        "productSize": "3H x 3W",
//        "productColor": "Dark Gray",
//        "productQuantity": 1,
//        "productName": "Wanderlust",
//        "productPrice": 2,
//        "productImage": "https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg",
//        "productId": 2
//     }
//   ]
// }
