'use strict';

var user = require('../stubs/user.json');

var apiFactory = function apiFactory($rootScope, $http, $q, $log){

  var authenticate = function authenticate(info){
    $log.info('authenticating with info: ', info);

    return $q.resolve(user);
  };

  return {
    authenticate: authenticate
  };
};

module.exports = apiFactory;
