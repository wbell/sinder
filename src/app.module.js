'use strict';

var angular = require('angular');
var routes = require('./app.routes');
var pkg = require('../package.json');

var appModule = angular.module(pkg.name, [
  'angular-material',
  'ui.router',
  pkg.name+'.header'
]);

appModule.config([
  '$stateProvider',
  '$urlRouterProvider',
  routes
]);


module.exports = appModule;
