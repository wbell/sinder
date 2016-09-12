'use strict';

var loginCtrl = function ($rootScope, $scope, $state, authFactory){

  $scope.info = {};

  $scope.login = function(info){
    return authFactory.authenticate(info).then(function(){
      $state.go('browse');
    });
  };
};

module.exports = loginCtrl;
