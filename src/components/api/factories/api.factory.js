'use strict';

var firebase = window.firebase = require('firebase');

var apiFactory = function apiFactory(/*$rootScope, $http, $q, $log*/){

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

  var getRef = function getRef(path, id){
    var rootRef = firebase.database.ref();
    var ref = rootRef.child(path);

    if(id) ref = ref.child(id);

    return ref;
  };

  return {

    // initialization
    initFirebase: initFirebase,
    firebase: fb,

    // get db ref
    getRef: getRef

  };
};

module.exports = apiFactory;
