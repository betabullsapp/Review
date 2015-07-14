define([
    'listing/module'
], function (listing) {
    return listing
        .controller('businessInfoDirectiveController', ['$scope', function ($scope) {

            window.rateabiz.ui.validation.init('#contact-form');
            window.rateabiz.contact.init();
            $scope.openContactModal = function() {
                window.rateabiz.ui.modal.open('#contact-modal');
            };

            $scope.closeContactModal = function() {
                window.rateabiz.ui.modal.close('#contact-modal');
            };

            $scope.$watch('reviewStats', function (newVal) {
                if (newVal === undefined) {
                    return;
                }

                // required for IE support
                $scope.newReviewUrl = '/reviews/'+$scope.currentBusiness.externalId+'/new';

                $scope.mapUrl = encodeURIComponent($scope.currentBusiness.address.street1) + ',' + encodeURIComponent($scope.currentBusiness.address.city) +
                    ',' + encodeURIComponent($scope.currentBusiness.address.state) + ',' + encodeURIComponent($scope.currentBusiness.address.zip);
                var mapSize = '214x130';
                var mapZoom = '13';
                var markerSize = 'mid';
                var markerColor = '0xe04f4f';

                $scope.showMap = (!$scope.currentBusiness.showCityStateOnly && $scope.currentBusiness.address.street1 != null);

                $scope.mapImageUrl = 'http://maps.googleapis.com/maps/api/staticmap?center='
                    + $scope.mapUrl + '&zoom=' + mapZoom + '&size=' + mapSize + '&maptype=roadmap&markers=size:'
                    + markerSize + '%7Ccolor:' + markerColor + '%7C' + $scope.mapUrl + '&sensor=false';

                $scope.hasReviews = $scope.reviewStats.reviewCount != 0;

                var nearestQuarter = Math.round($scope.reviewStats.averageRating * 4) / 4;
                $scope.beforeDecimal = Math.floor(nearestQuarter);
                $scope.afterDecimal = 100 * (nearestQuarter - $scope.beforeDecimal);

                $scope.averageRatingStarClass = function(starPosition) {
                    if ($scope.beforeDecimal >= starPosition) {
                        return "icon-star on";
                    } else {
                        return "icon-star-bg";
                    }
                };

                $scope.isPartialStar = function(starPosition) {
                    return ($scope.beforeDecimal == (starPosition - 1) && $scope.afterDecimal > 0);
                };

                var getStarPercentage = function (starCount) {
                    return 100 * starCount / $scope.reviewStats.reviewCount || 0;
                };

                $scope.fiveStarPercentage = getStarPercentage($scope.reviewStats.fiveStarCount);
                $scope.fourStarPercentage = getStarPercentage($scope.reviewStats.fourStarCount);
                $scope.threeStarPercentage = getStarPercentage($scope.reviewStats.threeStarCount);
                $scope.twoStarPercentage = getStarPercentage($scope.reviewStats.twoStarCount);
                $scope.oneStarPercentage = getStarPercentage($scope.reviewStats.oneStarCount);

            });
        }])
        .directive('businessInfo', [function () {
            return {
                restrict: 'E',
                templateUrl: '/assets/partials/businessinfo.html',
                scope: {
                    currentBusiness: '=business',
                    reviewStats: '=stats',
                    showWriteReviewLink: '=showlink'
                },
                controller: 'businessInfoDirectiveController'
            };
        }]);
});