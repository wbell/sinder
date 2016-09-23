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

      // if authorized, don't direct to login page
      if(auth.authorized() && toState.name === 'login'){
        e.preventDefault();
        $state.go('browse');
      }
    });

    $rootScope.$on('authorization', function(e, val){

      if($state.current.name==='login' && val){
        $state.go('browse');
      }

      if($state.current.name!=='login' && !val){
        $state.go('login');
      }

    });


  }
]);

module.exports = appModule;
