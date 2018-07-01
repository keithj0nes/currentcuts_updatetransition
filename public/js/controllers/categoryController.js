angular.module("ccvApp").controller("categoryController", function($scope, $state, mainService){

  $scope.bottomLevel = false;
  $scope.loading = true;

  var currentWord = $state.params.catname;
  if(currentWord.indexOf("_") >= 1 ){
    currentWord = currentWord.split("_")
    for(var j = 0; j < currentWord.length; j++){
      currentWord[j] = currentWord[j].charAt(0).toUpperCase() + currentWord[j].substring(1)
    }

    $scope.title = currentWord.join(" ")
    var newCurrentWord = $scope.title
    for(var k = 0; k < newCurrentWord.length; k++){
      if(newCurrentWord[k] === newCurrentWord[k].toUpperCase()){
        if(newCurrentWord[k+1] === " "){
          newCurrentWord = newCurrentWord.replace(" ", "")
        }
      }
    }
    $scope.title = newCurrentWord;
  } else {
    $scope.title = currentWord.charAt(0).toUpperCase() + currentWord.substring(1)
  }

  mainService.getProductByCategory($state.params.catname).then((res) => {
    $scope.subCategories = res;
    $scope.loading = false;

    if(res.bottomlevel === true){
      $scope.bottomLevel = true;
      $scope.categoryProducts = res.categoryProductsDetails;
    }
  })
})
