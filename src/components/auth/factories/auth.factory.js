'use strict';

var authFactory = function authFactory($rootScope, $http, $q, $log, $firebaseAuth, $firebaseObject, api){

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

  var profileCheck = function profileCheck(firebaseUserObject){
    var ref = api.getRef('users', firebaseUserObject.uid);
    var profile = $firebaseObject(ref);

    return profile.$loaded(function(){
      if(profile.$value === null){
        return createProfile(profile, firebaseUserObject);
      } else {
        return profile;
      }
    });

  };

  var createProfile = function createProfile(fbo, authInfo){
    fbo.displayName = authInfo.displayName;
    fbo.email = authInfo.email;
    fbo.photoURL = authInfo.photoURL;

    return fbo.$save().then(function(){
      return fbo;
    });
  };

  auth.$onAuthStateChanged(function() {
    var isAuthorized = authorized();

    $log.debug('auth status changed', isAuthorized);

    $rootScope.$broadcast('authorization', isAuthorized);

  });

  return {
    login: login,
    logout: logout,
    authorized: authorized,
    profileCheck: profileCheck
  };
};

module.exports = authFactory;
