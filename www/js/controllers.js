angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, config, DataService) {
    var memberid = localStorage.getItem('memberid')
    if (memberid === null || memberid === 'undefined') {
        $state.go('signin')
    }
})

.controller('MenuCtrl', function($scope, $state, $ionicSideMenuDelegate) {
    $scope.toggleRight = function () {
        $state.go('app.share')
    };
    $scope.toggleLeft = function () {
        console.log('left')
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('MoneyCtrl', function($scope, $ionicTabsDelegate, DataService) {
    $scope.onTabSelected = function(index) {
        if (index == 0) {
            DataService.IncomeRecords('money', 1)
        }
        if (index == 1) {
            DataService.IncomeRecords('interest', 1)
        }
        if (index == 2) {
            DataService.IncomeRecords('bonus', 1)
        }
    }
})

.controller('RecordCtrl', function($scope, $cordovaCamera, $cordovaFileTransfer, AlertService) {
    $scope.record = {};

    function uploadImage() {
        if (!$scope.record.photo)
            AlertService.Alert("还没有上传凭证")

        var server = "/api/pair/payment/upload";
        var filePath = $scope.record.photo;

        var options = new FileUploadOptions();
        options.fileKey = "image_file";
        options.fileName = $scope.record.photo.substr($scope.record.photo.lastIndexOf('/') + 1);
        options.mimeType = "text/plain";

        $cordovaFileTransfer.upload(server, filePath, options)
            .then(function (result) {
                AlertService.Alert("上传图片成功.");
            }, function (err) {
                AlertService.Alert("上传图片失败.");
            }, function (progress) {
            });
    }

    $scope.takeImage = function () {
        var options = {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            correctOrientation: true,
            allowEdit: false,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                $scope.record.photo = fileEntry.toURL();
                $scope.$apply();
            });
        }, function (err) {
            AlertService.Alert("拍照错误.");
        });
    };
})

.controller('SigninCtrl', function($scope, $state, DataService, AlertService) {

    $scope.user = {
        username: "17703446798",
        pwd: "1234"
    };

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

.controller('SettingsCtrl', function($scope, $state, config) {
    $scope.signout = function() {
        localStorage.removeItem("memberid")
        $state.go('signin')
    }
})

.controller('NewsCtrl',function($scope,$state,DataService,config){
    $scope.model = [];
    DataService.News(1).then(function(data){
        $scope.model = data.data.rows;
    }).catch(function(err){
        console.log(err)
    });
})

.controller('NewsDetailCtrl',function($scope,$state,$stateParams,DataService,config){
    var id = $stateParams.id
    $scope.model = {};
    DataService.NewsSingle(id).then(function(data){
        $scope.model = data.data;
    }).catch(function(err){
        console.log(err)
    });
})
