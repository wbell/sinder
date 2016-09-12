'use strict';

var pkg = require('../package.json');

var routes = function routes($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider

  // login
  .state({
    name: 'login',
    url: '/login',
    templateUrl: './src/components/auth/views/login/login.html',
    controller: pkg.name+'.authModule.loginCtrl'
  })

  .state({
    name: 'browse',
    url: '/browse',
    template: 'Browse sinder!'
  });

};

module.exports = routes;
