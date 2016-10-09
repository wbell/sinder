'use strict';

var wrapperCtrl = function wrapperCtrl($rootScope, $scope){

  $scope.slideLeft = true;

  var stateOrder = ['login', 'chats', 'browse', 'settings'];

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState){
    var toIndex = stateOrder.indexOf(toState.name);
    var fromIndex = stateOrder.indexOf(fromState.name);

    if(toIndex > fromIndex){
      $scope.slideLeft = true;
    } else {
      $scope.slideLeft = false;
    }
  });

};

module.exports = wrapperCtrl;
