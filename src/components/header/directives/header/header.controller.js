'use strict';

var headerCtrl = function headerCtrl($rootScope, $scope, $state){

  $scope.visible = $rootScope.authorized;

  $scope.$on('authorization', function(e, authorized){
    $scope.visible = authorized;
  });

  $scope.selectedTabIndex = 0;

  $scope.$watch('selectedTabIndex', function(newVal){
    $scope.selectTab($scope.tabs[newVal]);
  });

  $scope.tabs = [
    {
      name: 'Chats',
      icon: '',
      state: 'chats'
    },
    {
      name: 'Settings',
      icon: '',
      state: 'settings'
    }
  ];

  $scope.selectTab = function(tab){
    $state.go(tab.state);
  };

};

module.exports = headerCtrl;
