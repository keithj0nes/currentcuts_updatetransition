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

  // $scope.confirmOrder = {};

  var hello = function(){
    console.log("saying hello");
  }

  $scope.openModal =function(id, track, note, index){
    $scope.confirmOrder = [];
    console.log(index);
    if(track && note){
      let confirmOrder = {
        trackingNo: track,
        noteToBuyer: note
      }
      $scope.confirmOrder.push(confirmOrder)
      console.log(id, $scope.confirmOrder);
          modalService.Open(id);
    } else {
      alert("one not selected")
    }

  }

  $scope.closeMyModal = function(id){
    console.log("clicked button in controllers");
    modalService.Close(id);
  }

  $scope.completeOrder = function(id){
    console.log($scope.confirmOrder, "confirming orderrrrrr");
    modalService.Close(id);
    $scope.getOpenOrders()
  }

  var getAllProducts = function(){
    adminService.adminGetAllProducts().then(function(response){
      // console.log(response);
      $scope.products = response;
    })
  }

  getAllProducts();


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
            getAllProducts();
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

    // console.log(productDetails);
    productDetails.index = index;
    // console.log(productDetails);
    for (var i = $scope.productDetails.length-1; i >= 0; i--) {

      if( i === index){
        console.log("these values are equal")
        $scope.productDetails.splice(i, 1);
      }
    }

    adminService.adminDeleteDetails($scope.productId, productDetails)//.then((res) => {

    // })
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
      getAllProducts();
    }, 100);

  }

  $scope.delete = function(productId){
    console.log(productId);
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function () {
      console.log($scope.products, "logging products");
        for (var i = $scope.products.length-1; i >= 0; i--) {
          if($scope.products[i].id === productId){
            $scope.products.splice(i, 1);
          }
        }
      adminService.adminDeleteProduct(productId);
      $scope.clearForm();
    })
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
                      // OPEN ORDERS SECTION //
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  $scope.getOpenOrders = function(){
    adminService.adminGetOpenOrders().then((res)=>{
      console.log(res, "res in adminGetOpenOrders");
      $scope.openOrders = res.mainOrder;
      console.log($scope.openOrders, "loo[penorders]");
      $scope.openOrdersDetails = res.mainOrder.subOrder;

    })
  }


})
