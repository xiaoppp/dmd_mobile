angular.module('starter.directives', [])

    .directive("announcementDisplay", function ($ionicModal) {
        return {
            restrict: 'E',
            scope: true,
            template: "<img ng-show='hasImg' src = 'http://www.gjzga.gov.cn:8088{{announcement.ImageUrl}}' style='width:100%' ng-click = 'openModal(announcement.ImageUrl)'/><p ng-show='hasDes' ng-bind-html =announcement.Description></p>",
            link: function (scope, element, attrs) {
                var _scope = scope;

                scope.$watch('announcement',function(newValue,oldValue,scope){
                    scope.hasImg = !(newValue.ImageUrl=="");
                    scope.hasDes = !(newValue.Description=="");
                },true);

                $ionicModal.fromTemplateUrl('templates/imgModal.html', {
                    scope: _scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    scope.gridModal = modal;
                });
                scope.hide = [{
                    bars: true
                }];
                scope.openModal = function (imgSrc) {
                    scope.src = "http://www.gjzga.gov.cn:8088" + imgSrc;
                    scope.gridModal.show();
                };
                scope.closeModal = function () {
                    scope.gridModal.hide();
                    scope.hide.bars = false;
                };
            }
        }
    })

    .directive("stationDesc", function () {
        return {
            restrict: 'E',
            scope: true,
            link: function (scope, element, attr) {
                scope.$watch("MobileDescription", function (old, newvalue) {
                    if (scope.station.MobileDescription) {
                        element[0].innerText = scope.station.MobileDescription;
                    }
                })
            }
        }
    })

    .directive("yrRadio", function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: "<label class='yrRadio'><input type='radio' name={{name}} ng-model='modelValue' value='{{value}}'/><i ng-class=icon></i><span  ng-transclude></span></label>",
            scope: {
                name: '@name',
                value: '@value',
                checked: '@checked',
//                model:'=ngModel'
                modelValue: '=ngModel'
            },
            link: function (scope) {
                scope.modelValue = '';
                scope.modelValue = scope.checked ? scope.value : '';
                scope.icon = (scope.modelValue == scope.value) ? 'ion-android-radio-button-on ion' : 'ion-android-radio-button-off ion';
                scope.$watch('modelValue', function () {
                    scope.icon = (scope.modelValue == scope.value) ? 'ion-android-radio-button-on ion' : 'ion-android-radio-button-off ion';
                });
            }
        }
    });

