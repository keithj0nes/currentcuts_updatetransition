const app = require("../server.js");
const db = app.get('db');
const nodemailer = require("nodemailer");
const config = require("../config.js");

module.exports = {


  getAllAdminProducts: function(req, res){
    const db = app.get('db');
    db.admin_get_all_products([]).then(products => {
      //console.log("admin products shown");
      return res.send(products)
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getProductDetails: function(req, res){
    const db = app.get('db');
    let wholeProduct = {};
  // db.run("select id, name from categories where parent_id is null", [], function(err, topLevelCategories){
    db.query("select * from categories order by id", []).then(allCategories => {
    // db.run("select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id order by product_category.id", [], function(err, allCategories){
      // //console.log(allCategories, "top level cats");
      wholeProduct.allCategories = allCategories
      db.query("with recursive cte as (select p.id as product_id, c.name, c.parent_id from products p join product_category pc on p.id = pc.product_id join categories c on c.id = pc.category_id union all select p.id, c.name, c.parent_id from cte r join products p on p.id = r.product_id join categories c on c.id = r.parent_id) select * from cte where product_id=$1", [req.params.id]).then(cats => {
      // db.run(" select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id where product_category.product_id = $1 order by product_category.id ", [req.params.id], function(err, cats){
        // //console.log(cats, "categories in .get");
        if(cats.length >= 1){
          wholeProduct.selectedCategories = cats;
        }
      })
    })

    db.query("SELECT prices.price, sizes.height, sizes.width FROM products INNER JOIN product_price_size ON products.id = product_price_size.productId INNER JOIN prices ON prices.id = product_price_size.priceId INNER JOIN sizes ON sizes.id = product_price_size.sizeId WHERE products.id = $1 order by product_price_size.id", [req.params.id]).then(product => {
      //console.log("getProductById2");
      wholeProduct.product = product;

      db.query("SELECT count(*) FROM favorites WHERE product_id = $1", [req.params.id]).then(totalFavs => {

        wholeProduct.totalFavs = totalFavs;

        if(req.user){
          db.favorites.findOne({user_id: req.user.id, product_id: req.params.id}).then(found => {
            if(found){
              wholeProduct.favFound = true;
              // //console.log(wholeProduct, "holdprodcut");
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //post
  addProductToDB: function(req, res, next){
    const db = app.get('db');

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      img1: req.body.img1,
      imgmainvector: req.body.imgmainvector,
      imgoutlinevector: req.body.imgoutlinevector,
      active: req.body.active
    }

    db.products.findOne({name: req.body.name, or: [{"archived =": false}, {"archived =": null}]}).then(result => {
      if(result){
        //console.log(result, "found oneeeeeee that's active!!");
        res.send({productExists: true})
      } else {
        //console.log(result, "couldnt find one active");
        db.products.insert(newProduct).then(addedProduct => {
          res.send(addedProduct)
        })
      }
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateProductById: function(req, res, next){
    const db = app.get('db');
    const updateProduct = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      img1: req.body.img1,
      imgmainvector: req.body.imgmainvector,
      imgoutlinevector: req.body.imgoutlinevector,
      active: req.body.active,
      tags: req.body.tags
    }

    db.products.update(updateProduct).then(updatedProduct => {
      return res.send(updatedProduct)
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  deleteProductById: function(req, res, next){
    const db = app.get('db');
    //console.log("deleted function fired");
    db.products.update({id: req.params.id, archived: true}).then(archivedProduct => {
      return res.status(200).send(archivedProduct)
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  addSizePrice: function(req, res){
    const db = app.get('db');

    //console.log("************************************************************");
    //console.log(req.params.id, "req.params.id haha");
    //console.log(req.body, "req.body");
    let index = req.body.index;
    let height = req.body.height;
    let width = req.body.width;
    let price = req.body.price;
    let loopCount = 0;

    // NEED TO FIND OBJ ID TO UPDATE SPECIFIC ITEM IN OBJ

    // FIND SIZE - HEIGHT AND WIDTH
    db.sizes.findOne({height: height, width: width}).then(foundSize => {
      if(foundSize){
        //console.log("the same size was found");
        // IF SIZE FOUND, FIND PRICE
        db.prices.findOne({price: price}).then(foundPrice => {
          if(foundPrice){
            //console.log("the same price was found");
            //trying to find out how to get correct index in product_price_size table from frontend - problem: it's sorted by price in front end
            db.query("SELECT * FROM product_price_size WHERE productid = $1 order by id", [req.params.id]).then(product => {
              //console.log(product, "logging product 244");
              product.forEach(function(r, i){
                if(index === i){
                  //console.log(r, "found the correct index");
                  loopCount++

                  db.product_price_size.save({id: r.id, priceid: foundPrice.id, sizeid: foundSize.id }).then(updatedPrice => {

                    //console.log(updatedPrice, "updated price after .save(), 178");

                    db.query("select * from product_price_size where productid = $1 order by id", [req.params.id]).then(prod => {
                      //console.log(prod, "logging prod after updatedPrice 305");
                      res.send(updatedPrice);
                    })
                  })

                }
              })

              //console.log(loopCount);

              if(!loopCount){
                //console.log("running this part because loopCount = " + loopCount + ", aka new line added");
                db.product_price_size.insert({productid: req.params.id, priceid: foundPrice.id, sizeid: foundSize.id}).then(addedPps => {
                  //console.log(addedPps, "THESE CONNECT NEW ROW YAYYY");
                  res.send(addedPps)
                })
              }
            })
          // IF PRICE NOT FOUND - ADD IT
          } else {
            //console.log("price not in db");
            db.prices.insert({price: price}).then(addedPrice => {
              if(addedPrice){
                //console.log("new price added");

                db.query("SELECT * FROM product_price_size WHERE productid = $1", [req.params.id]).then(product => {
                  //console.log(product, "logging product 240");
                  product.forEach(function(r, i){
                    if(index === i){
                      //console.log(r, "he be de correct index");
                      loopCount++

                      db.product_price_size.save({id: r.id, priceid: addedPrice.id, sizeid: foundSize.id }).then(updatedPrice => {

                        //console.log(updatedPrice, "UPDATED PRICE AFTER SAVE()");
                        res.send(updatedPrice)
                      })

                    }
                  })

                  //console.log(loopCount);

                  if(!loopCount){
                    //console.log("running this part because loopCount = " + loopCount);
                    db.product_price_size.insert({productid: req.params.id, priceid: addedPrice.id, sizeid: foundSize.id}).then(addedPps => {
                      //console.log(addedPps, "added a new price then connected them!");
                      res.send(addedPps)
                    })
                  }
                })
              }
            })
          }
        })

      // IF SIZE ISNT FOUND - ADD IT
      } else {
        //console.log("sizes werent found");
        db.sizes.insert({height: height, width: width}).then(addedSize => {
          //console.log(addedSize, "new size added");
          if(addedSize){
            //console.log("new size added = true");
            // ONCE SIZE IS ADDED - FIND PRICE
            db.prices.findOne({price: price}).then(foundPrice => {
              if(foundPrice){
                //console.log(foundPrice, "foundPrice in new size added");
                db.query("SELECT * FROM product_price_size WHERE productid = $1 order by id", [req.params.id]).then(product => {

                  //console.log(product, "logging product 403");
                  product.forEach(function(r, i){
                    if(index === i){
                      //console.log(r, "found the correct index in new size added");
                      loopCount++

                      db.product_price_size.save({id: r.id, priceid: foundPrice.id, sizeid: addedSize.id }).then(updatedPrice => {

                        //console.log(updatedPrice, "updated price after .save()");
                        res.send(updatedPrice)
                      })

                    }
                  })

                  //console.log(loopCount);

                  if(!loopCount){
                    //console.log("running because loopCount = " + loopCount + ", adddedd a new line 436");
                    db.product_price_size.insert({productid: req.params.id, priceid: foundPrice.id, sizeid: addedSize.id}).then(addedPps => {

                      //console.log(addedPps, "THESE CONNECT NEW ROW YAYYY");
                      res.send(addedPps)
                    })

                  }

                })
                // IF PRICE NOT FOUND - ADD IT
              } else {
                //console.log("no price found in new size added");
                db.prices.insert({price: price}).then(addedPrice => {
                  if(addedPrice){
                    //console.log("new price added in new size added");

                    db.query("SELECT * FROM product_price_size WHERE productid = $1 order by id", [req.params.id]).then(product => {
                      //console.log(product, "logging product 454");
                      product.forEach(function(r, i){
                        if(index === i){
                          //console.log(r, "index in addedPrice in addedSize");
                          loopCount++

                          db.product_price_size.save({id: r.id, priceid: addedPrice.id, sizeid: addedSize.id }).then(updatedPrice => {
                            //console.log(updatedPrice, "UPDATED PRICE AFTER SAVING EDITED LINE");
                            res.send(updatedPrice)
                          })

                        }
                      })

                      //console.log(loopCount);

                      if(!loopCount){
                        //console.log("running this part because loopCount = " + loopCount + " IN ADDEDPRICE slash ADDEDSIZE");
                        db.product_price_size.insert({productid: req.params.id, priceid: addedPrice.id, sizeid: addedSize.id}).then(addedPps => {
                          //console.log(addedPps, "added a new price then connected them!");
                          res.send(addedPps)
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    }) //end db.sizes.findOne
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  deleteSizePrice: function(req, res){
    const db = app.get('db');

    //console.log("delete triggered");
    //console.log(req.params.id);
    //console.log(req.body);
    let index = req.body.index
    db.query("SELECT * FROM product_price_size WHERE productid = $1 order by id", [req.params.id]).then(result => {
      //console.log(result, "loggig result");
      result.forEach(function(r, i){
        if(index === i){
          //console.log(r.id, "r.id");
          //console.log(r, "index === i in forEach loop");
          db.product_price_size.destroy({id: r.id}).then(destroyedPps => {
            //console.log(destroyedPps, "destroyedPps data");
            res.send(destroyedPps)
          })
        }
      })
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  updateCategories: function(req, res){
    const db = app.get('db');

    let index = req.body.index;
    let cat_id = req.body.id
    let catMatch = 0;
    let updatedCategory = {};

    db.query("select * from product_category where product_id = $1 order by category_id, id", [req.params.id]).then(product => {
      product.forEach((prod, i) => {
        if(index === i){
          catMatch++
          //console.log("found a match at index: ", index, prod);
          db.product_category.save({id: prod.id, product_id: req.params.id, category_id: cat_id}, function(err, updatedCat){
            // //console.log(updatedCat, "this has been updated");

            db.query("select * from categories order by id", []).then(allCategories => {

            // db.run("select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id order by product_category.id", [], function(err, allCategories){


              // //console.log(allCategories, "top level cats");
              updatedCategory.allCategories = allCategories

              db.query("with recursive cte as (select p.id as product_id, c.name, c.parent_id from products p join product_category pc on p.id = pc.product_id join categories c on c.id = pc.category_id union all select p.id, c.name, c.parent_id from cte r join products p on p.id = r.product_id join categories c on c.id = r.parent_id) select * from cte where product_id=$1", [req.params.id]).then(cats => {
              // db.run(" select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id where product_category.product_id = $1 order by product_category.id ", [req.params.id], function(err, cats){

                // //console.log(cats, "categories in .get");
                if(cats.length >= 1){
                  updatedCategory.selectedCategories = cats;
                  // //console.log(updatedCategory, "updated category in line 272");
                  res.send(updatedCategory)
                }
              })

            })
            // res.send(updatedCat)
          })
        } else {
          //console.log("no match");
        }
      })

      if(!catMatch){
        //console.log("new Line added!!");
        db.product_category.insert({product_id: req.params.id, category_id: cat_id}).then(insertedCat => {
          //console.log(insertedCat, "inserted category");

          db.query("select * from categories order by id", []).then(allCategories => {

          // db.run("select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id order by product_category.id", [], function(err, allCategories){


            // //console.log(allCategories, "top level cats");
            updatedCategory.allCategories = allCategories

            db.query("with recursive cte as (select p.id as product_id, c.name, c.parent_id from products p join product_category pc on p.id = pc.product_id join categories c on c.id = pc.category_id union all select p.id, c.name, c.parent_id from cte r join products p on p.id = r.product_id join categories c on c.id = r.parent_id) select * from cte where product_id=$1", [req.params.id]).then(cats => {
            // db.run(" select categories.name, categories.id, product_category.id from product_category inner join categories on categories.id = category_id where product_category.product_id = $1 order by product_category.id ", [req.params.id], function(err, cats){

              // //console.log(cats, "categories in .get");
              if(cats.length >= 1){
                updatedCategory.selectedCategories = cats;
                // //console.log(updatedCategory, "updated category in line 272");
                res.send(updatedCategory)
              }
            })
          })
          // res.send(insertedCat)
        })
      }
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  deleteCategories: function(req, res){
    const db = app.get('db');

    db.query("select * from product_category where product_id = $1 order by category_id, id", [req.params.id]).then(product => {
      product.forEach(function(item, i){
        if(req.body.index === i){
          db.product_category.destroy({id: item.id}).then(deletedCat => {
            res.send(deletedCat);
          })
        }
      })
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getOpenOrders: function(req, res){
    const db = app.get('db');
    let openOrders = {};

    db.query("select orders.id, orders.userid, orders.datesold, orders.ordertotal, orders.msg_to_seller, shipping.price AS shipping, users.firstName AS ufn, users.lastName AS uln, users.email as useremail, guest_users.email as guestemail, order_addresses.firstname, order_addresses.lastname, order_addresses.address_one, order_addresses.address_two, order_addresses.city, order_addresses.state, order_addresses.zipcode from orders left join users on users.id = orders.userid left join guest_users on guest_users.id = orders.guestuserid left join order_addresses on orders.orderaddressesid = order_addresses.id join shipping on orders.shippingid = shipping.id where orders.completed = false order by datesold;", []).then(mainOrders => {
      openOrders.mainOrder = mainOrders;
      mainOrders.forEach((main, index) => {
        db.query("select products.name, products.img1, sizes.height, sizes.width, prices.price, orderline.quantsold, orderline.color from orderline join orders on orderline.orderid = orders.id left join users on users.id = orders.userid left join guest_users on guest_users.id = orders.guestuserid join products on orderline.productid = products.id join sizes on orderline.sizeid = sizes.id join prices on orderline.priceid = prices.id join shipping on orders.shippingid = shipping.id where orders.id = $1",[main.id]).then(subOrder => {
          openOrders.mainOrder[index].subOrder = subOrder;
        })
      })
      //res.send sends before db.query is completed - must use setTimeout to allow db.run data to be stored
      setTimeout(()=>{
        res.send(openOrders)
      }, 100);
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getClosedOrders: function(req, res){
    const db = app.get('db');

    let closedOrders = {};

    db.query("select orders.id, orders.userid, orders.tracking, orders.datecompleted, orders.msg_to_buyer, orders.datesold, orders.ordertotal, orders.msg_to_seller, shipping.price AS shipping, users.firstName AS ufn, users.lastName AS uln, users.email as useremail, guest_users.email as guestemail, order_addresses.firstname, order_addresses.lastname, order_addresses.address_one, order_addresses.address_two, order_addresses.city, order_addresses.state, order_addresses.zipcode from orders left join users on users.id = orders.userid left join guest_users on guest_users.id = orders.guestuserid left join order_addresses on orders.orderaddressesid = order_addresses.id join shipping on orders.shippingid = shipping.id where orders.completed = true order by datecompleted desc;", []).then(mainOrders => {
      closedOrders.mainOrder = mainOrders;
      mainOrders.forEach((main, index) => {
        db.query("select products.name, products.img1, sizes.height, sizes.width, prices.price, orderline.quantsold, orderline.color from orderline join orders on orderline.orderid = orders.id left join users on users.id = orders.userid left join guest_users on guest_users.id = orders.guestuserid join products on orderline.productid = products.id join sizes on orderline.sizeid = sizes.id join prices on orderline.priceid = prices.id join shipping on orders.shippingid = shipping.id where orders.id = $1",[main.id]).then(subOrder => {
          closedOrders.mainOrder[index].subOrder = subOrder;
        })
      })
      setTimeout(()=>{
        res.send(closedOrders)
      }, 100);
    })
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  completeOrder: function(req, res){
    const db = app.get('db');

    //console.log(req.params.index, "logging req.pareams.didd");
    //console.log(req.body[0], "logging boddddyyyy");

    let b = req.body[0]
    let timeNow = new Date();


    db.query("select * from orders where completed = false order by datesold", []).then(openOrders => {
      if(openOrders){
        openOrders.forEach((item, idx) => {
          // //console.log(idx, req.params.index);
          if(b.index === idx){
            //console.log(item, "MATCH");
            db.orders.update({id: item.id, datecompleted: timeNow, msg_to_buyer: b.noteToBuyer || "No note", tracking: b.trackingNo, completed: true}).then(updatedOrder => {
              //console.log(updatedOrder, "result");
              db.order_addresses.findOne({id: updatedOrder.orderaddressesid}).then(foundAddress => {
                //console.log( foundAddress, "found address");
                if(updatedOrder.userid){
                  // //console.log("signed in user");
                  db.users.findOne({id: updatedOrder.userid}).then(foundUser => {
                    sendTrackingEmail(b, foundAddress, updatedOrder, foundUser, nodemailer, config, req, res);
                  })
                } else if(updatedOrder.guestuserid){
                  // //console.log("guest user");
                  db.guest_users.findOne({id: updatedOrder.guestuserid}).then(foundGuestUser => {
                    // //console.log(foundGuestUser.email);
                    sendTrackingEmail(b, foundAddress, updatedOrder, foundGuestUser, nodemailer, config, req, res);
                  })
                }
              })
            })
          } // end if b.index === idx
        }) //end forEach
      } else {
        //console.log(openOrders, openOrders.length, "openOrders length");
      }//end else openOrders
    })
    res.send({orderCompleted: true})
  },

  getOrderCount: function(req, res){
    const db = app.get('db');
    db.query("select (select COUNT(*) from orders where completed = false) AS opencount, (select COUNT(*) from orders where completed = true) AS closedcount").then(orderCount => {
      res.send(orderCount)
    })
  }


} //end module.exports

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// NOT EXPORTED FUNCTIONS ///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendTrackingEmail(b, foundAddress, updatedOrder, foundUser, nodemailer, config, req, res){
  //console.log(foundAddress, 'FOUND ADDRESS');
  //console.log(b, 'logging b in sendTrackingEmail');
  if(!foundAddress.address_two){
    foundAddress.address_two_alt = "<br>";
  } else {
    foundAddress.address_two_alt = foundAddress.address_two + " <br>";
  }
  //console.log('getting here');
  let text = "Your order has been shipped! <br><br> USPS Tracking # " + b.trackingNo + "<br> <br> Ship To: <br>" + foundAddress.firstname + " " + foundAddress.lastname + "<br>" + foundAddress.address_one + " " + foundAddress.address_two_alt + foundAddress.city + ", " + foundAddress.state + ", " + foundAddress.zipcode + "<br><br> Your Note: '" + updatedOrder.msg_to_seller + "' <br> Our Note: '" + updatedOrder.msg_to_buyer + "' <br><br> Thanks! ";


  text += "<br><br><br>mail should be: " + foundUser.email;

  //create email
  var mailOptions = {
    from: config.nodemailer.auth.user,                  // sender address
    // to: foundUser.email,                                        // list of receivers
    bcc: 'currentcutstest@gmail.com',                   // list of bcc receivers
    subject: 'Your Order is on its way! USPS Tacking - ' + b.trackingNo,     // Subject line
    html: text                                          // html body
  };

  //send email
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        //console.log(error);
        res.json({yo: 'error'});
    }else{
        //console.log('Message sent: ' + info.response);
        res.json({yo: info.response});
    };
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const transporter = nodemailer.createTransport(config.nodemailer);
