'use strict';

var angular = require('angular');
var routes = require('./app.routes');
var pkg = require('../package.json');
var api = require('./components/api/factories/api.factory')();

api.initFirebase();

var appModule = angular.module(pkg.name, [
  'ngMaterial',
  'ui.router',
  'firebase',
  'gajus.swing',
  pkg.name+'.templatesModule',
  pkg.name+'.wrapperModule',
  pkg.name+'.headerModule',
  pkg.name+'.authModule',
  pkg.name+'.apiModule',
  pkg.name+'.settingsModule'
]);

appModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  routes
]);

appModule.run([
  '$rootScope',
  '$state',
  '$log',
  pkg.name+'.authModule.authFactory',
  pkg.name+'.settingsModule.settingsFactory',
  function($rootScope, $state, $log, authFactory, settingsFactory){

    $rootScope.$on('$stateChangeStart', function(e, toState){
      $log.debug('authorized?', authFactory.authorized(), 'toState?', toState);

      // redirect to login if unauthorized
      if(!authFactory.authorized() && toState.name !== 'login'){
        e.preventDefault();
        $state.go('login');
      }

      // if authorized, skip to chats
      if(authFactory.authorized() && toState.name === 'login'){
        e.preventDefault();
        $state.go('chats');
      }
    });

    $rootScope.$on('authorization', function(e, val){

      // if authorized
      // 1. get / create profile
      // 2. go to chats
      if(val){
        settingsFactory.profileCheck(val).then(function(profile){
          $rootScope.profile = profile;
          if($state.current.name==='login') $state.go('chats');
          $log.info('$rootScope.profile', $rootScope.profile);
        });
      }

      // if not on login, and not authorized, go to login
      if($state.current.name!=='login' && !val){
        $state.go('login');
      }

    });


  }
]);

module.exports = appModule;
