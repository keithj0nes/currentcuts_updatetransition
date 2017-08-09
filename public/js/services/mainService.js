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
  this.adminGetAllProducts = function(){
    return $http({
      method: "GET",
      url: "/api/admin/products"
    }).then(function(response){
      // console.log(response.data, "getAllProducts");
      return response.data
    })
  }

  this.adminEditProducts = function(id){
    return $http({
      method: "GET",
      url: "/api/admin/products/" + id + "/details"
    }).then((res) => {
      return res.data;
    })
  }

  this.adminUpdateProductSizePrice = function(id, sizePriceDetails){
    return $http({
      method: "PUT",
      url: "/api/products/" + id + "/sizeprice",
      data: sizePriceDetails
    }).then((res) => {
      console.log(res, "updated price and size in service");
    })
  }

  this.adminDeleteDetails = function(id, sizePriceDetails){
    console.log("******");
    console.log(sizePriceDetails);
    return $http({
      method: "DELETE",
      url: "api/products/" + id + "/sizeprice",
      data: sizePriceDetails,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    }).then((res) => {
      console.log(res, "adminDeleteDetails in service");
    })
  }

  this.adminSaveCategory = function(updateCat, productId){

    return $http({
      method: "PUT",
      url: "/api/admin/products/" + productId + "/categories",
      data: updateCat
    }).then((res) => {
      return res.data;
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

  this.addProduct = function(productAdd){
    return $http({
      method: "POST",
      url: "/api/products",
      data: productAdd
    }).then((res) => {
      console.log(res.data);
      return res.data;
    })

    //.success(function(){
    //   alert: "SUCCESS!";
    // })
  }


  this.updateProduct = function(id, productUpdate){
    return $http({
      method: "PUT",
      url: "/api/products/" + id,
      data: productUpdate
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



  // this.addProductsToCart = function(productSize,productColor,productQuantity,productName,productPrice,productImage,productId,productOutline){
  //
  //   const cartData = {
  //     productSize: productSize,
  //     productColor: productColor,
  //     productQuantity: productQuantity,
  //     productName: productName,
  //     productPrice: productPrice,
  //     productImage: productImage,
  //     productId: productId,
  //     productOutline: productOutline
  //   }
  //   // console.log(cartData);
  //   return $http({
  //     method: "POST",
  //     url: "/api/cart",
  //     data: cartData
  //   }).success(function(){
  //     console.log("Item Added!");
  //   })
  // }

  this.addProductsToCart = function(cartData){
    return $http({
      method: "POST",
      url: "/api/cart",
      data: cartData
    }).success(function(){
      console.log("Item Added!");
    })
  }

  this.updateProductsInCart = function(cartData){
    return $http({
      method: "PUT",
      url: "/api/cart",
      data: cartData
    }).then(function(res){
      console.log(res, "in service");
      return res.data;
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
//not being used anywhere
  // this.logout = function(){
  //   return ({
  //     method: "GET",
  //     url: "/api/user/logout"
  //   }).success(function(){
  //   })
  // }

  this.getOrderHistory = function(){
    return $http({
      method: "GET",
      url: "/api/user/orders"
    }).then(function(response){
      console.log(response, "reponse in srvice");
      return response.data;
    })
  }


  this.getOrderById = (id) => {
    return $http({
      method: "GET",
      url: "/api/user/orders/" + id
    }).then((response) => {
      // console.log(response, "getOrderById service");
      return response.data;
    })
  }

  this.getThankYouById = (id) => {
    return $http({
      method: "GET",
      url: "/api/order/" + id + "/thankyou"
    }).then((response) => {
      console.log(response);
      return response.data;
    })
  }


  this.addShippingInfo = function(details){
    console.log(details, "in service");
    return details;
  }

  this.updateAccount = function(newEmail){

    return $http({
      method: "PUT",
      url: "/api/user/email",
      data: newEmail
    }).then((res) => {
      console.log(res);
      return res.data
    })
  }

  this.addFavorite = function(productId){
    const product = {
      productId: productId
    }
    return $http({
      method: "POST",
      url: "/api/user/favorites",
      data: product
    }).then((res) => {
      console.log(res);
      return res.data;
    })
  }

  this.getFavorites = function(){
    return $http({
      method: "GET",
      url: "/api/user/favorites"
    }).then((res) => {
      console.log(res, "getFavorites in service");
      return res.data;
    })
  }


  this.getProductByCategory = function(catId){
    // console.log(catId);
    return $http({
      method: "GET",
      url: "/api/products/category/" + catId
    }).then(function(res){
      return res.data;
    })
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
