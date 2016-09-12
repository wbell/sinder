'use strict';

var angular = require('angular');
var pkg = require('../../../package.json');

var headerModule = angular.module(pkg.name+'.header', []);

module.exports = headerModule;
