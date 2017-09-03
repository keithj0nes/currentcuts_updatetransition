angular.module("ccvApp").controller("contactController", function($scope, mainService){


  $scope.clearInput = function(model){
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

     //clear form after submit to backend
      $scope.contactNameFirst = "";
      $scope.contactNameLast = "";
      $scope.contactEmail = "";
      $scope.contactSubject = "";
      $scope.contactMessage = "";

      //ADD A TIMER
      // swal("sending...");

      mainService.sendContactEmail(contactData).then((res) => {
        console.log(res, "res in controller");
        if(res.yo !== 'error'){
          swal("Your email has been sent!")
        } else {
          swal("An error has occured", "please try sending your request again")
        }
      })
    }
  }
})
