define(['home/module'], function(app) {

    app.controller(
            "MainCtrl", ["$scope", "Page",
                function ($scope, Page) {
                    if ($scope.Page === undefined) {
                        $scope.Page = Page;
                    }
                    Page.setTitle('RateABiz');
                }]);
});