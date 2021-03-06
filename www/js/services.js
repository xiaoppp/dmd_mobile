angular.module('starter.services',[])

    .service("LocalData", function ($rootScope) {
    })

    .service('DataService', function ($http, $q, $rootScope, LoadingService, LocalData, AlertService, config, Auth) {

        var self = this;
        var service = this;

        function _PrefixIndexData(data){
            //config
            $rootScope.config = (function(){
                var cfg = {};
                _.each(data.config, function(item,i){
                    var id = item.id;
                    var t = item.val;
                    if(/-/.test(t)){
                        t = t.split('-');
                        _.each(t, function(v, i){
                            if(/\./.test(v)) t[i] = parseFloat(v);
                            else t[i] = parseInt(v);
                        });
                    } else {
                        if(/\./.test(t)) t = parseFloat(t);
                        else t = parseInt(t);
                    }
                    cfg['key' + id] = t;
                });
                return cfg;
            })();

            $rootScope.member = (function(){
                var m = data.member;
                m.showNews = data.showNews;
                m.teamScope = data.teamScope || 0;
                m.moneyApply = data.moneyApply || 0;
                m.bonusFreeze = data.bonusFreeze || 0;
                m.moneyFreeze = data.moneyFreeze || 0;
                m.lastOffer = data.lastOffer;
                m.lastApply = data.lastApply;
                return m;
            })();

            _CalculateCapital();
        }

        function _CalculateCapital(){
            var o = {
                    sum       :  self.Capital.sum(),
                    bonus     :  self.Capital.bonus(),
                    total     :  self.Capital.total(),
                    frozen    :  self.Capital.frozen(),
                    available :  self.Capital.available(),
                    about     :  self.Capital.about()
            };
            $rootScope.member.capital = o;
        }

        function HTTP_GET(url, showLoading) {
            if (_.isUndefined(showLoading) || _.isNull(showLoading)) {
                showLoading = true;
            }

            if (showLoading)
                LoadingService.Show();

            var deferred = $q.defer();

            console.log('http get---------------------->', url);

            var req = {
                method: 'GET',
                url: url,
                timeout: 1000 * 20,
                headers: {
                    'x-access-token': Auth.current()
                },
            };

            $http(req)
                .success(function (data, status, headers, config) {
                    console.log(data);
                    deferred.resolve(data);
                    if(showLoading) LoadingService.Hide();
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                    if(showLoading) LoadingService.Hide();
                    AlertService.Alert("网络不稳定，请稍后在试。");
                });

            return deferred.promise;
        }

        function HTTP_POST (url, params, showLoading) {
            if (_.isUndefined(showLoading) || _.isNull(showLoading)) {
                showLoading = true;
            }

            if(showLoading)
                LoadingService.Show();

            var deferred = $q.defer();

            console.log('---------------------->', url);

            var req = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                     'x-access-token': Auth.current()
                },
                data: params,
                timeout: 1000 * 20
            };
            $http(req).
                success(function (data, status, headers, config) {
                    //console.log(req);
                    if (data.isSuccess)
                        deferred.resolve(data);
                    else {
                        AlertService.Alert(data.error.message)
                    }
                    if (showLoading) LoadingService.Hide();
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(data);
                    if (showLoading) LoadingService.Hide();
                    AlertService.Alert("网络不稳定，请稍后在试。");
                });
            return deferred.promise;
        }

        function _Combine(){
            var len = arguments.length;
            var raw = config.host;
            for(var i=0; i < len; i++)
                raw += arguments[i];
            return raw;
        }

        //载入应用数据
        service.loadAppData = function(){
            var deferred = $q.defer();
            if (Auth.has()) {
                HTTP_GET(_Combine('index/info')).then(function(data) {
                            if(data.isSuccess){
                                //初始化加载首页数据，如果没有登录，则login的时候加载，如果有数据，则服务自动加载
                                _PrefixIndexData(data.data);
                                deferred.resolve('completed');
                            } else {
                                //error page
                                deferred.reject('error');
                            }
                        });
            }
            return deferred.promise;   
        };

        //刷新应用数据
        service.reloadAppData = function(){
            //index/refresh/:memberid
            HTTP_GET(_Combine('index/refresh')).then(function(data){
                if(data.isSuccess){
                    var d = data.data;
                    $rootScope.member.moneyApply = d.moneyApply || 0;
                    $rootScope.member.bonusFreeze = d.bonusFreeze || 0;
                    $rootScope.member.moneyFreeze = d.moneyFreeze || 0;
                    $rootScope.member.money = d.member.money;
                    $rootScope.member.interest = d.member.interest;
                    $rootScope.member.bonus = d.member.bonus;
                    _CalculateCapital();
                } else {
                    AlertService.Alert(data.error.message);
                }
            }).catch(function(err){
                AlertService.Alert(err);
            });
        };

        //资产计算
        service.Capital = {
            //本金总额
            sum: function(){
                var member = $rootScope.member;
                return member.money + member.moneyFreeze;
            },
            //奖励总额
            bonus: function(){
                var member = $rootScope.member;
                return member.bonus + member.bonusFreeze;
            },
            //总资产
            total: function(){
                var member = $rootScope.member;
                return 	member.money + member.interest +
                        member.bonus + member.moneyFreeze +
                        member.bonusFreeze;
            },
            //全部冻结资产
            frozen: function(){
                var member = $rootScope.member;
                return member.moneyFreeze + member.bonusFreeze;
            },
            //可提现资产
            available: function(){
                var member = $rootScope.member;
                return 	member.money + member.interest +
                        member.bonus - member.moneyApply;
            },
            //预计收益
            about: function(){
                var member = $rootScope.member;
                var config = $rootScope.config;
                var offer = arguments[0] || member.lastOffer;
                if(!offer) return 0;
                if(offer && offer.fst)
                    return offer.money * config.key6 * config.key24;
                else return 0;
            },
        };

        service.Login = function(model){
            var deferred = $q.defer();
            console.log('///login data:',model);
            HTTP_POST(_Combine('member/signin'), model, true).then(function(data){
                if (data.isSuccess){
                    Auth.set(data.data.token);
                    deferred.resolve(data);
                } else {
                    deferred.reject(data.error.message);
                }
            }).catch(function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        };

        service.News = function(page){
            return HTTP_GET(_Combine('news/page/', page));
        };

        service.NewsSingle = function(id){
            return HTTP_GET(_Combine('news/',id));
        };

        service.Messages = function(page){
            return HTTP_GET(_Combine('messages/page/', page));
        };

        service.MessageSingle = function(id){
            return HTTP_GET(_Combine('message/',id));
        };

        service.MessageReplies = function(){
            return HTTP_GET(_Combine('messages/reply'));
        };

        service.PostMsg = function(model){
            model.to_member_id = 0;
            model.state = 0;
            return HTTP_POST(_Combine('message/action/leavemsg'), model);
        };

        service.Member = function(username){
            return HTTP_GET(_Combine('member/',username));
        };

        service.MemberByID = function(id){
            return HTTP_GET(_Combine('member/info/',id));
        };

        service.EditMemberInfo = function(model){
            return HTTP_POST(_Combine('member/edit/info'), model);
        };

        service.EditPwd = function(model){
            return HTTP_POST(_Combine('member/reset'), model);
        };

        service.EditPayPwd = function(model,mode){
            //mode //  0 通过原始安全密码,  1 通过手机验证码
        };

        service.TeamTree = function(id){
            //member/children
            return HTTP_GET(_Combine('member/children/',id));
        };

        service.Offer = function(money){
            var model = {money : money}
            return HTTP_POST(_Combine('offer/member'), model)
        };

        service.Apply = function(money){
            var model = { money:money }
            return HTTP_POST(_Combine('apply/member'), model)
        };

        service.TeamScope = function(id){
            return HTTP_GET(_Combine('member/children/amount/',id));
        };

        service.IncomeRecords = function(type, page){
            //type  =  money or  interest or bonus
            return HTTP_GET(_Combine('income/',type,'/', page))
        };

        service.DealRecords = function(type,page){
            // type = offers or applys or pairs/failed
            return HTTP_GET(_Combine(type))
        };

        service.IsNewMember = function(){
            return HTTP_GET(_Combine('member/check/new'))
        };

        service.OfferDetail = function(id){
            var model = {offerid : id}
            return HTTP_POST(_Combine('offer/detail'),model)
        };

        service.ApplyDetail = function(id){
            var model = {applyid : id}
            return HTTP_POST(_Combine('apply/detail'), model)
        };

        service.Freeze = function(){
        };

        service.DenyPay = function(){
            //pair/payment/deny/:memberid
            return HTTP_GET(_Combine('pair/payment/deny'))
        };

        service.PayOut = function(pairid, imgurl){
            var model = {
                imgurl: imgurl,
                oaid:  pairid
            };
            return HTTP_POST(_Combine('pair/payment/out'), model)
        };

        service.PayIn = function(pairid){
            //pair/payment/in
            var model = {
                oaid : pairid
            };
            return HTTP_POST(_Combine('pair/payment/in'), model);
        };

        service.Judge = function(pairid,judge){
            //pairs/judge
            //0为正常，1为仲裁状态，2为被驳回
            var model = {
                oaid  : pairid,
                judge : judge
            };
            return HTTP_POST(_Combine('pairs/judge'), model);
        };

        service.Remark = function(pairid,remark){
            //pairs/remark
            var model = {
                oaid : pairid,
                remark : remark
            };
            return HTTP_POST(_Combine('pairs/remark'), model);
        };

    })

    .service('AlertService', function ($ionicPopup,$ionicModal, $q, $rootScope) {
        var service = {};

        service.Confirm = function (content, title, fnOK, fnCancel) {
            $ionicPopup.confirm({
                title: title || "确认",
                template: _pipe(content),
                okType : 'button-balanced',
                okText : '确定',
                cancelType : 'button-light',
                cancelText : '取消'
            }).then(function (res) {
                if (res) {
                    if (fnOK != null)
                        fnOK();
                } else {
                    if (fnCancel != null)
                        fnCancel();
                }
            });
        };

        service.Alert = function (content,title, fn) {
            $ionicPopup.alert({
                title: title || '提示',
                template: _pipe(content),
                okType : 'button-balanced',
                okText : '确定'
            }).then(function (res) {
                if (fn != null)
                    fn(res);
            });
        };

        service.ShowBigImage = function(url,scope){
            var modal = $ionicModal.fromTemplate(
                '<ion-modal-view ng-click="close();"><ion-content><div style="width:98%;margin:100px auto;"><img style="width:100%;" src="' + url + '"></div></ion-content></ion-modal-view>', 
                {
                    scope: scope || $rootScope, 
                    animation: 'slide-in-up',
                    backdropClickToClose : true
                }
            );
            modal.scope.close = function(){
                modal.remove();
            };
            modal.show();
            return modal;
        }

        function _pipe(msg){
            if(typeof msg !=='string'){
                if(msg && typeof msg.message === 'string') return msg.message;
                console.log('alert message:', msg);
                return '服务出错，请稍后再试';
            }
            return msg;
        }

        return service;
    })

    .service('LoadingService', function ($rootScope, $ionicLoading) {
        var service = {
            Show: function (content) {
                content = content || '数据加载中';
                // Show the loading overlay and text
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles" class="spinner-balanced"></ion-spinner>' + content
                });
            },
            Hide: function () {
                $ionicLoading.hide();
            }
        };
        return service;
    })

    .service('Utils', function(){
        var self = this;

        self.duration = duration;

        function paddingLeft(n,m,l){
            var sn =  n.toString();
            var prefix = '';
            var len = l -sn.length;
            for(var i = 0; i < len; i++) prefix += m;
            sn = prefix + sn;
            return sn;
        }

        function duration(time){
            var t = parseInt(time);
            if(t < 0) return '00 : 00 : 00';
            else if(t < 60) return "00 : " + paddingLeft(t,'0',2);
            else if(t < 60 * 60) {
                var m = Math.floor(t / 60);
                var s = t % 60;
                return paddingLeft(m,'0',2) + ' : ' + paddingLeft(s,'0',2);
            } else {
                var h = Math.floor(t / 3600);
                var m = Math.floor((t % 3600)/60);
                var s = (t % 3600) % 60;
                return paddingLeft(h,'0',2) + ' : ' + paddingLeft(m,'0',2) + ' : ' + paddingLeft(s,'0',2);
            }
        }
    })

    .service('Auth', function(config){
        var self = this;

        self._value = '';

        self.current = function(){
            var value = localStorage.getItem(config.loginkey);
            if(!value) return false;
            self._value = value;
            return self._value;
        };

        self.empty = function(){
            localStorage.removeItem(config.loginkey);
            self._value = '';
            return true;
        };

        self.has = function(){
            var value  = localStorage.getItem(config.loginkey);
            return !_.isUndefined(value) && !_.isNull(value) && value !== 'undefined';
        };

        self.set = function(value){
            localStorage.setItem(config.loginkey, value);
            return true;
        };
    })

    .service('Photo', function($cordovaCamera, $cordovaFileTransfer, $q, AlertService, config, Auth, LoadingService){
        var self = this;

        self.api = "";

        self.setApi = function(api){
            if(_.isEmpty(api)) self.api = 'common/mobile/upload';
            else self.api = api;
        };
        
        self.takeImage = function($scope){
            var deferred = $q.defer();
            var options = {
                quality: 40,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                correctOrientation: true,
                encodingType: Camera.EncodingType.JPEG,
                allowEdit: false,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                    var url =  fileEntry.toURL();
                    if($scope)$scope.$apply();
                    deferred.resolve(url);
                });
            }, function (err) {
                deferred.reject(err);
                AlertService.Alert("拍照出错.");
            });

            return deferred.promise;
        };

        self.selectImage = function($scope){
            var deferred = $q.defer();

            var options = {
                quality: 40,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG
            };

            $cordovaCamera.getPicture(options).then(function (imageURI) {
                window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                    var url = fileEntry.toURL();
                    if($scope)$scope.$apply();
                    deferred.resolve(url);
                });
            }, function (err) {
                deferred.reject(err);
                AlertService.Alert("选择图片出错.");
            });
            return deferred.promise;
        };

        self.upload = function(url, prefix){
            
            var deferred = $q.defer();

            if (!url){
                deferred.reject('no url provided');
            }

            var server = config.host + self.api;
            var filePath = url;
            
            //var ext = url.substr(url.lastIndexOf('/'));
            prefix = prefix || 'dmd';
            var filename = prefix + "_" + moment().format('YYYYMMDDhhmmss') + ".jpg";

            var options = new FileUploadOptions();
            options.fileKey = "image_file";
            options.fileName = filename;
            options.mimeType = "image/jpeg";
            var headers = {};
            headers['x-access-token'] =  Auth.current()
            options.headers = headers;
            
            LoadingService.Show('图片上传中...');
            
            $cordovaFileTransfer.upload(server, filePath, options)
                .then(function (result) {
                    AlertService.Alert("上传图片成功.");
                    LoadingService.Hide();
                    deferred.resolve({
                        result : result,  //response from server
                        filename : filename //filename generated on local.
                    });
                }, function (err) {
                    alert(JSON.stringify(err));//test
                    AlertService.Alert("上传图片失败.");
                    LoadingService.Hide();
                    deferred.reject(err);
                }, function (progress) {
                });

            return deferred.promise;
        };

        self.setApi();

    })