'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');
var wrapperCtrl = require('./views/wrapper/wrapper.controller');

var moduleName = pkg.name+'.wrapperModule';
var wrapperModule = angular.module(moduleName, []);

wrapperModule.controller(moduleName+'.wrapperCtrl', [
  '$rootScope',
  '$scope',
  wrapperCtrl
]);

module.exports = wrapperModule;
