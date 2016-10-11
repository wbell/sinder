'use strict';

var authFactory = function authFactory($rootScope, $http, $q, $log, $firebaseAuth){

  var auth = $firebaseAuth();


  /**
   * login to firebase
   * @return {Promise} - resolves with authentication info
   */
  var login = function login(){

    return auth.$signInWithPopup('google').then(function(authInfo){
      $log.info('authInfo', authInfo);
      return authInfo;
    }).catch(function(error){
      $rootScope.$broadcast('handle_error', error);
    });

  };


  /**
   * log user out, ends authenticated session
   * @return {Promise}
   */
  var logout = function logout(){
    return auth.$signOut().then(function(){
      $log.warn('Signed Out');
    });
  };


  /**
   * gets current authentication status
   * @return {Object} - object if authenticated, otherwise null
   */
  var authorized = function authorized(){
    return auth.$getAuth();
  };


  /**
   * tracks changes in authorization
   * hook for broadcasting to the rootscope
   */
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
