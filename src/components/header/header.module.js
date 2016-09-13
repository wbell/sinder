'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');
var headerDir = require('./directives/header/header.directive');

var moduleName = pkg.name+'.headerModule';
var headerModule = angular.module(moduleName, []);

headerModule.directive(pkg.directivePrefix+'Header', headerDir);

module.exports = headerModule;
