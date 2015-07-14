define(['listing/module'], function (app) {
    app.controller(
        "NewReviewCtrl", ["$scope", "$rootScope", "$routeParams", "$q", "$window", "$location", "yoModalService", "ReviewText", "Page", "HeadInjector", "ReviewService", "BusinessService", "$analytics",
            function ($scope, $rootScope, $routeParams, $q, $window, $location, yoModalService, ReviewText, Page, HeadInjector, ReviewService, BusinessService, $analytics) {

                /** INITIALIZATION **/
                $scope.businessId = $routeParams.businessId;
                var reviewerOrigins = ['email', 'website', 'mobile', 'facebook'];

                if ($scope.ReviewText === undefined) {
                    $scope.ReviewText = ReviewText;
                }

                $scope.seoName = $routeParams.seoName;
                $scope.reviewOrigin = $routeParams.source || "";
                $scope.review = {
                    rating: 0,
                    isRecommended: true,
                    email: $routeParams.email
                };

                $scope.maximumReviewLength = 5000;

                window.rateabiz.ui.validation.init('#new-review-form');

                // Remove any canonical link tags
                HeadInjector.removeAll();

                $scope.toggleIsRecommended = function () {
                    $scope.review.isRecommended = !$scope.review.isRecommended;
                };

                var displaySuccessMessage = function(message) {
                    angular.element(document.querySelector('.review-form-block')).hide();

                    angular.element(document.querySelector('.message-block .message')).text(message);
                    angular.element(document.querySelector('.message-block')).fadeIn();
                };

                $scope.submit = function() {
                    if ($scope.review.rating == 0) {
                        return;
                    }
                    $scope.review.businessId = $scope.business.id;
                    $scope.review.origin = $scope.reviewOrigin || "";
                    if (reviewerOrigins.indexOf($scope.reviewOrigin.toLowerCase()) == -1) {
                        $scope.review.origin = "website";
                    }
                    ReviewText.setReviewText($scope.review.text);
                    ReviewService.submitReview($scope.review).then(
                        function(response) {
                            var isUnderReview = response.data.isUnderReview;

                            if (isUnderReview) {
                                displaySuccessMessage('Your review has been submitted to RateABiz and '+$scope.business.name+' has been notified. Check back soon to see your review posting.');
                            } else {
                                displaySuccessMessage('Your review has been posted and '+$scope.business.name+' has been notified.');
                                $scope.reviewText = $scope.review.text;
                                if ($scope.googleRedirectUrl != null) {
                                    $analytics.eventTrack("Viewed G+ Modal", {category: 'G+'});
                                    yoModalService.open('gplus-modal');
                                }
                            }
                        },
                        function(error) {
                            window.rateabiz.ui.notification.show("Error", "Review Form Not Submitted", "Sorry - there was an error while submitting your form. Please try again.");
                        });
                };

                $scope.closeGPlusModal = function() {
                    yoModalService.close('gplus-modal');
                };

                var determineRedirect = function (businessId, urlSeoName, seoFriendlyName) {
                        if (urlSeoName == null) {
                            if (seoFriendlyName != null && seoFriendlyName !== "") {
                                $rootScope.headPreserve = true;
                                $location.path('/reviews/' + seoFriendlyName + '/' + businessId + '/new').replace();
                            }
                        } else { // seoName != null
                            if (seoFriendlyName != null && seoFriendlyName !== "") {
                                if (seoFriendlyName !== $scope.seoName) {
                                    $rootScope.headPreserve = true;
                                    $location.path('/reviews/' + seoFriendlyName + '/' + businessId + '/new').replace();
                                }
                            } else {
                                $rootScope.headPreserve = true;
                                $location.path('/reviews/' + businessId + '/new').replace();
                            }
                        }
                    },
                    createGoogleRedirectUrl = function (business) {
                        if (business.googleListingUrl != null) {
                            if (business.googleListingUrl.indexOf('?') > -1) { // contains
                                $scope.googleRedirectUrl = business.googleListingUrl + "&review=1";
                            } else {
                                $scope.googleRedirectUrl = business.googleListingUrl + "?review=1";
                            }
                        }
                    };

                var loadBusiness = function (businessId) {
                        return BusinessService.getBusiness(businessId).then(function (response) {
                            $scope.business = response.data;

                            Page.setTitle("Write a review for "+$scope.business.name);
                            HeadInjector.add('<meta name="robots" content="noindex">');

                            determineRedirect($scope.business.externalId, $scope.seoName, $scope.business.seoFriendlyName);
                            createGoogleRedirectUrl($scope.business);
                            return $scope.business.id;
                        });
                    },
                    loadReviewStats = function (businessId) {
                        return ReviewService.getReviewStats(businessId).then(function (response) {
                            $scope.reviewStats = response.data;
                        });
                    };

                // load reviewstats after business is loaded
                var businessP = loadBusiness($scope.businessId);
                businessP.then(loadReviewStats);
            }]);
});