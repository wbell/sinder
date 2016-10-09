'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var settingsFactory = require('./factories/settings.factory');
var settingsCtrl = require('./views/settings/settings.controller');

var moduleName = pkg.name+'.settingsModule';
var settingsModule = angular.module(moduleName, []);

settingsModule.factory(moduleName+'.settingsFactory', [
  '$rootScope',
  '$state',
  '$log',
  '$firebaseObject',
  pkg.name+'.apiModule.apiFactory',
  settingsFactory
]);

settingsModule.controller(moduleName+'.settingsCtrl', [
  '$rootScope',
  '$scope',
  '$state',
  pkg.name+'.apiModule.apiFactory',
  settingsCtrl
]);

module.exports = settingsModule;
