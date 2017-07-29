angular.module("ccvApp").controller("categoryController", function($scope, $state, mainService){

  $scope.bottomLevel = false;
  $scope.title = "Category"

  mainService.getProductByCategory($state.params.catname).then((res) => {
    console.log(res, "logging res in categories controller");
    $scope.title = $state.params.catname;
    $scope.subCategories = res.categoryProductsDetails || res;
    //
    // if($scope.subCategories.active){
    //   "THIS IS THE BOTTOM LEVEL"
    // }

    if(res.bottomlevel === true){
      $scope.bottomLevel = true;
      $scope.categoryProducts = res.categoryProductsDetails;
    }

  })
})






//////////script to capitalize words and acronyms////////

// for(var i = 0; i <arr.length;i++){
//   var currentWord = arr[i].name;
//   if(currentWord.indexOf("_") >= 1 ){
//     currentWord = currentWord.split("_")
//     for(var j = 0; j < currentWord.length; j++){
//       currentWord[j] = currentWord[j].charAt(0).toUpperCase() + currentWord[j].substring(1)
//     }
//
//     currentWord = currentWord.join(" ")
//
//     for(var k = 0; k < currentWord.length; k++){
//       if(currentWord[k] === currentWord[k].toUpperCase()){
//         if(currentWord[k+1] === " "){
//           currentWord = currentWord.replace(" ", "")
//         }
//       }
//     }
//
//   } else {
//     currentWord = currentWord.charAt(0).toUpperCase() + currentWord.substring(1)
//     }
//   console.log(currentWord)
// }
