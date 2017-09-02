angular.module("ccvApp").controller("contactController", function($scope){


  $scope.clearInput = function(model){
    console.log(model);
    switch (model) {
      case 'contactNameFirst': $scope.contactNameFirstR = false; break;
      case 'contactEmail': $scope.contactEmailR = false; break;
      case 'contactSubject': $scope.contactSubjectR = false; break;
      case 'contactMessage': $scope.contactMessageR = false; break;
    }
  }


  $scope.contactFormSubmit = function(fname, lname, email, subject, message){

    $scope.contactNameFirstR = false;
    $scope.contactEmailR = false;
    $scope.contactSubjectR = false;
    $scope.contactMessageR = false;

    if(!fname){$scope.contactNameFirstR = true;}
    if(!email){$scope.contactEmailR = true;}
    if(!subject){$scope.contactSubjectR = true;}
    if(!message){$scope.contactMessageR = true;}

    if($scope.contactNameFirstR === true ||
       $scope.contactEmailR === true ||
       $scope.contactSubjectR === true ||
       $scope.contactMessageR === true){
         console.log("not storing data yet");
    } else {

      const contactData = {
        fname,
        lname,
        email,
        subject,
        message
      }
      console.log(contactData);

     //clear form after submit to backend
      $scope.contactNameFirst = "";
      $scope.contactNameLast = "";
      $scope.contactEmail = "";
      $scope.contactSubject = "";
      $scope.contactMessage = "";

      setTimeout(function(){
        alert("SUCCESS!");
      },100)
    }
  }
})
