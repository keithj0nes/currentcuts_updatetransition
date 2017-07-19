angular.module("ccvApp").controller("adminController", function($scope, mainService){

  $scope.priceSize = false;
  $scope.addNew = false;
  $scope.products = [];
  $scope.selectedProductToEdit;
  var getAllProducts = function(){
    mainService.adminGetAllProducts().then(function(response){
      console.log(response, "response in adminController");
      $scope.products = response;
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
    mainService.adminEditProducts(product.id).then((res) => {
      $scope.priceSize = true;
      $scope.addNew = true;
      $scope.productDetails = res.product;
      // console.log(res, "editProducts res");


    })
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

    }
    // if(name === null){
    //   console.log("it's null ===");
    // }
    // if(name == undefined){
    //   console.log("it's undefined");
    // }
    // if(name === undefined){
    //   console.log("it's undefined ===");
    // }

    // const productObj = {
    //   name: name,
    //   description: description,
    //   img1: img1,
    //   imgmainvector: imgmainvector,
    //   isActive: true,
    //   imgoutlinevector: imgoutlinevector
    // }

    // Object.keys(productObj).some((k) => {
    //   if(productObj[k] == undefined || productObj[k] === " "){
    //     console.log("there is no value here");
    //   } else {
    //     console.log("adding product");
    //     mainService.addProduct(productObj);
    //   }
    // })

    // console.log(!!productObj.isActive);
    // console.log(!!productObj.img1);

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

  $scope.updateDetails = function(productDetails, psheight, pswidth, psprice){
    console.log(psheight, "psheight");
    console.log(pswidth, "pswidth");

    console.log(psprice, "psprice");

    if(psheight == undefined || pswidth == undefined || psprice == undefined){
      console.log("not defined");
    }
    // if(productDetails.height == undefined || productDetails.width == undefined || productDetails.price == undefined){
    //   console.log("not defined");
    // }
    console.log(productDetails);
    let details = {
      // height:
    }
  }

  $scope.deleteDetails = function(index, productDetails){

    var objLength = Object.keys(productDetails).length;
    for (var i = objLength-1; i >= 0; i--) {
      // if($scope.products[i].id === product.id){
      if(i === index){
      console.log(i, index);
        $scope.productDetails.splice(index, 1);
      }
    }
    console.log($scope.productDetails);
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
