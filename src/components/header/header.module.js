'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');
var headerDir = require('./directives/header/header.directive');

var headerModule = angular.module(pkg.name+'.headerModule', []);

headerModule.directive(pkg.directivePrefix+'Header', headerDir);

module.exports = headerModule;
