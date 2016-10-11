'use strict';

var SillyName = require('sillyname');

var settingsCtrl = function settingsCtrl($rootScope, $scope, $state, $log, settingsFactory, authFactory, profile){

  // 3-way data bind to the firebase profile
  // profile.$bindTo($scope, 'profile');

  // 2-way data bind to the firebase profile
  $scope.profile = profile;

  // defaults for the UI
  $scope.defaultPhoto = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
  $scope.randomNickname = SillyName();


  /**
   * manually save settings
   * @param  {FirebaseObject} profile - profile object ref
   */
  $scope.saveSettings = function(profile){

    profile.$save().then(function(ref){
      return ref;
    }, function(error){
      $rootScope.$broadcast('handle_error', error);
    });

  };


  /**
   * reset profile to google authentication defaults
   * @param {FirebaseObject} profile - profile object ref
   */
  $scope.resetDefaults = function(profile){

    profile.$remove().then(function(ref) {

      $log.debug('profile removed, ref', ref);

      settingsFactory
        .profileCheck(authFactory.authorized())
        .then(function(pro){
          $scope.profile = pro;
        });

    }, function(error) {
      $rootScope.$broadcast('handle_error', error);
    });
  };


  /**
   * de-authenticate user session
   */
  $scope.logout = function(){
    authFactory.logout();
  };

};

module.exports = settingsCtrl;
