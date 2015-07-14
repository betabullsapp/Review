define([
    'listing/module'
], function(listing) {
    return listing.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {

            $routeProvider
                .when('/reviews/:businessId/new', {
                    controller: 'NewReviewCtrl',
                    templateUrl: '/assets/partials/newreview.html'
                })
                .when('/reviews/:seoName/:businessId/new', {
                    controller: 'NewReviewCtrl',
                    templateUrl: '/assets/partials/newreview.html'
                })
                .when('/reviews/:businessId/summary', {
                    controller: 'ReviewSummaryCtrl',
                    templateUrl: '/assets/partials/reviewsummary.html'
                })
                .when('/reviews/:seoName/:businessId/summary', {
                    controller: 'ReviewSummaryCtrl',
                    templateUrl: '/assets/partials/reviewsummary.html'
                })
                .when('/reviews/:businessId/unsubscribe', {
                    controller: 'UnsubscribeCtrl',
                    templateUrl: '/assets/partials/unsubscribe.html'
                });

            $locationProvider.html5Mode(true);
        }
    ]);
});