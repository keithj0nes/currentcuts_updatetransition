const app = require("../server.js");
// const db = app.get('db');  // Must create in each function
const nodemailer = require("nodemailer");
const config = require("../config.js");
const userCtrl = require("./usersCtrl.js")

module.exports = {

//get
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
    console.log(req.params.id, "req.params.id");

    try {
      let wholeProduct = {};

      db.get_product_by_id_details([req.params.id]).then(product => {
        console.log(product, 'getProductById2');
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
        // console.log(categoryProducts, "catprod");
        // console.log(categoryProducts.length, "length");
        if(categoryProducts.length <= 0){
          // console.log("no more results");
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
  },


  addOrder: function(req, res, charge){
    console.log('000000000000000000000000');
    console.log(charge, "CHARGE MEEEEE");
    console.log(charge.metadata.guestUser)
    console.log(charge.source.name)
    const db = app.get('db');

    // if guestUser is present, save to guest_users table
    if(charge.metadata.guestUser === 'true'){
      console.log('LOGGING METADATA.GUESTUSER');
      try {
        db.guest_users.findOne({email: charge.source.name}).then(findGuser => {
          if(findGuser){
            insertOrder(null, findGuser.id, req, res)
          } else {
            console.log('adding guessttt');
            try {
              db.guest_users.insert({email: charge.source.name}).then(guser => {
                insertOrder(null, guser.id, req, res)
              })
            }
            catch(err){
              return res.status(500).send(err);
            }
          }
        })
      }
      catch(err){
        return res.status(500).send(err);
      }

    } else {
      // else registered user is present so save to users table
      insertOrder(req.user.id, null, req, res);
    }


  },


  sendThankyou: function(req, res){
    const db = app.get('db');
    db.get_thank_you_by_id([req.params.id]).then(order => {
      // change tyexpired to true after 5 seconds,
      // so you cant see the order at a later date
      setTimeout(function(){
        db.orders.update({id: req.params.id, tyexpired: true}).then(o => {
        })
      }, 5000);
      console.log(order, "logging order in thankyou");
      res.send(order)
    })
  },





  confirmationEmail: (req, res, next) => {
    const db = app.get('db');


    console.log(req.body, "logging body");
    let b = req.body;
    let productTextInEmail = [];
    let orderTotal = 0;

    if(!b.user.address2){
      b.user.address2alt = " ";
    } else {
      b.user.address2alt = b.user.address2 + ", ";
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
    let text = "Hi " + b.user.recNameFirst + "! " + "<br> Thank you for your purchase <br> Details below: <br><br> <b>Shipping Address:</b> <br> " + b.user.recNameFirst + " " + b.user.recNameLast + "<br>" + b.user.address1 + ", " + b.user.address2alt + b.user.city + ", " + b.user.state + ", " + b.user.zip

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
    db.shipping.findOne({price: b.shipping}).then(ship => {

      //find last order inserted
      db.query("SELECT * FROM orders ORDER BY id DESC LIMIT 1",[]).then(order => {

        //
        db.order_addresses.findOne({address_one: b.user.address1, address_one: b.user.address1, city: b.user.city, state: b.user.state, zipcode: b.user.zip}).then(foundAddress => {
          if(foundAddress){
            // console.log(foundAddress, "address was found!");
            updateOrderSendConfirmationEmail(order, ship, foundAddress, b, text, transporter, req, res);
          } else {
            // console.log("address wasn't found, adding now");
            const addAddress = {
              firstname: b.user.recNameFirst,
              lastname: b.user.recNameLast,
              address_one: b.user.address1,
              address_two: b.user.address2,
              city: b.user.city,
              state: b.user.state,
              zipcode: b.user.zip
            }
            console.log(addAddress);
            db.order_addresses.insert(addAddress).then(newAddress => {
              console.log(newAddress, "newAddress added");
              updateOrderSendConfirmationEmail(order, ship, newAddress, b, text, transporter, req, res);
            })
          }
        })
      })
    })
  }, //end mail function


  sendContactEmail: function(req, res){
    console.log(req.body);
    let b = req.body;

    if(b.lname){
      b.lname = " " + b.lname;
    }

    let text = "<strong>Name:</strong> <span style='background-color:#000000, color:#ffffff;'>" + b.fname + b.lname + "</span><br> <strong>Inquiry: </strong>" + b.message;

    const db = app.get('db');
    //email styling example
    // let text = '<table align="center" border="1" cellpadding="0" cellspacing="0" width="600"><tr><td bgcolor="#70bbd9"><strong>Name:</strong> ' + b.fname + b.lname + '</td></tr><tr><td bgcolor="#ee4c50"><strong>Inquiry: </strong> '+ b.message +'</td></tr></table>';
    text += "<br> email should send to: " + b.email;


    let mailOptions = {
      from: 'currentcutstest@gmail.com',                  // sender address
      // to: b.email,                                        // list of receivers
      bcc: 'currentcutstest@gmail.com',                   // list of bcc receivers
      subject: 'INQUIRY: ' + b.subject,     // Subject line
      // text: text //,                                   // plaintext body
      html: text                                          // html body
    };

    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: true,
      auth: {
          user: config.nodemailerAuth.username, // Your email id
          pass: config.nodemailerAuth.pass // Your password
      }
    });

    //send email
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.json({yo: 'error'});
          res.send({yo: 'error'});
      }else{
          console.log('Message sent: ' + info.response);
          res.json({yo: info.response});
          res.send({yo: info.response});
      };
    });


    // res.send({success: true})
  }

} //end module exports



function insertOrder(reqUserId, guestUserResult, req, res){
  const db = app.get('db');
  const timeNow = new Date();
  let cartTotal = 0;
  req.session.cart.forEach(function(i){
    cartTotal += i.productQuantity * i.productPrice;
  })

  try {
    db.orders.insert({
      userid: reqUserId,
      datesold: timeNow,
      ordertotal: cartTotal,
      guestuserid: guestUserResult,
      completed: false
    }).then(order => {

      req.session.cart.forEach(function(product, index){
        console.log(product, "result in forEach");
        let matches = product.productSize.match(/(\d+.\d*)H[x\s]*(\d+.\d*)W/);
        let number1 = Number(matches[1]);
        let number2 = Number(matches[2]);
        let heightwidth = {
          height: number1,
          width: number2
        }
        let myPrice = product.productPrice;
        let myProductId = product.productId;
        let myProductQ = product.productQuantity;
        let myProductColor = product.productColor;

        try {
          db.sizes.findOne(heightwidth).then(sResult => {
            let sizesid = sResult.id;
            db.prices.findOne({price: myPrice}).then(pResult => {
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
              }).then(orderline => {
                console.log(orderline, "orderline");
              }) //end db.orderline.insert

            }) //end db.prices.findOne

          }) //end db.sizes.findOne
          req.session.cart = [];
          res.status(200).send((order.id).toString()) ; //res.send cannot be a number - convert to string before sending
        }
        catch(err){
          return res.status(500).send(err)
        }
      })
    })
  }


  catch(err){
    return res.status(500).send(err);
  }
} //end insertOrder function

function updateOrderSendConfirmationEmail(order, ship, address, b, text, transporter, req, res){
  console.log("updating orders table now");
  const db = app.get('db');

  db.orders.update({
    id: order[0].id,
    shippingid: ship.id,
    orderaddresses_id: address.id,
    msg_to_seller: b.order.note
  }).then(orderUpdate => {
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
} //end updateOrders function
