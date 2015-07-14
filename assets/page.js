define(['common/module'], function(app) {

    // http://stackoverflow.com/questions/12506329/how-to-dynamically-change-header-based-on-angularjs-partial-view
    app.factory("Page", function () {
        var title = 'RateABiz';
        return {
            title : function() { return title; },
            setTitle: function(newTitle) { title = newTitle; }
        };
    });
});

