'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var settingsCtrl = require('./views/settings/settings.controller');

var moduleName = pkg.name+'.settingsModule';
var settingsModule = angular.module(moduleName, []);

settingsModule.controller(moduleName+'.settingsCtrl', [
  '$rootScope',
  '$scope',
  '$state',
  pkg.name+'.apiModule.apiFactory',
  settingsCtrl
]);

module.exports = settingsModule;
