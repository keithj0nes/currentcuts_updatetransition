angular.module("ccvApp").controller("categoryController", function($scope, $state, mainService){

  $scope.bottomLevel = false;


  var currentWord = $state.params.catname;
  if(currentWord.indexOf("_") >= 1 ){
    console.log(true);
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
    console.log(false);
    $scope.title = currentWord.charAt(0).toUpperCase() + currentWord.substring(1)
  }
  console.log($scope.title)

  mainService.getProductByCategory($state.params.catname).then((res) => {
    console.log(res, "logging res in categories controller");
    $scope.subCategories = res;

    // for(var i = 0; i <$scope.subCategories.length;i++){
    //   var currentWord = $scope.subCategories[i].name;
    //   console.log('lakjsdglkas;d');
    //
    //   if(currentWord.indexOf("_") >= 1 ){
    //     currentWord = currentWord.split("_")
    //     for(var j = 0; j < currentWord.length; j++){
    //       currentWord[j] = currentWord[j].charAt(0).toUpperCase() + currentWord[j].substring(1)
    //     }
    //     console.log('here');
    //     $scope.subCategories[i].titleName = currentWord.join(" ")
    //
    //     var updatedCurrentWord = $scope.subCategories[i].titleName
    //     for(var k = 0; k < updatedCurrentWord.length; k++){
    //       if(updatedCurrentWord[k] === updatedCurrentWord[k].toUpperCase()){
    //         if(updatedCurrentWord[k+1] === " "){
    //           updatedCurrentWord = updatedCurrentWord.replace(" ", "")
    //         }
    //       }
    //     }
    //     $scope.subCategories[i].titleName = updatedCurrentWord;
    //   } else {
    //     console.log('hereeeeeee');
    //     $scope.subCategories[i].titleName = currentWord.charAt(0).toUpperCase() + currentWord.substring(1)
    //     }
    //   // console.log($scope.subCategories[i].titleName)
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
