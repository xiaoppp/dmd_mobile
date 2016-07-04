var app = angular.module('starter.config',['ionic']);

app.constant('config',{
    host : 'http://192.168.1.102:3000/api/',
    loginKey : 'member.login.information'
});

app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});
