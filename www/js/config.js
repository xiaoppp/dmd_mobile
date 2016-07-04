var app = angular.module('starter.config',['ionic']);

app.constant('config',{
    host : '',
    loginKey : 'member.login.information'
});


app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
});
