angular.module('starter.directives', [])
    .directive('biggerOnceClick', function(AlertService) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs){
                var target = element[0];
                target.addEventListener('click', function(e) {
                    AlertService.ShowBigImage(target.getAttribute('src'),$scope);
                });
            }
        };
    })