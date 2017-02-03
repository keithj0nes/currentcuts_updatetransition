angular.module("ccvApp").directive("shipDate", function(){


  return {
    restrict: "AE",
    template: "<div class='shipping-date'><i class='material-icons ship-truck'>local_shipping</i> Your order will ship by {{daystoship}}.</div>" ,
    link: function(scope, elem, attr){
       scope.daystoship = moment().add(3, "days").format('MMMM Do');
    }
  }


})
