var app = angular.module('starter.config',['ionic']);

app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});

app.constant('config',{
    host : '',
    loginKey : 'member.login.information'
});

