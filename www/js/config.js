angular.module('starter.config',['ionic'])
.constant('config',{
    //host : 'http://192.168.1.101:3000/api/',
    //host : 'http://192.168.1.107:3000/api/',
    host : 'http://112.124.15.7/api/',
    domain : 'http://112.124.15.7/',
    loginkey : 'memberid',
    appDataLoaded : false
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});