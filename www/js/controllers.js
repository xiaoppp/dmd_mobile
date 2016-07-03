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
        localStorage.setItem('userid', $scope.user.username)
        $state.go('app.me')
    }
})

.controller('SignupCtrl', function($scope) {

})
