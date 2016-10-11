'use strict';

var SillyName = require('sillyname');

var settingsCtrl = function settingsCtrl($rootScope, $scope, $state, $log, settingsFactory, authFactory, profile){

  // 3-way data bind to the firebase profile
  // profile.$bindTo($scope, 'profile');

  // 2-way data bind to the firebase profile
  $scope.profile = profile;

  $scope.defaultPhoto = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

  $scope.randomNickname = SillyName();

  // manually save changes
  $scope.saveSettings = function(profile){

    profile.$save().then(function(ref){
      return ref;
    }, function(error){
      $rootScope.$broadcast('handle_error', error);
    });

  };

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

};

module.exports = settingsCtrl;
