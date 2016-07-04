angular.module('starter.services', [])

    .service("LocalData", function ($rootScope) {

        var service = {
			department: null
        };

        service.setStationId = function (stationId) {
            service.stationId = stationId;
            localStorage.setItem("stationId", stationId);

            $rootScope.$broadcast("StationChanged");
        };

        (function init() {
            var stationId = localStorage.getItem("stationId");
            if (stationId)
                service.stationId = angular.fromJson(stationId);
        })();

        return service;
    })

    .service('DataService', function ($http, $q, LoadingService, LocalData, AlertService) {
        var backendURL = "http://192.168.1.103/api/";

        var querystring = function (obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };

        var getResource = function (url, ishowLoading) {
            if (_.isUndefined(showLoading) || _.isNull(showLoading)) {
                showLoading = true;
            }

            if (showLoading)
                LoadingService.Show();

            var deferred = $q.defer();

            url = backendURL + url
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
                    if (isCache) {
                        localStorage.setItem(cacheName, angular.toJson(data));
                    }
                    LoadingService.Hide();
                })
                .error(function (data, status, headers, config) {
                    deferred.reject(data);
                    LoadingService.Hide();
                    AlertService.Alert("网络不稳定，请稍后在试。");
                });

            return deferred.promise;
        };

        var postResource = function (url, params, show_loading) {
            var _show_loading = (typeof(show_loading) == "undefined") ? true : show_loading;
            if (_show_loading)
                LoadingService.Show();

            var deferred = $q.defer();

            url = backendURL + url;
            console.log('---------------------->', url);

            var req = {
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/json'},
                data: qarams,
                timeout: 1000 * 20
            };
            $http(req).
                success(function (data, status, headers, config) {
                    console.log(req);
                    deferred.resolve(data);
                    if (_show_loading) LoadingService.Hide();
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(data);
                    if (_show_loading) LoadingService.Hide();
                    AlertService.Alert("网络不稳定，请稍后在试。");
                });

            return deferred.promise;
        };

        var login = function() {
            
        }

        var member = function(username) {
            return getResource('member/', username);
        }

		(function init() {

		})()

        return {

        }
    })

    .service('MapService', function ($q, $timeout, $window) {
        var getMap = function () {
            var deferred = $q.defer();

            var timeoutPromise = $timeout(function () {
                deferred.reject("地图超时，请重试"); //aborts the request when timed out
                console.log("Timed out");
            }, 10000);

            if (typeof window.qq !== 'undefined' && typeof window.qq.maps !== 'undefined') {
                console.log("cancel timeout");
                $timeout.cancel(timeoutPromise); // here we cancel $timeout
                deferred.resolve(window.qq.maps);
                return deferred.promise;
            }

            $window['mapcb'] = function () {
                $window['mapcb'] = null;
                console.log("cancel timeout");
                $timeout.cancel(timeoutPromise); // here we cancel $timeout
                deferred.resolve(window.qq.maps);
            };

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://map.qq.com/api/js?v=2.exp&key=WFFBZ-TQJH3-Q5C3P-3MD5Y-VT635-Q5FG4&callback=mapcb&libraries=drawing,geometry,autocomplete,convertor";
            try {
                document.body.appendChild(script);
            }
            catch (err) {
                deferred.reject(err);
            }

            return deferred.promise;

        };

        return {getMap: getMap};
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
