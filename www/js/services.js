// angular.module('starter.services')
//     .service('DataService', function ($http, $q, LoadingService, AlertService, config) {
//
//         // function HTTP_GET(url, ishowLoading) {
//         //     if (_.isUndefined(showLoading) || _.isNull(showLoading)) {
//         //         showLoading = true;
//         //     }
//         //
//         //     if (showLoading)
//         //         LoadingService.Show();
//         //
//         //     var deferred = $q.defer();
//         //
//         //     console.log('---------------------->', url);
//         //
//         //     var req = {
//         //         method: 'GET',
//         //         url: url,
//         //         timeout: 1000 * 20
//         //     };
//         //
//         //     $http(req)
//         //         .success(function (data, status, headers, config) {
//         //             console.log(data);
//         //             deferred.resolve(data);
//         //             LoadingService.Hide();
//         //         })
//         //         .error(function (data, status, headers, config) {
//         //             deferred.reject(data);
//         //             LoadingService.Hide();
//         //             AlertService.Alert("网络不稳定，请稍后在试。");
//         //         });
//         //
//         //     return deferred.promise;
//         // }
//         //
//         // function HTTP_POST (url, params, show_loading) {
//         //     var _show_loading = (typeof(show_loading) == "undefined") ? true : show_loading;
//         //     if (_show_loading)
//         //         LoadingService.Show();
//         //
//         //     var deferred = $q.defer();
//         //
//         //     url = backendURL + url;
//         //     console.log('---------------------->', url);
//         //
//         //     var req = {
//         //         method: 'POST',
//         //         url: url,
//         //         headers: {'Content-Type': 'application/json'},
//         //         data: qarams,
//         //         timeout: 1000 * 20
//         //     };
//         //     $http(req).
//         //         success(function (data, status, headers, config) {
//         //             console.log(req);
//         //             deferred.resolve(data);
//         //             if (_show_loading) LoadingService.Hide();
//         //         }).
//         //         error(function (data, status, headers, config) {
//         //             deferred.reject(data);
//         //             if (_show_loading) LoadingService.Hide();
//         //             AlertService.Alert("网络不稳定，请稍后在试。");
//         //         });
//         //
//         //     return deferred.promise;
//         // }
//         //
//         // function _Combine(){
//         //     var len = arguments.length;
//         //     if(len === 0) throw 'no parts provided';
//         //     else {
//         //         let raw = config.host;
//         //         for(let i=0; i < len; i++){
//         //             raw += arguments[i];
//         //         }
//         //         return raw;
//         //     }
//         // }
//
//         var service = {};
//         //
//         // service.News = function(page){
//         //     return HTTP_GET(_Combine('news/page/', page));
//         // }
//         // service.NewsSingle = function(id){
//         //     return HTTP_GET(_Combine('news/',id));
//         // }
//         // service.Messages = function(page){
//         //     var who = GET_MEMBER_LOGIN_INFO();
//         //     return HTTP_GET(_Combine('messages/page/', who.memberid,'/', page));
//         // }
//         // service.MessageSingle = function(id){
//         //     return HTTP_GET(_Combine('message/',id));
//         // }
//         // service.MessageReplies = function(){
//         //     var who = GET_MEMBER_LOGIN_INFO();
//         //     return HTTP_GET(_Combine('messages/reply/',who.memberid));
//         // }
//         // service.PostMsg = function(model){
//         //     var who = GET_MEMBER_LOGIN_INFO();
//         //     model.member_id = who.memberid;
//         //     model.to_member_id = 0;
//         //     model.state = 0;
//         //     console.log(model);
//         //     return HTTP_POST(_Combine('message/action/leavemsg'), model);
//         // }
//         // service.Login = function(model){
//         //     console.log(model);
//         //     var deferred = Q.defer();
//         //     //config.ajaxRequireToken = false;
//         //     HTTP_POST(_Combine('member/signin'), model,true).then(function(data){
//         //         if (data.isSuccess){
//         //             window.localStorage.setItem(config.loginkey, JSON.stringify(data.data));
//         //             //config.ajaxRequireToken = true;
//         //         }
//         //         deferred.resolve(data);
//         //     }).catch(function(err){
//         //         deferred.reject(err);
//         //     });
//         //     return deferred.promise;
//         // }
//         // service.Member = function(username){
//         //     return HTTP_GET(_Combine('member/',username));
//         // }
//         // service.ParentMember = function(id){
//         //     return HTTP_GET(_Combine('member/info/',id));
//         // }
//         // service.IndexData = function(){
//         //     var who = GET_MEMBER_LOGIN_INFO();
//         //      return HTTP_GET(_Combine('index/info/', who.memberid));
//         // }
//         // service.EditMemberInfo = function(model){
//         //     return HTTP_POST(_Combine('member/edit/info'),model);
//         // }
//         // service.EditPwd = function(model){
//         //     return HTTP_POST(_Combine('member/reset'),model);
//         // }
//         // service.EditPayPwd = function(model,mode){
//         //     //mode //  0 通过原始安全密码,  1 通过手机验证码
//         // }
//         // service.TeamTree = function(id){
//         //     //member/children
//         //     return HTTP_GET(_Combine('member/children/',id));
//         // }
//         // service.Offer = function(money){
//         //     let who = GET_MEMBER_LOGIN_INFO()
//         //     let model = {money : money, memberid:who.memberid}
//         //     return HTTP_POST(_Combine('offer/member'), model)
//         // }
//         // service.Apply = function(money){
//         //     let who = GET_MEMBER_LOGIN_INFO()
//         //     let model = { memberid:who.memberid, money:money }
//         //     return HTTP_POST(_Combine('apply/member'), model)
//         // }
//         // service.TeamScope = function(id){
//         //     return HTTP_GET(_Combine('member/children/amount/',id));
//         // }
//         // service.IncomeRecords = function(type,page){
//         //     //type  =  money or  interest or bonus
//         //     let who = GET_MEMBER_INFO()
//         //     return HTTP_GET(_Combine('income/',type,'/',who.id,'/',page))
//         // }
//         // service.DealRecords = function(type,page){
//         //     // type = offers or applys or unmatches
//         //     let who = GET_MEMBER_INFO()
//         //     return HTTP_GET(_Combine(type,'/', who.id))
//         // }
//         // service.IsNewMember = function(){
//         //     let who = GET_MEMBER_INFO()
//         //     return HTTP_GET(_Combine('member/check/new/',who.id))
//         // }
//         // service.OfferDetail = function(id){
//         //     let who = GET_MEMBER_INFO()
//         //     let model = {offerid : id, memberid: who.id}
//         //     return HTTP_POST(_Combine('offer/detail'),model)
//         // }
//         // service.ApplyDetail = function(id){
//         //     let who = GET_MEMBER_INFO()
//         //     let model = {applyid : id, memberid : who.id}
//         //     return HTTP_POST(_Combine('apply/detail'),model)
//         // }
//
//         return service
//     })
//
//
//     .service('AlertService', function ($ionicPopup) {
//         var service = {};
//
//         service.Confirm = function (title, content, fnOK, fnCancel) {
//             $ionicPopup.confirm({
//                 title: title,
//                 template: content
//             }).then(function (res) {
//                 if (res) {
//                     if (fnOK != null)
//                         fnOK();
//                 } else {
//                     if (fnCancel != null)
//                         fnCancel();
//                 }
//             });
//         };
//         service.Alert = function (title, content, fn) {
//             $ionicPopup.alert({
//                 title: title,
//                 template: content
//             }).then(function (res) {
//                 if (fn != null)
//                     fn(res);
//             });
//         };
//
//         return service;
//     })
//
//     .service('LoadingService', function ($rootScope, $ionicLoading) {
//
//         var service = {
//             Show: function (content) {
//                 content = content || '数据加载中';
//
//                 // Show the loading overlay and text
//                 $ionicLoading.show({
//                     template: '<ion-spinner icon="bubbles" class="spinner-positive"></ion-spinner>' + content
//                 });
//             },
//             Hide: function () {
//                 $ionicLoading.hide();
//             }
//         };
//         return service;
//     });
