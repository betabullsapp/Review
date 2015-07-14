define(['bootstrap/module'], function(yoBootstrap) {
    'use strict';
    yoBootstrap.directive('yoTab', function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            require: '^yoTabGroup',
            template: '<div ng-show="active" ng-transclude></div>',
            scope: {
                url: '@yoUrl',
                name: '@',
                counter: '@yoCounter',
                id: '@',
                onSelect: '&yoOnSelect',
                tabClass: '@yoTabClass',
                active: '=?yoActive'
            },
            link: function($scope, $elem, $attrs, yoTabGroupCtrl) {
                if (!angular.isUndefined($attrs.yoDefault)) {
                    $scope.active = true;
                }

                $scope.$watch('active', function(active) {
                    if (active) {
                        yoTabGroupCtrl.select($scope);
                    }
                });
                
                yoTabGroupCtrl.addTab($scope);
            }
        };
    });
});
