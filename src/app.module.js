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
  pkg.name+'.authModule.authFactory',
  function($rootScope, $state, auth){

    $rootScope.$on('$stateChangeStart', function(e, toState){

      // redirect to login if unauthorized
      if(!auth.authorized() && toState.name !== 'login'){
        e.preventDefault();
        $state.go('login');
      }
    });
  }
]);

module.exports = appModule;
