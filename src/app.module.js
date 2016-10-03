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
  pkg.name+'.apiModule'
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
  function($rootScope, $state, $log, auth){

    $rootScope.$on('$stateChangeStart', function(e, toState){
      $log.debug('authorized?', auth.authorized(), 'toState?', toState);

      // redirect to login if unauthorized
      if(!auth.authorized() && toState.name !== 'login'){
        e.preventDefault();
        $state.go('login');
      }

      // if authorized, skip to browse
      if(auth.authorized() && toState.name === 'login'){
        e.preventDefault();
        $state.go('browse');
      }
    });

    $rootScope.$on('authorization', function(e, val){

      // if authorized
      // 1. get / create profile
      // 2. go to browse
      if(val){
        auth.profileCheck(val).then(function(profile){
          $rootScope.profile = profile;
          if($state.current.name==='login') $state.go('browse');
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
