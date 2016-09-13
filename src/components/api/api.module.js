'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var apiFactory = require('./factories/api.factory');

var moduleName = pkg.name+'.apiModule';
var authModule = angular.module(moduleName, []);

authModule.factory(moduleName+'.apiFactory', [
  '$rootScope',
  '$http',
  '$q',
  '$log',
  apiFactory
]);

module.exports = authModule;
