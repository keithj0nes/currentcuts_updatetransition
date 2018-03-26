angular.module("ccvApp").controller("adminController", function($scope, adminService, modalService){

  //admin globals
  $scope.products = [];
  $scope.productActive = false;
  $scope.editDisable = false;
  $scope.showExtraDetails = false;
  $scope.selected = null; //highlights selected product
  $scope.readyToSendTracking = false;
  $scope.modalShown = false;
  $scope.modalShown1 = false;


//   $scope.testPDF = function(ufn, uln,useremail, guestemail, datesold, ordertotal, shipCost, subOrder, shipping, id, tracking, datecompleted, firstname, lastname, address_one, address_two, city, state, zipcode, msg_to_buyer, msg_to_seller){
//     var doc = new jsPDF({
//  orientation: 'p',
//  unit: 'mm',
//  format: 'letter',
// })
//
//     var obj = {
//       ufn, uln, useremail, guestemail, datesold, ordertotal, shipCost, subOrder, shipping, id, tracking, datecompleted, firstname, lastname, address_one, address_two, city, state, zipcode, msg_to_buyer, msg_to_seller
//     }
//
// var newarr = JSON.stringify(subOrder)
// console.log(newarr, "new are");
//     doc.text(105, 20, 'Thank you!', null, null, 'center');
//     doc.text(105, 30, 'Order Id - ' + id, null, null, 'center');
//
//
//     doc.text("Ship To", 10, 50)
//     doc.text(firstname + " " + lastname, 10, 60)
//     doc.text(address_one, 10, 70)
//     if(address_two){
//       doc.text(address_two, 10, 80)
//     }
//     doc.text(city + " " + state + " " + zipcode, 10, 90)
//
//     // doc.text(useremail, 10, 60)
//     // doc.text()
//
//     doc.text(newarr, 10, 200)
//     // doc.text(guestemail, 10, 10)
//
//     // doc.autoPrint()
//
//     doc.save('Packlist Order ID: ' + id + ".pdf")
//     console.log('firing');
//     console.log(obj);
//   }

  $scope.openModal = function(id, track, note, index){
    $scope.openOrderIndex = index;
    $scope.confirmOrder = [];
    $scope.deletingIndex = index;
    if(id === "review-tracking-modal"){
      console.log("reviewing!!!");
      if(track && note){
        let confirmOrder = {
          trackingNo: track,
          noteToBuyer: note,
          index: index
        }
        $scope.confirmOrder.push(confirmOrder)
        console.log(id, $scope.confirmOrder);
            modalService.Open(id);
      } else {
        alert("one not selected")
      }
    } else if(id === "resend-tracking-modal"){
      console.log(id, "resend-tracking-modal");
    } else if(id === "delete-product-modal"){
      console.log('opening', id);
      modalService.Open(id);
    }


  }

  $scope.closeMyModal = function(id){
    console.log("clicked button in controllers");
    modalService.Close(id);
  }

  $scope.completeOrder = function(orderid, id){
    console.log($scope.openOrderIndex, "modalIndex");
    console.log(orderid, "order id");
    adminService.adminSendConfirmation($scope.openOrderIndex,$scope.confirmOrder)
    modalService.Close(id);

    //set timeout to update db before calling getOpenOrders function
    setTimeout(function(){
        getOrderCount();
    },100)

  }

  $scope.getAllProducts = function(){
    adminService.adminGetAllProducts().then(function(response){
      // console.log(response);
      $scope.showProducts = true;
      $scope.showClosedOrders = false;
      $scope.showOpenOrders = false;

      $scope.products = response;

      console.log("getting all products");
    })
  }

  // getAllProducts();


  var getProductDetails = function(prodId){
    adminService.adminEditProducts(prodId).then((res) => {
      $scope.defaultSelected = [];
      $scope.showExtraDetails = true;
      $scope.productDetails = res;
      $scope.productId = prodId;
      $scope.allCategories = res.allCategories;

      if(res.selectedCategories){
        for(var j = 0; j < res.allCategories.length; j++){
          let selectedCat = res.allCategories[j];
          for(var i = 0; i < res.selectedCategories.length; i++){
            let allCat = res.selectedCategories[i]
            if(selectedCat.name ===  allCat.name){
              // console.log("we have a match!");
              $scope.defaultSelected.push(selectedCat)
              // console.log($scope.defaultSelected, "loggin");
            }
          }
        }
      }
    })
  }



//editProducts function displays information about specific product when called with the Edit Button
  $scope.editProducts = function(product, index){
    console.log(index, 'index');
    $scope.selected = index;
    $scope.productId = product.id;
    $scope.productName = product.name;
    $scope.productDescription = product.description;
    $scope.productPrice = product.price;
    $scope.productImgOne = product.img1;
    $scope.productImgTwo = product.imgmainvector;
    $scope.productImgThree = product.imgoutlinevector;
    $scope.productActive = product.active;
    getProductDetails($scope.productId);
  }

  $scope.saveCategory = function(index,updateCat){

    if(updateCat){
      if(updateCat.name){
        updateCat.index = index;
        adminService.adminSaveCategory(updateCat, $scope.productId).then((res)=>{
          $scope.allCategories = res.allCategories;
          if(res.selectedCategories){
            $scope.defaultSelected = [];
            for(var j = 0; j < res.allCategories.length; j++){
              let selectedCat = res.allCategories[j];
              for(var i = 0; i < res.selectedCategories.length; i++){
                let allCat = res.selectedCategories[i]
                if(selectedCat.name ===  allCat.name){
                  $scope.defaultSelected.push(selectedCat)
                }
              }
            }
          }
        })
      } else {
        swal("Please select a category");
      }
    } else {
      swal("Please select a category");
    }
  }

  $scope.deleteCategory = function(index, category){
    console.log(index, category);

    category.index = index;

    adminService.adminDeleteCategory(category, $scope.productId);

    for(var i = $scope.defaultSelected.length-1; i >= 0; i--){
      console.log($scope.defaultSelected[i], index);
      if(index === i){
        console.log("UPPPPSSS");
        $scope.defaultSelected.splice(i, 1);
      }
    }
  }

  $scope.addNewCategory = function(){
    console.log($scope.allCategories, "clicked");
    $scope.defaultSelected.push({"name": $scope.catName});
    console.log($scope.defaultSelected, "after clicked");

  }

  $scope.addNewRow = function(){
    console.log($scope.productDetails.product, "running");
    $scope.productDetails.product.push({"height": $scope.height,
                                "width": $scope.width,
                                "price": $scope.price})
                                console.log($scope.productDetails, "hahah lol momg");
    // $scope.editing = true;
    // console.log($scope.productDetails.product);
  }

  $scope.clearForm = function(){
    $scope.productId = "";
    $scope.productName = "";
    $scope.productDescription = "";
    $scope.productPrice = "";
    $scope.productImgOne = "";
    $scope.productImgTwo = "";
    $scope.productImgThree = "";
    $scope.productDetails = "";
    $scope.productActive = false;
    $scope.showExtraDetails = false;
    $scope.selected = null;
  }

  $scope.editDisableBtn = function(index){
    console.log(index, "logging index");
    $scope.editDisable = true;
  }

  $scope.clearDisabled = function(){
    $scope.editDisable = false;
  }


  $scope.add = function(name, description, img1, imgmainvector, imgoutlinevector){

    if(name == null || description == null || img1 == null || imgmainvector == null || name == "" || description == "" || img1 == "" || imgmainvector == ""){
      console.log("it's null");
    } else {

      const productAdd = {
        name: name,
        description: description,
        img1: img1,
        imgmainvector: imgmainvector,
        isActive: true,
        imgoutlinevector: imgoutlinevector
      }

      console.log(productAdd);
      console.log(productAdd.name);

      console.log("GOT HERE");
      adminService.adminAddProduct(productAdd).then((res) => {
        console.log(res, "logging response in admin apge");
        if(res.productExists === true){
          swal("this product is already in the database")
        } else {
          setTimeout(function () {
            $scope.getAllProducts();
            console.log(res.id, "calling for details");
            getProductDetails(res.id)
          }, 100);
        }
      });
      $scope.addNew = true;
      // ///////?////////////
      // need to send adminEditProducts function in order for scopeaddnew to work

    }
  }

  $scope.updateDetails = function(index, productDetails, psheight, pswidth, psprice){
    console.log($scope.productId, "productId from the original requests");
    console.log(psheight, "psheight");
    console.log(pswidth, "pswidth");
    console.log(psprice, "psprice");
    console.log(index, "index");

    // send index to backend if index has value in pps then change it else add new


    if(psheight && pswidth && psprice){
      console.log("all defined!");
      let sizePriceDetails = {
        index: index,
        height: psheight,
        width: pswidth,
        price: psprice
      }
      $scope.editDisable = false;


      adminService.adminUpdateProductSizePrice($scope.productId, sizePriceDetails)

      setTimeout(function(){
        getProductDetails($scope.productId);
      }, 100)

    } else {
      alert("you must fill in everything")
    }
    console.log($scope.productDetails, "SCOPEDOTPRODUCTDETAILS");
    console.log($scope.productDetails[index], "SCOPEDOTPRODUCTDETAILSINDEX");

  }





  $scope.deleteDetails = function(index, productDetails){
    productDetails.index = index;
    for (var i = $scope.productDetails.product.length-1; i >= 0; i--) {
      if(i === index){
        $scope.productDetails.product.splice(i, 1);
      }
    }

    adminService.adminDeleteDetails($scope.productId, productDetails);
  }

  $scope.update = function(id, name, description, img1, imgmainvector, imgoutlinevector, active){
    const productUpdate = {
      name: name,
      description: description,
      img1: img1,
      imgmainvector: imgmainvector,
      imgoutlinevector: imgoutlinevector,
      active: active
    }

    console.log($scope.productActive, name);
    //
    adminService.adminUpdateProduct(id, productUpdate);
    setTimeout(function () {
      $scope.getAllProducts();
    }, 100);

  }

  $scope.delete = function(productId, modalId){
    // console.log(productId);
    // console.log('deteling!');
      // console.log($scope.products, "logging products");
        for (var i = $scope.products.length-1; i >= 0; i--) {
          // console.log(productId, $scope.products[i].id);
          if($scope.products[i].id === productId){
            // console.log('splicing ', i);
            $scope.products.splice(i, 1);
          }
        }
      adminService.adminDeleteProduct(productId);
      $scope.clearForm();
      $scope.closeMyModal(modalId)
  }

  // var getUsername = function() {
  //   adminService.getUsername().then(function(response){
  //     $scope.username = response;
  //   })
  // }
  //
  // getUsername();







  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
                         // ORDERS SECTION //
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  let getOrderCount = function(){
    adminService.adminGetOrderCount().then((res) => {
      console.log(res, "logging res in controller haha");
      $scope.openCount = res[0].opencount;
      $scope.closedCount = res[0].closedcount;

      if($scope.openCount === "0"){
        console.log("setting to closed orders");
        $scope.getClosedOrders();
      } else {
        console.log("open orders!");
        $scope.getOpenOrders();
      }
    })
  }

  $scope.getOpenOrders = function(){
    adminService.adminGetOpenOrders().then((res) => {
      $scope.showOpenOrders = true;
      $scope.showProducts = false;
      $scope.showClosedOrders = false;
      $scope.tabopen = true;
      $scope.tabclosed = false;

      console.log(res, "logging res");

      if(res.mainOrder.length <= 0){
        $scope.openOrdersEmpty = true;
        $scope.openOrders = res.mainOrder;
        console.log($scope.openOrders, "logging with KEITH");
        // $scope.openCount--;
        // $scope.closedCount++;


      } else {
        $scope.openOrders = res.mainOrder;
        $scope.openOrdersDetails = res.mainOrder.subOrder;
        console.log($scope.openOrders, "logging with sam");
      }

    })
  }

  $scope.getClosedOrders = function(){
    adminService.adminGetClosedOrders().then((res) => {
      $scope.showClosedOrders = true;
      $scope.showProducts = false;
      $scope.showOpenOrders = false;
      $scope.tabopen = false;
      $scope.tabclosed = true;


      if(res.mainOrder.length <= 0){
        console.log("no length");
        $scope.closedOrdersEmpty = true;
      }
      console.log(res, "res in adminGetClosedOrders");
      $scope.closedOrders = res.mainOrder;
      $scope.closedOrdersDetails = res.mainOrder.subOrder;
    })
  }

  getOrderCount();

})
