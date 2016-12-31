angular.module("ccvApp").service("mainService", function($http){

  this.getAllProducts = function(){
    return $http({
      method: "GET",
      url: "/api/products"
    }).then(function(response){
      // console.log(response.data);
      return response.data
    })
  }

  this.getProductById = function(id){
    return $http({
      method: "GET",
      url: "/api/products/" + id
    }).then(function(response){
      console.log(response.data, "in service");
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


})
