angular.module("ccvApp").service("mainService", function($http){

  this.getAllProducts = function(){
    return $http({
      method: "GET",
      url: "/api/products"
    }).then(function(response){
      console.log(response.data, "getAllProducts");
      return response.data
    })
  }

  this.getProductById = function(id){
    return $http({
      method: "GET",
      url: "/api/products/" + id
    }).then(function(response){
      // console.log(response.data, "in service");
      return response.data;
    })
  }

  this.getProductById2 = function(id){
    return $http({
      method: "GET",
      url: "/api/products/" + id + "/details"
    }).then(function(response){
      // console.log(response.data, "in service");
      return response.data;
    })
  }

  this.getProductByName = function(name){
    console.log(name, "searched letters in service");
    return $http({
      method: "GET",
      url: "/api/search/" + name
    }).then(function(response){
      console.log(response.data, "search by name in service");
      return response.data;
    })
  }

  this.addProduct = function(name, description, price, img1, img2){
    const productObj = {
      name: name,
      description: description,
      price: price,
      img1: img1,
      img2: img2
    }
    return $http({
      method: "POST",
      url: "/api/products",
      data: productObj
    }).success(function(){
      alert: "SUCCESS!";
    })
  }

  this.updateProduct = function(id, name, description, price, img1, img2){
    const productObj = {
      name: name,
      description: description,
      price: price,
      img1: img1,
      img2: img2
    }
    return $http({
      method: "PUT",
      url: "/api/products/" + id,
      data: productObj
    }).success(function(){
      alert: "SUCCESS!";
    })
  }


  this.deleteProduct = function(product){
    const productId = product.id;
    return $http({
      method: "DELETE",
      url: "/api/products/" + productId
    })
  }


  this.getAuth = ()=> {
    console.log("getAuth running");
    return $http({
      method: "GET",
      url: "/api/checkauth"
    }).then((response) => {
      return response.data;
    })
  }

  this.getUsername = ()=> {
    return $http({
      method: "GET",
      url: "/api/currentuser"
    }).then((response) => {
      return response.data;
    })
  }



  this.addProductsToCart = function(productSize,productColor,productQuantity,productName,productPrice,productImage,productId){
    const cartData = {
      productSize: productSize,
      productColor: productColor,
      productQuantity: productQuantity,
      productName: productName,
      productPrice: productPrice,
      productImage: productImage,
      productId: productId
    }
    // console.log(cartData);
    return $http({
      method: "POST",
      url: "/api/cart",
      data: cartData
    }).success(function(){
      console.log("Item Added!");
    })
  }

  this.getProductsInCart = function(){
    return $http({
      method: "GET",
      url: "/api/cart"
    }).then(function(response){
      // console.log(response.data, "in service");
      return response.data;
    })
  }

  this.deleteProductsInCart = function(item){

    console.log(item, "In service");
    return $http({
      method: "DELETE",
      url: "/api/cart/" + item
    }).then(function(response){
      return response;
    })
  }

  this.logout = function(){
    return ({
      method: "GET",
      url: "/logout"
    }).success(function(){
    })
  }

  this.getOrderHistory = function(){
    return $http({
      method: "GET",
      url: "/api/orderhistory"
    }).then(function(response){
      console.log(response, "reponse in srvice");
      return response.data;
    })
  }


  this.getOrderById = (id) => {
    return $http({
      method: "GET",
      url: "/api/order/" + id
    }).then((response)=>{
      // console.log(response, "getOrderById service");
      return response.data;
    })
  }


  this.addShippingInfo = function(details){
    console.log(details, "in service");
    return details;
  }




  // this.cartStorage = [1,2,3];
  // this.sum = this.cartStorage.reduce(function(a, b) { return a + b; }, 0);
  //
  // this.getCartStorage = () => {
  //   console.log(this.cartStorage, "loggin cart storage service");
  //   console.log(this.sum, "sum in service");
  //   return this.sum;
  // }



})
