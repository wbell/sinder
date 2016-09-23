'use strict';

var loginCtrl = function ($rootScope, $scope, $state, authFactory){

  $scope.info = {};

  $scope.login = function(){
    return authFactory.login();
  };
};

module.exports = loginCtrl;
