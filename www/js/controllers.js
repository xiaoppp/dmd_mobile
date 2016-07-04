angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state) {
    if (localStorage.getItem('userid') == null) {
        $state.go('signin')
    }
})

.controller('SigninCtrl', function($scope, $state) {
    $scope.user = {
        username: "17703446798",
        pwd: "06091"
    }

    $scope.signin = function() {
        // DataService.Login()
        //     .then(function(d) {
        //         AlertService.Alert('登录成功')
        //         $state.go('app.me')
        //     })
        //     .catch(function(err) {
        //         AlertService.Alert(err)
        //     })
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
