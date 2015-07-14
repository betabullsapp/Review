define([
    'listing/module'
], function (listing) {
    return listing
        .constant('starRatingConfig', {
            max: 5,
            stateOn: null,
            stateOff: null
        })
        .controller('starRatingDirectiveController', ['$scope', '$attrs', 'starRatingConfig', function ($scope, $attrs, ratingConfig) {
            var ngModelCtrl = { $setViewValue: angular.noop };

            this.init = function(ngModelCtrl_) {
                ngModelCtrl = ngModelCtrl_;
                ngModelCtrl.$render = this.render;

                this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
                this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

                var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
                    new Array( angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max );
                $scope.range = this.buildTemplateObjects(ratingStates);

                ngModelCtrl.$setViewValue(0);
                $scope.helperText = helperTexts[0];
                $scope.rating = null;
            };

            var helperTexts = {
                0: 'Unrated',
                1: 'It was terrible',
                2: 'It was bad',
                3: 'It was OK',
                4: 'It was good',
                5: 'It was great'
            };

            this.buildTemplateObjects = function(states) {
                for (var i = 0, n = states.length; i < n; i++) {
                    states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff }, states[i]);
                }
                return states;
            };

            $scope.rate = function(value) {
                if (value >= 0 && value <= $scope.range.length) {
                    $scope.rating = value;
                    ngModelCtrl.$setViewValue(value);
                    ngModelCtrl.$render();
                }
            };

            $scope.enter = function(value) {
                $scope.value = value;
                $scope.helperText = helperTexts[$scope.value];
                $scope.onHover({value: value});
            };

            $scope.reset = function() {
                $scope.value = ngModelCtrl.$viewValue;
                $scope.helperText = helperTexts[$scope.value];
                $scope.onLeave();
            };

            this.render = function() {
                $scope.value = ngModelCtrl.$viewValue;
            };
        }])
        .directive('starRating', [function () {
            return {
                restrict: 'E',
                require: ['starRating', 'ngModel'],
                controller: 'starRatingDirectiveController',
                templateUrl: '/assets/partials/starrating.html',
                scope: {
                    onHover: '&',
                    onLeave: '&'
                },
                replace: true,
                link: function(scope, element, attrs, ctrls) {
                    var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                    if (ngModelCtrl) {
                        ratingCtrl.init(ngModelCtrl);
                    }
                }
            };
        }]);
});
