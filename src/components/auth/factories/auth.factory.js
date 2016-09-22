'use strict';

var authFactory = function authFactory($rootScope, $http, $q, $log, $firebaseAuth){

  var auth = $firebaseAuth();
  var authorizationStatus = false;
  var loggedInUser = null;

  /**
   * login to firebase
   * @return {Promise} - resolves with user info
   */
  var login = function login(){

    return auth.$signInWithPopup('google').then(function(firebaseUser){
      loggedInUser = firebaseUser;
      authorizationStatus = true;
      $rootScope.$broadcast('authorization', authorizationStatus);
      $log.info('loggedInUser', loggedInUser);

      return loggedInUser;
    }).catch(function(error){
      $log.error('Auth failed: ', error);
    });

  };

  var logout = function logout(){
    return auth.$signOut().then(function(){
      $log.warn('Signed Out');
      authorizationStatus = false;
      $rootScope.$broadcast('authorization', authorizationStatus);
    });
  };

  var authorized = function authorized(){
    return authorizationStatus;
  };

  return {
    login: login,
    logout: logout,
    authorized: authorized
  };
};

module.exports = authFactory;
