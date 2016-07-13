angular.module('starter.services',[])

    .service("LocalData", function ($rootScope) {
    })

    .service('DataService', function ($http, $q, $rootScope, LoadingService, LocalData, AlertService, config) {

        var service  = this;
        var self = this;

        function _PrefixIndexData(data){
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
                m.teamScope = data.teamScope;
                m.moneyApply = data.moneyApply || 0;
                m.bonusFreeze = data.bonusFreeze || 0;
                m.moneyFreeze = data.moneyFreeze || 0;
                m.lastOffer = data.lastOffer;
                m.lastApply = data.lastApply;
                return m;
            })();

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
                headers: {
                    'Content-Type': 'application/json',
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

        function MemberId(){
            var id = localStorage.getItem(config.loginkey);
            return parseInt(id);
        }

        service.loadAppData = function(){
            var deferred = $q.defer();
            var memberid = localStorage.getItem(config.loginkey);
            console.log('//////memberid from localstorage//',memberid,config.loginkey);
            if (!_.isUndefined(memberid) && !_.isNull(memberid) && memberid !== 'undefined') {
                HTTP_GET(_Combine('index/info/', memberid)).then(function(data) {
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
        }

        //资产计算
        service.Capital = {
            sum: function(){
                var member = $rootScope.member;
                return member.money + member.moneyFreeze;
            },
            bonus: function(){
                var member = $rootScope.member;
                return member.bonus + member.bonusFreeze
            },
            total: function(){
                var member = $rootScope.member;
                return 	member.money + member.interest +
                        member.bonus + member.moneyFreeze +
                        member.bonusFreeze
            },
            frozen: function(){
                var member = $rootScope.member;
                return member.moneyFreeze + member.bonusFreeze
            },
            available: function(){
                var member = $rootScope.member;
                return 	member.money + member.interest +
                        member.bonus - member.moneyApply
            },
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
            return HTTP_GET(_Combine('messages/page/',MemberId(),'/', page));
        };

        service.MessageSingle = function(id){
            return HTTP_GET(_Combine('message/',id));
        };

        service.MessageReplies = function(){
            return HTTP_GET(_Combine('messages/reply/', MemberId()));
        };

        service.PostMsg = function(model){
            model.member_id = MemberId();
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
            var model = {money : money, memberid: MemberId()}
            return HTTP_POST(_Combine('offer/member'), model)
        };
        service.Apply = function(money){
            var model = { memberid: MemberId(), money:money }
            return HTTP_POST(_Combine('apply/member'), model)
        };
        service.TeamScope = function(id){
            return HTTP_GET(_Combine('member/children/amount/',id));
        };
        service.IncomeRecords = function(type, page){
            //type  =  money or  interest or bonus
            return HTTP_GET(_Combine('income/',type,'/', MemberId(), '/', page))
        };
        service.DealRecords = function(type,page){
            // type = offers or applys or pairs/failed
            return HTTP_GET(_Combine(type,'/', MemberId()))
        };
        service.IsNewMember = function(){
            return HTTP_GET(_Combine('member/check/new/', MemberId()))
        };
        service.OfferDetail = function(id){
            var model = {offerid : id, memberid: MemberId()}
            return HTTP_POST(_Combine('offer/detail'),model)
        };
        service.ApplyDetail = function(id){
            var model = {applyid : id, memberid : MemberId()}
            return HTTP_POST(_Combine('apply/detail'),model)
        };
        service.Freeze = function(){
        };
        service.DenyPay = function(){
            //pair/payment/deny/:memberid
            return HTTP_GET(_Combine('pair/payment/deny/', MemberId()))
        };
        service.PayOut = function(pairid, imgurl){
            return HTTP_POST(_Combine('pair/payment/out'), {memberid: MemberId(), imgurl:imgurl, oaid: pairid})
        };
        service.PayIn = function(pairid){
            //pair/payment/in
            var model = {
                memberid : MemberId(),
                oaid : pairid
            };
            return HTTP_POST(_Combine('pair/payment/in'), model);
        };
        service.Judge = function(pairid,judge){
            //pairs/judge
            //0为正常，1为仲裁状态，2为被驳回
            var model = {
                oaid  : pairid,
                judge  :judge,
                memberid : MemberId()
            };
            return HTTP_POST(_Combine('pairs/judge'), model);
        };
        service.Remark = function(pairid,remark){
            //pairs/remark
            var model = {
                oaid : pairid,
                remark : remark,
                memberid : MemberId()
            };
            return HTTP_POST(_Combine('pairs/remark'), model);
        };

    })

    .service('AlertService', function ($ionicPopup) {
        var service = {};

        service.Confirm = function (title, content, fnOK, fnCancel) {
            $ionicPopup.confirm({
                title: title,
                template: content,
                cssClass : '',
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
        service.Alert = function (title, content, fn) {
            $ionicPopup.alert({
                title: title,
                template: content,
                okType : 'button-balanced',
                okText : '确定'
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