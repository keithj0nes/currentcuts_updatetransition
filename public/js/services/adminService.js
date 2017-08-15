angular.module("ccvApp").service("adminService", function($http){

  this.adminGetAllProducts = function(){
    return $http({
      method: "GET",
      url: "/api/admin/products"
    }).then(res => res.data);
  }

  this.adminAddProduct = function(productAdd){
    return $http({
      method: "POST",
      url: "/api/admin/products",
      data: productAdd
    }).then(res => res.data);
  }

  this.adminUpdateProduct = function(id, productUpdate){
    return $http({
      method: "PUT",
      url: "/api/admin/products/" + id,
      data: productUpdate
    }).then(res => res.data);
  }

  this.adminDeleteProduct = function(productId){
    return $http({
      method: "DELETE",
      url: "/api/admin/products/" + productId
    }).then(res => res.data);
  }

  this.adminEditProducts = function(id){
    return $http({
      method: "GET",
      url: "/api/admin/products/" + id + "/details"
    }).then(res => res.data);
  }

  this.adminUpdateProductSizePrice = function(id, sizePriceDetails){
    return $http({
      method: "PUT",
      url: "/api/admin/products/" + id + "/sizeprice",
      data: sizePriceDetails
    }).then(res => res.data);
  }

  this.adminDeleteDetails = function(id, sizePriceDetails){
    return $http({
      method: "DELETE",
      url: "api/admin/ products/" + id + "/sizeprice",
      data: sizePriceDetails,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    }).then(res => res.data);
  }

  this.adminSaveCategory = function(updateCat, productId){
    return $http({
      method: "PUT",
      url: "/api/admin/products/" + productId + "/categories",
      data: updateCat
    }).then(res => res.data);
  }

  this.adminDeleteCategory = function(categoryDetails, id){
    return $http({
      method: "DELETE",
      url: "/api/admin/products/" + id + "/categories",
      data: categoryDetails,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    }).then(res => res.data);
  }

  this.adminGetOpenOrders = function(){
    return $http({
      method: "GET",
      url: "/api/admin/orders/open"
    }).then(res => res.data);
  }


})
