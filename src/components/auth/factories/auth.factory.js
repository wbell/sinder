'use strict';

var authFactory = function($rootScope, $http, $q, $log, api){

  var authorizationStatus = false;
  var loggedInUser = null;

  var authenticate = function authenticate(info){

    return api.authenticate(info).then(function(userData){
      loggedInUser = userData;
      authorizationStatus = true;
      $rootScope.$broadcast('authorization', true);

      return userData;
    });

  };

  var authorized = function authorized(){
    return authorizationStatus;
  };

  var user = function user(){
    return loggedInUser;
  };

  return {
    authenticate: authenticate,
    authorized: authorized,
    user: user
  };
};

module.exports = authFactory;
