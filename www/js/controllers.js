angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, config,Auth) {
    if (!Auth.has()) {
        $state.go('signin');
    } else {
        $state.go('app.loading');
    }
})

.controller('LoadingCtrl',function($scope,$state,config,DataService,$timeout){
    console.log('////app loading.');
    if(config.appDataLoaded) {
        console.log('app data is loaded.');
        $state.go('app.me');
    } else {
        DataService.loadAppData().then(function(data){
            config.appDataLoaded = true;
            $timeout(function(){
                $state.go('app.me');
            },1000)
        });
    }
})

.controller('ErrorCtrl',function($scope, $state, config, DataService){
    $scope.message = "Error";
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

.controller('MoneyCtrl', function($scope, $rootScope, $ionicTabsDelegate, DataService) {
    $scope.incomes = []
    $scope.onTabSelected = function(index) {
        if (index == 0) {
            DataService.IncomeRecords('money', 0).then(function(data) {
                $scope.incomes = data.data.rows;
            });
        }
        if (index == 1) {
            DataService.IncomeRecords('interest', 0).then(function(data) {
                $scope.incomes = data.data.rows;
            });
        }
        if (index == 2) {
            DataService.IncomeRecords('bonus', 0).then(function(data) {
                $scope.incomes = data.data.rows;
            });
        }
    }
})

.controller('RecordCtrl', function($scope, DataService, AlertService) {
    $scope.offers = [];
    $scope.applys = [];
    $scope.fails  = [];

    $scope.onTabSelected = function(n){
        var type = n == 0　? "offers" : n == 1 ? "applys" : "pairs/failed";
        var type2 = n == 0　? "offers" : n == 1 ? "applys" : "failed";
        DataService.DealRecords(type).then(function(data){
            $scope[type2] = data.data;
        });
    };

})

.controller('SigninCtrl', function($scope, $state, DataService, AlertService, config, Auth) {

    $scope.user = {
        username: "13803431018",
        pwd: "1234"
    };
    
    if(Auth.has()){
        $state.go('app.me');
    }
    
    $scope.signin = function() {
        DataService.Login($scope.user)
            .then(function(d) {
                $state.go('app.me')
                AlertService.Alert('登录成功')
            })
            .catch(function(err) {
                //AlertService.Alert(err)
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

.controller('ApplyCtrl', function($scope, $rootScope, $state, DataService, AlertService) {
    $scope.data = {
        money: 0
    };

    $scope.apply = function() {
        console.log(123)
        var money = $scope.data.money;
        var min = $rootScope.config.key3[0];
        var time = $rootScope.config.key3[1];
        if(money < min) return AlertService.Alert('提现金额不可小于' + min + '元。');
		else if(money % time != 0) return AlertService.Alert('提现金额必须是' + time + '的倍数。');
        else DataService.Apply($scope.data.money).then(function(data){
            AlertService.Alert('收获成功，等待匹配、打款')
            $rootScope.member.lastApply = data.data;
            DataService.reloadAppData();
            $state.go('app.applydetail',{id: data.data.id})
        });
    };

})

.controller('ApplyDetailCtrl',function($scope,$state,$stateParams, $rootScope, 
                                        AlertService, DataService,config,Utils){
    $scope.apply = {};
    $scope.pairs = [];
    $scope.mark = 0;

    var id = $stateParams.id;
    
    loadData();

    function loadData(){
        DataService.ApplyDetail(id).then(function(data){
            $scope.apply = data.data.apply;
            $scope.pairs = data.data.pairs;
            $scope.progress = (function(){
                var state = $scope.apply.state;
                if(state < 100) return state * 10;
                else return 100;
            })();
            _.each($scope.pairs,function(item){
                item.remainTime = remainTime(item.pay_time, 0);//收款倒计时
                item.remainTime2 = remainTime(item.the_time, 1);//打款倒计时
                if(item.img) item.img = config.domain +  'images/payment/' + item.img;
            });
        });
    }

    $scope.judge = function(item,judge){
        DataService.Judge(item.id, judge).then(function(x){
            if(x.isSuccess){
                var msg = judge == 1 ? "仲裁成功，系统正在处理..." : '取消仲裁成功，系统正在处理...';
                AlertService.Alert(msg);
                item.judge = judge;
            } else AlertService.Alert(x.error.message);
        })
    };

    $scope.payIn = function(item){
        DataService.PayIn(item.id).then(function(x){
            if(x.isSuccess){
                DataService.reloadAppData();
                AlertService.Alert('确认收款成功，系统正在处理...');
                item.state = 4;  //from 3
            }
            else AlertService.Alert(x.error.message)
        });
    };

    $scope.remark = function(item){
        DataService.Remark(item.id, $scope.remark).then(function(data){
            if(data.isSuccess) AlertService.Alert('success');
        });
    };

    function remainTime(start, flag){
        if(!$rootScope.config || !start) return Utils.duration(0);
        var cfg = flag  ? $rootScope.config.key12 : $rootScope.config.key13;
        var time =  cfg * 60 * 60  - moment().diff(moment.unix(start),'seconds');
        return Utils.duration(time);
    }

})

.controller('OfferCtrl', function($scope, $rootScope, $state, AlertService, DataService) {
    $scope.data = {
        money: 1000,
        isChecked: false,
        first : true
    };

    DataService.IsNewMember().then(function(data){
        if(data.isSuccess){
            $scope.data.first = data.data;
        }else {
            AlertService.Alert(data.error.message);
        }
    });

    $scope.offer = function() {
        console.log($scope.data.money)
        if ($scope.data.isChecked) {
            DataService.Offer($scope.data.money).then(function(data) {
                console.log(data)
                $rootScope.member.lastOffer = data.data;
                DataService.reloadAppData();
                $state.go('app.offerdetail',{id: data.data.id})
            });
        }
        else {
            AlertService.Alert("请先阅读平台提示!");
        }
    }

    $scope.select = function(money) {
        $scope.data.money = money
    }
})

.controller('OfferDetailCtrl',function($scope, $state, $stateParams, $rootScope, 
                                        $cordovaCamera, $cordovaFileTransfer, AlertService, 
                                        DataService, config,Utils){
    $scope.offer = {};
    $scope.pairs = [];
    var id = $stateParams.id;

    loadData();

    function loadData(){
        DataService.OfferDetail(id).then(function(data){
            console.log(data)
            $scope.offer = data.data.offer;
            $scope.pairs = data.data.pairs;
            $scope.progress = (function(){
                var state = $scope.offer.state;
                if(state < 100) return state * 10;
                else return 100;
            })();
            $scope.offer.interest =(function(){
                var cfg = $rootScope.config;
                if($scope.offer.fst == 0) return cfg.key6 *cfg.key24*$scope.offer.money;
                else return 0;
            })();
            _.each($scope.pairs,function(item,i){
                item.remainTime = remainTime(item);
                if(item.img) item.img =config.domain +  'images/payment/' + item.img;
                //item.aboutIncome = DataService.Capital.about(item);
            });
        });
    }

    function uploadImage(item, fn) {
        if (!item.img)
            return AlertService.Alert("还没有提供打款凭证");

        var server = config.host + "pair/payment/mobile/upload";
        var filePath = item.img;

        var ext = item.img.substr(item.img.lastIndexOf('/'));
        var filename = item.id + "_" + moment().format('YYYYMMDDhhmmss') + '.' + ext;

        var options = new FileUploadOptions();

        options.fileKey = "image_file";
        options.fileName = filename;
        options.mimeType = "text/plain";

        $cordovaFileTransfer.upload(server, filePath, options)
            .then(function (result) {
                AlertService.Alert("上传图片成功.");
                fn(true, result.response.data)
            }, function (err) {
                AlertService.Alert("上传图片失败.");
                fn(false)
            }, function (progress) {
            });
    }
    
    function remainTime(item){
        if(!$rootScope.config) return 0;
        var cfg12 = $rootScope.config.key12;
        var time =  cfg12 * 60 * 60 -  moment().diff(moment.unix(item.the_time),'seconds');
        return Utils.duration(time);
    }

    $scope.payOut = function(item){
        //alert('payout')
        uploadImage(item, function(r, data) {
            if (r) {
                DataService.PayOut(item.id, data).then(function(data) {
                    DataService.reloadAppData();
                    AlertService.Alert('打款成功');
                    //update state
                    item.state = 3;
                })
            }
        })
    };

    $scope.selectImage = function(item) {
        console.log(item)
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        }

        $cordovaCamera.getPicture(options).then(function (imageURI) {
            window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                item.img = fileEntry.toURL();
                $scope.$apply();
            });
        }, function (err) {
            AlertService.Alert("拍照出错.");
        });
    }

    $scope.takeImage = function (item) {
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
                item.img = fileEntry.toURL();
                $scope.$apply();
            });
        }, function (err) {
            AlertService.Alert("拍照出错.");
        });
    };    

    $scope.denyPay = function(item){
        AlertService.Confirm('您确定要拒绝打款，拒绝后系统将冻结您的账号','',function(){
            DataService.DenyPay(item.id).then(function(data){
                if(data.isSuccess){
                    AlertService.Alert('您已拒绝打款,系统正在处理...');
                    loadData();
                } else {
                    AlertService.Alert(data.error.message);
                }
            });
        }, function(){
        });
    };
})

.controller('SettingsCtrl', function($scope, $state, config) {
    $scope.signout = function() {
        localStorage.removeItem("memberid")
        $state.go('signin')
    }
})

.controller('NewsCtrl',function($scope,$state,DataService,config,AlertService){
    $scope.model = [];
    DataService.News(0).then(function(data){
        if(data.isSuccess){
            $scope.model = data.data.rows;
        } else {
            AlertService.Alert(data.error.message)
        }
    }).catch(function(err){
        console.log(err)
    });
})

.controller('NewsDetailCtrl',function($scope,$state,$stateParams,DataService,config){
    $scope.model = {};
    var id = $stateParams.id;
    DataService.NewsSingle(id).then(function(data){
        $scope.model = data.data;
        $scope.model.content = htmlDecode(data.data.content);
    }).catch(function(err){
        console.log(err);
    });
})

.controller('MessageCtrl',function($scope,$state,DataService,config){
    $scope.messages = [];
    DataService.Messages(0).then(function(data){
        $scope.messages = data.data.rows;
    });
})

.controller('MessageDetailCtrl',function($scope,$state,$stateParams,DataService,config){
    $scope.model = {};
    var id = $stateParams.id;
    DataService.MessageSingle(id).then(function(data){
        $scope.model = data.data;
    });
})

.controller('InfoCtrl',function($scope,$rootScope,$state,$stateParams,
                                DataService,config,banks,AlertService){
    var member = $rootScope.member;
    var id = member.id;
    $scope.info = {};
    $scope.banks = banks;
    $scope.saveInfo = saveInfo;

    loadInfo();

    function loadInfo(){
        DataService.MemberByID(id).then(function(data){
            if(data.isSuccess) _.extend($scope.info,data.data);
        });
        DataService.MemberByID(member.parent_id).then(function(data){
            if(data.isSuccess){
                var d = data.data;
                 _.extend($scope.info,{referName : d.truename,referMobile:d.mobile});
            }
        });
    }

    function saveInfo(){
        var data = angular.copy($scope.info);
        if(_.isEmpty(data.pay_pwd)) return AlertService.Alert('请填写安全密码');
        DataService.EditMemberInfo(data).then(function(data){
            if(data.isSuccess) AlertService.Alert('资料保存成功');
            else AlertService.Alert(data.error.message);
        });
    }

})
