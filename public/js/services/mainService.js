angular.module("ccvApp").service("mainService", function($http){

  this.getAllProducts = function(){

    return $http({
      method: "GET",
      url: "/api/products"
    }).then(function(response){

      console.log(response.data);
      return response.data
    })

  }

})
