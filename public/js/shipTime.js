angular.module("ccvApp").directive("shiptime", function($interval){


  return {
    restrict: "AE",
    templateUrl: "./views/productSingle.html",
    link: function(scope, element, attr){

        scope.test = "heyyyy"

          function clockFn() {
            moment().format('LTS');
          }

          clockFn();
          $interval(clockFn, 1000)
          //console.log(clockFn())

          }

    }



})
