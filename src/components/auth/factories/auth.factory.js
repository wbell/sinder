'use strict';

var userData = require('./user.json');

var authFactory = function($rootScope, $http, $q, $log){

  var authorizationStatus = false;
  var loggedInUser = null;

  var authenticate = function authenticate(info){
    $log.debug('authenticating with info:', info);

    user = userData;
    authorizationStatus = true;
    $rootScope.$broadcast('authorization', true);

    return $q.resolve(userData);
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
