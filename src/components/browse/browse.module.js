'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var browseFactory = require('./factories/browse.factory');
var browseCtrl = require('./views/browse/browse.controller');

var moduleName = pkg.name+'.browseModule';
var browseModule = angular.module(moduleName, []);

browseModule.factory(moduleName+'.browseFactory', [
  '$rootScope',
  '$http',
  '$q',
  '$log',
  pkg.name+'.apiModule.apiFactory',
  browseFactory
]);

browseModule.controller(moduleName+'.browseCtrl', [
  '$rootScope',
  '$scope',
  '$state',
  pkg.name+'.authModule.authFactory',
  browseCtrl
]);

module.exports = browseModule;
