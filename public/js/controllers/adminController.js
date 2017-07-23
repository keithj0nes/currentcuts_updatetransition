angular.module("ccvApp").controller("adminController", function($scope, mainService){

  $scope.priceSize = false;
  $scope.addNew = false;
  $scope.products = [];
  $scope.selectedProductToEdit;
  var getAllProducts = function(){
    mainService.adminGetAllProducts().then(function(response){
      // console.log(response, "response in adminController");
      $scope.products = response;
    })
  }

  var getProductDetails = function(prodId){
    mainService.adminEditProducts(prodId).then((res) => {
      $scope.priceSize = true;
      $scope.addNew = true;
      console.log(res);
      $scope.productDetails = res.product;
      // console.log($scope.productDetails);
      // console.log(res, "editProducts res");
    })
  }

  getAllProducts();



  $scope.decalType = [
      {category:'Adventure'},
      {category:'Sports'},
      {category:'Schools'},
      {category:'Games'},
      {category:'Characters'},
      {category:'Animals'},
    ];





//editProducts function displays information about specific product when called with the Edit Button
  $scope.editProducts = function(product){
    $scope.productId = product.id;
    $scope.productName = product.name;
    $scope.productDescription = product.description;
    $scope.productPrice = product.price;
    $scope.productImgOne = product.img1;
    $scope.productImgTwo = product.imgmainvector;
    $scope.productImgThree = product.imgoutlinevector;
    // console.log(product, "editProducts");

    getProductDetails($scope.productId);
    // mainService.adminEditProducts(product.id).then((res) => {
    //   $scope.priceSize = true;
    //   $scope.addNew = true;
    //   console.log(res);
    //
    //
    //           //try to figure out 'res.product should be a number'
    //                   // var arr = [];
    //                   // for(var key in res.product){
    //                   //   console.log(key, "logging key");
    //                   //   console.log(res.product.hasOwnProperty(key));
    //                   //   console.log(res.product[key]);
    //                   //   if (res.product.hasOwnProperty(key)){
    //                   //     // console.log(res.product[+key], "yep");
    //                   //     // console.log(res.product[key], "again");
    //                   //     var obj = res.product[key];
    //                   //     for (var prop in obj) {
    //                   //       if (obj.hasOwnProperty(prop)) {
    //                   //         console.log(prop + " = " + obj[prop]);
    //                   //       }
    //                   //     }
    //                   //
    //                   //     arr.push(res.product[+key]);
    //                   //   }
    //                   // }
    //                   //
    //                   // console.log(arr, "logging arr");
    //
    //
    //
    //   $scope.productDetails = res.product;
    //   // console.log($scope.productDetails);
    //   // console.log(res, "editProducts res");
    //
    //
    // })
  }

  $scope.addNewRow = function(){
    console.log("running");
    $scope.productDetails.push({"height": $scope.height,
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
    $scope.addNew = false;
  }

  $scope.clickme = function(index){
    console.log(index, "logging index");
  }


  $scope.add = function(name, description, img1, imgmainvector, imgoutlinevector){

    if(name == null || description == null || img1 == null || imgmainvector == null){
      console.log("it's null");
    } else {

      const productObj = {
        name: name,
        description: description,
        img1: img1,
        imgmainvector: imgmainvector,
        isActive: true,
        imgoutlinevector: imgoutlinevector
      }
      mainService.addProduct(productObj);
      // $scope.addNew = true;
      // ///////?////////////
      // need to send adminEditProducts function in order for scopeaddnew to work

    }

    // mainService.addProduct(productObj);
    // $scope.productId = "";
    // $scope.productName = "";
    // $scope.productDescription = "";
    // $scope.productPrice = "";
    // $scope.productImgOne = "";
    // $scope.productImgTwo = "";
    setTimeout(function () {
      getAllProducts();
    }, 100);

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

      mainService.adminUpdateProductSizePrice($scope.productId, sizePriceDetails)

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

    console.log(productDetails);
    for (var i = $scope.productDetails.length-1; i >= 0; i--) {

      if( i === index){
        console.log("these values are equal")
        $scope.productDetails.splice(i, 1);
      }
    }

    // mainService.adminDeleteDetails()//.then((res) => {

    // })
  }

  $scope.update = function(id, name, description, price, img1, img2){
    mainService.updateProduct(id, name, description, price, img1, img2);
    setTimeout(function () {
      getAllProducts();
    }, 100);

  }

  $scope.delete = function(product){
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(function () {
        for (var i = $scope.products.length-1; i >= 0; i--) {
          if($scope.products[i].id === product.id){
            $scope.products.splice(i, 1);
          }
        }
      mainService.deleteProduct(product);
      $scope.clearForm();
    })
  }

  // var getUsername = function() {
  //   mainService.getUsername().then(function(response){
  //     $scope.username = response;
  //   })
  // }
  //
  // getUsername();

})
