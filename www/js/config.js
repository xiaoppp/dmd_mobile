angular.module('starter.config',['ionic'])
.constant('config',{
    host : 'http://192.168.1.101:3000/api/',
    loginkey : 'memberid'
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});
