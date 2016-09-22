'use strict';

// libraries
require('angular');
require('firebase');
require('angularfire');
require('angular-ui-router');
require('angular-material');
require('angular-swing');

// component modules
require('./components/**/*.module.js', {mode: 'expand'});

// base module
require('./app.module.js');
