'use strict';

var firebase = window.firebase = require('firebase');

var apiFactory = function apiFactory($rootScope, $http, $q, $log){

  var firebaseConfig = {
    apiKey: 'AIzaSyBdfFlQcDOsP6rFkCYx_HCLBwKTcfS2Mls',
    authDomain: 'sinder-fd3b7.firebaseapp.com',
    databaseURL: 'https://sinder-fd3b7.firebaseio.com',
    storageBucket: 'sinder-fd3b7.appspot.com'
  };

  var initFirebase = function initFirebase(){
    firebase.initializeApp(firebaseConfig);
  };

  var fb = function fb(){
    return firebase;
  };

  return {
    initFirebase: initFirebase,
    fb: fb
  };
};

module.exports = apiFactory;
