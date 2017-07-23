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
    console.log(req.params.id, "req.params.id");
    var wholeProduct = {};
    db.get_product_by_id_details([req.params.id], function(err, product){
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
    const newProduct = [req.body.name, req.body.description, req.body.img1, req.body.imgoutlinevector, req.body.isActive, req.body.imgoutlinevector];
    db.add_product(newProduct, function(err, product){
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      console.log(product, "adding to db");
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

    console.log(charge, "CHARGE MEEEEE");
    console.log(charge.metadata.guestUser)
    console.log(charge.source.name)

    // if guestUser is present, save to guest_users table
    if(charge.metadata.guestUser === 'true'){
      console.log('LOGGING METADATA.GUESTUSER');

      db.guest_users.findOne({email: charge.source.name}, (err, findGuser) => {
        if(err){
          console.log(err);
          res.status(500).send(err)
        }

        if(findGuser){
          insertOrder(null, findGuser.id, req, res)
        } else {
          db.guest_users.insert({email: charge.source.name}, (err, guser) => {
            if(err){
              console.log(err);
              res.status(500).send(err)
            }
            insertOrder(null, guser.id, req, res)
          })
        }
      })

    } else {
      // else registered user is present so save to users table
      insertOrder(req.user.id, null, req, res);
    }


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

    console.log(req.body, "logging body");
    let b = req.body;
    let productTextInEmail = [];
    let orderTotal = 0;

    if(!b.user.address2){
      b.user.address2 = " ";
    } else {
      b.user.address2 = b.user.address2 + ", ";
    }

    if(!b.order.note){
      b.order.note = "No note";
    }

    //USD money formatter
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    //Create email HTML
    //req.user.firstname replace this with b.user.recNameLast below
    let text = "Hi " + b.user.recNameFirst + "! " + "<br> Thank you for your purchase <br> Details below: <br><br> <b>Shipping Address:</b> <br> " + b.user.recNameFirst + " " + b.user.recNameLast + "<br>" + b.user.address1 + ", " + b.user.address2 + b.user.city + ", " + b.user.state + ", " + b.user.zip

    //loop through each product in product array and add it to the html email
    b.product.forEach(function(item){
      let itemTotal = item.productQuantity * item.productPrice;
      orderTotal += itemTotal;
      productTextInEmail.push("<br><br>" + formatter.format(item.productPrice) + " | " + item.productName + "<br> <b>color:</b> " + item.productColor + " | <b>size:</b> " + item.productSize + "<br> <b>quantity:</b> " + item.productQuantity + "<br> Item Total: $" + itemTotal + ".00")
    })

    productTextInEmail.forEach(function(item){
      text += item;
    });

    text += "<br><hr> Order Total: " + formatter.format(orderTotal) + "<br> Shipping Total: " + formatter.format(b.shipping) + "<br><br> Note from Buyer: " + b.order.note + "<br><br><br> email should be " + b.email;

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
          user: config.nodemailerAuth.username, // Your email id
          pass: config.nodemailerAuth.pass // Your password
      }
    });

    //find shipping.id based off price
    db.shipping.findOne({price: b.shipping}, function(err, ship){
      if(err){
        console.log(err);
        res.send(err);
      }

      //find last order inserted
      db.run("SELECT * FROM orders ORDER BY id DESC LIMIT 1",[], function(err, order){
        if(err){
          console.log(err);
          res.send(err);
        }

        //update shippingid in orders table
        db.orders.update({id: order[0].id, shippingid: ship.id}, function(err, orderUpdate){
          if(err){
            console.log(err);
            res.send(err)
          }
          console.log(orderUpdate);
          console.log("LOGGING ORDERUPDATE *********");
        })

        //create email
        var mailOptions = {
          from: 'currentcutstest@gmail.com',                  // sender address
          // to: b.email,                                        // list of receivers
          bcc: 'currentcutstest@gmail.com',                   // list of bcc receivers
          subject: 'Order Confirmation - ' + order[0].id,     // Subject line
          // text: text //,                                   // plaintext body
          html: text                                          // html body
        };

        //send email
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
    })
  } //end mail function

} //end module exports



function insertOrder(reqUserId, guestUserResult, req, res){

  var timeNow = new Date();
  let cartTotal = 0;
  req.session.cart.forEach(function(i){
    cartTotal += i.productQuantity * i.productPrice;
  })

  db.orders.insert({
    userid: reqUserId,
    datesold: timeNow,
    ordertotal: cartTotal,
    guestuserid: guestUserResult
  }, function(err, order){
    if(err){
      console.log(err);
      res.status(500).send(err)
    } else {
      // console.log("this should be good");
      req.session.cart.forEach(function(product, index){
        console.log(product, "result in forEach");
        // console.log(index, "index in forEach");

        ///////////////// not working because letmatches regex is only getting last number before H and first number after x
        let matches = product.productSize.match(/(\d+)H x (\d+)/);
        let number1 = Number(matches[1]);
        let number2 = Number(matches[2]);
        let obj = {
          height: number1,
          width: number2
        }

        console.log(obj, "logging object being sent to db.sizes.findOne");

        let myPrice = product.productPrice;
        let myProductId = product.productId;
        let myProductQ = product.productQuantity;
        let myProductColor = product.productColor;

        db.sizes.findOne(obj, function(err, sResult){
          if(err){
            console.log(err);
            res.status(500).send(err)
          }
            // console.log(sResult, "result in finding sizes");
            let sizesid = sResult.id;

            db.prices.findOne({price: myPrice}, function(err, pResult){
              if(err){
                console.log(err);
                res.status(500).send(err)
              }
                // console.log(pResult, "result in finding prices");
                let pricesid = pResult.id

                // console.log(number1, "FIRST NUMBER");
                // console.log(number2, "SECOND VALUE");
                // console.log(order.id, "HERE IS ORDER.ID");
                db.orderline.insert({
                  orderid: order.id,
                  productid: myProductId,
                  quantsold: myProductQ,
                  sizeid: sizesid,
                  priceid: pricesid,
                  color: myProductColor
                }, function(err, orderline){
                  if(err){
                    console.log(err);
                    res.status(500).send(err);
                  }
                  // console.log(orderline, "orderline");
                }) //end db.orderline.insert

            }) //end db.prices.findOne

        }) //end db.sizes.findOne

      }) // end forEach

      // console.log(req.session.cart, "req.session.cart");
      // console.log(charge, "LOGGING CHARGE");
      req.session.cart = [];
      res.status(200).send((order.id).toString()) ; //res.send cannot be a number - convert to string before sending
      // console.log(charge, "charge sent");
    }
  }) //end db.orders.insert
} //end insertOrder function
