angular.module("ccvApp").directive('modal', function(modalService) {

  return {
    restrict: 'E',
    transclude: true,
    scope: false,
    template: '<ng-transclude></ng-transclude>',
    // template: '<h1>HELLLOOO<h1>',

    link: function(scope, element, attrs){

      console.log(attrs.id, "KLAJLG:KJDGLKJDSLGJSD");
     if (!attrs.id) {
         console.error('modal must have an id');
         return;
     }
     // move element to bottom of page (just before </body>) so it can be displayed above everything else
     element.appendTo('body');
     // close modal on background click
     element.on('click', function (e) {
       var target = $(e.target);
       if (!target.closest('.modal-body').length) {
         console.log("clicked background");
         scope.$evalAsync(Close);
       }
     });

     // add self (this modal instance) to the modal service so it's accessible from controllers
     var modal = {
         id: attrs.id,
         open: Open,
         close: Close
     };
     modalService.Add(modal);

     // remove self from modal service when directive is destroyed
     scope.$on('$destroy', function() {
         modalService.Remove(attrs.id);
         element.remove();
     });

     // open modal
     function Open() {
       console.log(element, "element.show()");
         element.show();
         $('body').addClass('modal-open');
     }

     // close modal
     function Close() {
         element.hide();
         $('body').removeClass('modal-open');
     }

    }
  }
});
