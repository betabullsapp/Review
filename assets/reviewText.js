define(['listing/module'], function(app) {

    app.factory("ReviewText", function () {
        var reviewText = '';
        return {
            reviewText : function() { return reviewText; },
            setReviewText: function(newReviewText) { reviewText = newReviewText; }
        };
    });
});


