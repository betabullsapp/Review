define(
    [
        'bootstrap/module', 
        'bootstrap/lib/plugins/text!../templates/yo-information-tiles.html',
        'bootstrap/lib/plugins/css!../css/information-tiles.css'
    ], 
    function(yoBootstrap, groupTmpl) {
        'use strict';
        yoBootstrap.directive('yoInformationTile', function() {
            var yoInformationTileController = function($scope) {
                $scope.ratingPercentage = ($scope.rating * 2) * 10;
            };

            return {
                restrict: 'AE',
                transclude: true,
                replace: false,
                template: groupTmpl,
                scope: {
                    title: '@yoTitle',
                    type: '@yoType',
                    rating: '@yoRating',
                    value: '@yoValue',
                    footer: '@yoFooter',
                    footerUrl: '@yoFooterUrl',
                    footerUrlText: '@yoFooterUrlText',
                    tier: '@yoTier'
                },
                controller: ['$scope', yoInformationTileController],
                link: function($scope, $elem) {
                    if ($scope.tier) {
                        $elem.addClass($scope.tier + "-container");
                    }
                    else {
                        $elem.addClass("standard-container");
                    }
                }
            };
        });
    }
);
