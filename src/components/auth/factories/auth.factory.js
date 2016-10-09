'use strict';

var authFactory = function authFactory($rootScope, $http, $q, $log, $firebaseAuth){

  var auth = $firebaseAuth();

  /**
   * login to firebase
   * @return {Promise} - resolves with user info
   */
  var login = function login(){

    return auth.$signInWithPopup('google').then(function(firebaseUser){
      $log.info('firebaseUser', firebaseUser);
      return firebaseUser;
    }).catch(function(error){
      $log.error('Auth failed: ', error);
    });

  };

  var logout = function logout(){
    return auth.$signOut().then(function(){
      $log.warn('Signed Out');
    });
  };

  var authorized = function authorized(){
    return auth.$getAuth();
  };

  auth.$onAuthStateChanged(function() {
    var isAuthorized = authorized();

    $log.debug('auth status changed', isAuthorized);

    $rootScope.$broadcast('authorization', isAuthorized);

  });

  return {
    login: login,
    logout: logout,
    authorized: authorized
  };
};

module.exports = authFactory;
