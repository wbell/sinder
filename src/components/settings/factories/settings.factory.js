'use strict';

var settingsFactory = function settingsFactory($rootScope, $state, $log, $firebaseObject, api){

  // domain used to determine employee vs standard user
  var employeeDomain = 'pwc.com';

  /**
   * Checks for the existance of user profile in the database
   * @param  {Object} authObject - firebase authentication object
   * @return {Promise} - resolves with profile FirebaseObject
   */
  var profileCheck = function profileCheck(authObject){
    var ref = api.getRef('users', authObject.uid);
    var profile = $firebaseObject(ref);

    return profile.$loaded(function(){
      if(profile.$value === null){
        return createProfile(profile, authObject);
      } else {
        return profile;
      }
    });

  };

  /**
   * Creates the sinder profile object based on mappings
   * from the user's authentication info
   * @param  {FirebaseObject} profile - firebase profile object
   * @param  {Object} authObject - firebase authentication object
   * @return {Promise} - resolves with profile FirebaseObject
   */
  var createProfile = function createProfile(profile, authObject){
    profile.displayName = authObject.displayName;
    profile.email = authObject.email;
    profile.photoURL = authObject.photoURL;
    profile.employee = employeeCheck(authObject.email);

    return profile.$save().then(function(){
      return profile;
    });
  };

  /**
   * Checks if email belongs to the org
   * @param  {String} email - email address from the auth provider
   * @return {Boolean}       
   */
  function employeeCheck(email){
    return email.slice(-employeeDomain.length) === employeeDomain;
  }

  return {
    profileCheck: profileCheck,
    createProfile: createProfile
  };
};

module.exports = settingsFactory;
