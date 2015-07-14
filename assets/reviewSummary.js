define(['listing/module'], function (app) {

    app.controller(
        "ReviewSummaryCtrl", ["$scope", "$rootScope", "$routeParams", "$q", "$location", "Page", "HeadInjector", "ReviewService", "BusinessService",
            function ($scope, $rootScope, $routeParams, $q, $location, Page, HeadInjector, ReviewService, BusinessService) {

                /** INITIALIZATION **/
                $scope.reviews = [];
                $scope.businessId = $routeParams.businessId;
                $scope.seoName = $routeParams.seoName;


                $scope.filters = {
                    sort: {
                        review: "-createdDate"
                    },
                    search: {
                        review: ""
                    }
                };

                var determineRedirect = function(businessId, urlSeoName, seoFriendlyName) {
                    if (urlSeoName == null) {
                        if (seoFriendlyName != null && seoFriendlyName !== "") {
                            $rootScope.headPreserve = true;
                            $location.path('/reviews/'+seoFriendlyName+'/'+businessId+'/summary').replace();
                        }
                    } else { // seoName != null
                        if (seoFriendlyName != null && seoFriendlyName !== "") {
                            if (seoFriendlyName !== $scope.seoName) {
                                $rootScope.headPreserve = true;
                                $location.path('/reviews/'+seoFriendlyName+'/'+businessId+'/summary').replace();
                            }
                        } else {
                            $rootScope.headPreserve = true;
                            $location.path('/reviews/'+businessId+'/summary').replace();
                        }
                    }
                };

                var loadBusiness = function(businessId) {
                        return BusinessService.getBusiness(businessId).then(function(response) {
                            $scope.business = response.data;
                            var businessName = $scope.business.name;
                            var externalId = $scope.business.externalId;
                            var seoFriendlyName = $scope.business.seoFriendlyName;

                            Page.setTitle("Reviews for "+businessName+" - RateABiz");
                            HeadInjector.add("<link rel='canonical' href='http://www.rateabiz.com/reviews/"+seoFriendlyName+"/"+externalId+"/summary' />");

                            determineRedirect(externalId, $scope.seoName, seoFriendlyName);

                            return $scope.business.id;
                        });
                    },
                    loadPreviewReviews = function(businessId) {
                        return ReviewService.getPublishedReviews(businessId, true).then(function(response) {
                            $scope.reviews = response.data.reviews;
                            $scope.reviews.length = response.data.count;
                            $scope.hasReviews = $scope.reviews.length > 0;
                            alert("loadPreviewReviewsReturned." + $scope.reviews.length);
                        });
                    },
                    loadReviews = function(businessId) {
                        return ReviewService.getPublishedReviews(businessId, false).then(function(response) {
                            $scope.reviews = response.data;
                            $scope.hasReviews = $scope.reviews.length > 0;
                        });
                    },
                    loadReviewStats = function(businessId) {
                        return ReviewService.getReviewStats(businessId).then(function(response) {
                            $scope.reviewStats = response.data;
                        });
                    };

                $scope.reviewSearchFilter = function(review) {
                    return $filter('filter')([review.id], $scope.filters.search).length > 0 ||
                        $filter('filter')([review.authorFirstName], $scope.filters.search).length > 0 ||
                        $filter('filter')([review.authorLastName], $scope.filters.search).length > 0 ||
                        $filter('filter')([review.title], $scope.filters.search).length > 0 ||
                        $filter('filter')([review.text], $scope.filters.search).length > 0 ||
                        $filter('filter')([review.response.text], $scope.filters.search).length > 0;
                };

                // load reviews and reviewstats after business is loaded
                var businessP = loadBusiness($scope.businessId);
                //businessP.then(loadPreviewReviews);
                businessP.then(loadReviewStats);
                businessP.then(loadReviews);
            }]);
});
