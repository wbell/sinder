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
    template: 'Browse Sinder!'
  })

  .state({
    name: 'chats',
    url: '/chats',
    template: 'Your Chats'
  })

  .state({
    name: 'settings',
    url: '/settings',
    templateUrl: './src/components/settings/views/settings/settings.html',
    controller: pkg.name+'.settingsModule.settingsCtrl',
    resolve: {
      'profile': [
        pkg.name+'.authModule.authFactory',
        pkg.name+'.settingsModule.settingsFactory',
        function(authFactory, settingsFactory){
          return settingsFactory.profileCheck(authFactory.authorized());
        }
      ]
    }
  });

};

module.exports = routes;
