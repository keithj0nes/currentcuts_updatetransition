angular.module('ccvApp').factory('modalService', function(){

  var modals = []; // array of modals on the page
  var service = {};

  service.Add = Add;
  service.Remove = Remove;
  service.Open = Open;
  service.Close = Close;


  return service;

  function Add(modal) {
    console.log("herrrrreee");
      // add modal to array of active modals
      modals.push(modal);
      // console.log(modals);
  }

  function Remove(id) {
      // remove modal from array of active modals
      var modalToRemove = _.findWhere(modals, { id: id });
      modals = _.without(modals, modalToRemove);
  }

  function Open(id) {
      // open modal specified by id
      console.log("should be opening");
      var modal = _.findWhere(modals, { id: id });
      console.log(modal, "modal");
      modal.open();
  }

  function Close(id) {
      // close modal specified by id
      var modal = _.findWhere(modals, { id: id });
      modal.close();
  }

  function myFindWhere(array, criteria) {
return array.find(item => Object.keys(criteria).every(key => item[key] === criteria[key]))
}

});
