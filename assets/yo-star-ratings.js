define(
    [
        'bootstrap/module', 
        'bootstrap/lib/plugins/text!../templates/yo-star-ratings.html',
        'bootstrap/lib/plugins/css!../css/star-ratings.css'
    ], 
    function(yoBootstrap, groupTmpl) {
        'use strict';
        yoBootstrap.directive('yoStarRating', function() {
            var yoStarRatingController = function($scope) {
                $scope.ratingPercentage = $scope.rating * 20;
            };

            return {
                restrict: 'AE',
                transclude: true,
                replace: false,
                template: groupTmpl,
                scope: {
                    rating: '@yoRating'
                },
                controller: ['$scope', yoStarRatingController],
                link: function($scope, $elem) {
                }
            };
        });
    }
);
