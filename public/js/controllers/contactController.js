angular.module("ccvApp").controller("contactController", function($scope, $timeout, mainService, modalService){



  $scope.openModal =function(id){
    modalService.Open(id);
  }

  $scope.closeModal = function(id){
    modalService.Close(id);
  }

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
    } else {

      $scope.loaderActive = true;

      //create contact form object to send to service
      const contactData = {fname, lname, email, subject, message};

      mainService.sendContactEmail(contactData).then((res) => {


        $scope.loaderActive = false;

        //timeout allows loader to stop before modal pops up, showing white screen for x time
        $timeout(function(){
          $scope.openModal('contact-email-modal');
          if(res.yo !== 'error'){
            $scope.modalMessage = "Your email has been sent!";

            //clear form after submit returns successful
            $scope.contactNameFirst = "";
            $scope.contactNameLast = "";
            $scope.contactEmail = "";
            $scope.contactSubject = "";
            $scope.contactMessage = "";
          } else {
            $scope.modalMessage = "An error has occured, please try sending your request again";
          }
        },100)

      })
    }
  }


})
