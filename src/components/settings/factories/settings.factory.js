'use strict';

var settingsFactory = function settingsFactory($rootScope, $state, $log, $firebaseObject, api){

  var employeeDomain = 'pwc.com';

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
    fbo.employee = employeeCheck(authInfo.email);

    return fbo.$save().then(function(){
      return fbo;
    });
  };

  function employeeCheck(email){
    return email.slice(-employeeDomain.length) === employeeDomain;
  }

  return {
    profileCheck: profileCheck,
    createProfile: createProfile
  };
};

module.exports = settingsFactory;
