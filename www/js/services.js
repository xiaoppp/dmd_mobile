angular.module('starter.services',[])

    .service("LocalData", function ($rootScope) {
    })

    .service('DataService', function ($http, $q, $rootScope, LoadingService, LocalData, AlertService, config) {

        var member = {};

        (function init() {
            var memberid = localStorage.getItem('memberid')
            if (!_.isUndefined(memberid) && !_.isNull(memberid) && memberid !== 'undefined') {
                GetIndexData(memberid)
            }
        })();

        function PrefixIndexData(data){
            $rootScope.member = (function(){
                var m = data.member;
                m.showNews = data.showNews;
                m.teamScope = data.teamScope;
                m.moneyApply = data.moneyApply || 0;
                m.bonusFreeze = data.bonusFreeze || 0;
                m.moneyFreeze = data.moneyFreeze || 0;
                return m;
            })();

            $rootScope.config = (function(){
                var cfg = {};
                _.each(data.config, function(item,i){
                    var id = item.id;
                    var val = item.val;
                    if(/-/.test(t)){
                        t = t.split('-');
                        _.each(t, function(item, i){
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

            $rootScope.lastOffer = data.lastOffer;
            $rootScope.lastApply = data.lastApply;
        }

        //初始化加载首页数据，如果没有登录，则login的时候加载，如果有数据，则服务自动加载
        function GetIndexData(memberid) {
            HTTP_GET(_Combine('index/info/', memberid))
                .then(function(data) {
                    member = data.data.member
                    $rootScope.member = data.data.member
                    $rootScope.config = data.data.config

                })
        }

        function HTTP_GET(url,showLoading) {
            if (_.isUndefined(showLoading) || _.isNull(showLoading)) {
                showLoading = true;
            }

            if (showLoading)
                LoadingService.Show();

            var deferred = $q.defer();

            console.log('---------------------->', url);

            var req = {
                method: 'GET',
                url: url,
                timeout: 1000 * 20
            };

            $http(req)
                .success(function (data, status, headers, config) {
                    console.log(data);
                    deferred.resolve(data);
                    LoadingService.Hide();
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                    LoadingService.Hide();
                    AlertService.Alert("网络不稳定，请稍后在试。");
                });

            return deferred.promise;
        }

        function HTTP_POST (url, params, showLoading) {
            var _show_loading = (typeof(showLoading) == "undefined") ? true : showLoading;
            if (_show_loading)
                LoadingService.Show();

            var deferred = $q.defer();

            console.log('---------------------->', url);

            var req = {
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: params,
                timeout: 1000 * 20
            };
            $http(req).
                success(function (data, status, headers, config) {
                    //console.log(req);
                    deferred.resolve(data);
                    if (_show_loading) LoadingService.Hide();
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(data);
                    if (_show_loading) LoadingService.Hide();
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

        var service = {}

        service.Login = function(model){
            console.log(model);
            var deferred = $q.defer();
            HTTP_POST(_Combine('member/signin'), model,true).then(function(data){
                if (data.isSuccess){
                    localStorage.setItem("memberid", data.data.memberid)
                    deferred.resolve(data)
                    GetIndexData(data.data.memberid)
                }
                else {
                    deferred.reject(data.error.message)
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
            return HTTP_GET(_Combine('messages/page/', member.id,'/', page));
        };

        service.MessageSingle = function(id){
            return HTTP_GET(_Combine('message/',id));
        };

        service.MessageReplies = function(){
            return HTTP_GET(_Combine('messages/reply/',member.id));
        };

        service.PostMsg = function(model){
            model.member_id = member.id;
            model.to_member_id = 0;
            model.state = 0;
            console.log(model);
            return HTTP_POST(_Combine('message/action/leavemsg'), model);
        };

        service.Member = function(username){
            return HTTP_GET(_Combine('member/',username));
        };
        service.ParentMember = function(id){
            return HTTP_GET(_Combine('member/info/',id));
        };
        service.EditMemberInfo = function(model){
            return HTTP_POST(_Combine('member/edit/info'),model);
        };
        service.EditPwd = function(model){
            return HTTP_POST(_Combine('member/reset'),model);
        };
        service.EditPayPwd = function(model,mode){
            //mode //  0 通过原始安全密码,  1 通过手机验证码
        };
        service.TeamTree = function(id){
            //member/children
            return HTTP_GET(_Combine('member/children/',id));
        };
        service.Offer = function(money){
            var model = {money : money, memberid:member.id}
            return HTTP_POST(_Combine('offer/member'), model)
        };
        service.Apply = function(money){
            var model = { memberid:member.id, money:money }
            return HTTP_POST(_Combine('apply/member'), model)
        };
        service.TeamScope = function(id){
            return HTTP_GET(_Combine('member/children/amount/',id));
        };
        service.IncomeRecords = function(type, page){
            //type  =  money or  interest or bonus
            return HTTP_GET(_Combine('income/',type,'/',member.id,'/',page))
        };
        service.DealRecords = function(type,page){
            // type = offers or applys or unmatches
            return HTTP_GET(_Combine(type,'/', member.id))
        };
        service.IsNewMember = function(){
            return HTTP_GET(_Combine('member/check/new/',member.id))
        };
        service.OfferDetail = function(id){
            var model = {offerid : id, memberid: member.id}
            return HTTP_POST(_Combine('offer/detail'),model)
        };
        service.ApplyDetail = function(id){
            var model = {applyid : id, memberid : member.id}
            return HTTP_POST(_Combine('apply/detail'),model)
        };

        return service;
    })

    .service('AlertService', function ($ionicPopup) {
        var service = {};

        service.Confirm = function (title, content, fnOK, fnCancel) {
            $ionicPopup.confirm({
                title: title,
                template: content
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
        service.Alert = function (title, content, fn) {
            $ionicPopup.alert({
                title: title,
                template: content
            }).then(function (res) {
                if (fn != null)
                    fn(res);
            });
        };

        return service;
    })

    .service('LoadingService', function ($rootScope, $ionicLoading) {

        var service = {
            Show: function (content) {
                content = content || '数据加载中';

                // Show the loading overlay and text
                $ionicLoading.show({
                    template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>' + content
                });
            },
            Hide: function () {
                $ionicLoading.hide();
            }
        };
        return service;
    });
