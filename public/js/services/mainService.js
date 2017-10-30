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
      url: "/api/user/account",
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

  this.sendContactEmail = function(contactData){
    console.log(contactData, "contactData in service");
    return $http({
      method: "POST",
      url: "/api/contact",
      data: contactData
    }).then(res => res.data);
  }

  this.existingLogIn = function(existingUser){
    console.log(existingUser);
    return $http({
      method: "POST",
      url: "/auth/login",
      data: existingUser
    }).then(res => res.data);
  }

  this.newUserSignUp = function(newUser){
    console.log(newUser);
    return $http({
      method: "POST",
      url: "/auth/signup",
      data: newUser
    }).then(res => res.data);
  }

  this.updatePass = function(newPass){
    console.log(newPass, "new pass in mainService");
    return $http({
      method: "PUT",
      url: "/api/user/account/pass",
      data: newPass
    }).then(res => res.data);
  }

  this.resetPasswordEmail = function(email){
    console.log(email, "email in service");
  }


})
