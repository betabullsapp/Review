define(['listing/module'], function (app) {

    app.service("ReviewService", ["$http", function ($http) {
        var getPublishedReviews = function (businessId, isPreview) {
            var path = isPreview ? "getPublishedReviewsPreview" : "getPublishedReviews";
            var promise = $http({
                url: '/api/' + path + '/' + businessId + location.search,
                method: 'GET'
            });
            return promise;
        };

        var getReviewStats = function (businessId) {
            var promise = $http({
                url: '/api/getReviewStats/' + businessId,
                method: 'GET'
            });
            return promise;
        };

        var submitReview = function(review) {
           var promise = $http({
               url: '/api/saveReview',
               method: 'POST',
               data: {
                   businessId: review.businessId,
                   origin: review.origin,
                   rating: review.rating,
                   title: review.title,
                   review: review.text,
                   isRecommended: review.isRecommended,
                   firstName: review.firstName,
                   lastName: review.lastName,
                   email: review.email,
                   location: review.location
               }
           });
           return promise;
        };

        return {
            getPublishedReviews: getPublishedReviews,
            getPublishedReviews: getPublishedReviews,
            getReviewStats : getReviewStats,
            submitReview: submitReview
        };
    }]);
});

