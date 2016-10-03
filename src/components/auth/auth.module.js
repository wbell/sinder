'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var authFactory = require('./factories/auth.factory');
var loginCtrl = require('./views/login/login.controller');

var moduleName = pkg.name+'.authModule';
var authModule = angular.module(moduleName, []);

authModule.factory(moduleName+'.authFactory', [
  '$rootScope',
  '$http',
  '$q',
  '$log',
  '$firebaseAuth',
  '$firebaseObject',
  pkg.name+'.apiModule.apiFactory',
  authFactory
]);

authModule.controller(moduleName+'.loginCtrl', [
  '$rootScope',
  '$scope',
  '$state',
  moduleName+'.authFactory',
  loginCtrl
]);

module.exports = authModule;
