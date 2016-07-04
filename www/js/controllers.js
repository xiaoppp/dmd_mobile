angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, config) {
    if (localStorage.getItem(config.loginkey) === null) {
        $state.go('signin')
    }
})

.controller('MenuCtrl', function($scope, $state) {
    $scope.toggleRight = function () {
        $state.go('app.share')
    };
})

.controller('SigninCtrl', function($scope, $state, DataService, AlertService) {
    $scope.user = {
        username: "17703446798",
        pwd: "06091"
    }

    $scope.signin = function() {
        DataService.Login($scope.user)
            .then(function(d) {
                $state.go('app.me')
                AlertService.Alert('登录成功')
            })
            .catch(function(err) {
                AlertService.Alert(err)
            })
    }
})

.controller('SignupCtrl', function($scope) {
    $scope.user = {
        refer: {
            mobile: "130202929",
            username: "酷哥"
        },
        sex: 1,
        username: "asdfdsf",
        mobile: "1323109292",
        pwd: "asdfdsf",
        pay_pwd: "123123"
    }
})
