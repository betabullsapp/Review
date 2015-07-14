define(['listing/module'], function(app) {

    app.controller(
            "UnsubscribeCtrl", ["$scope", "$routeParams", "UnsubscribeService",
                function ($scope, $routeParams, UnsubscribeService) {

                    $scope.completed = false;

                    $scope.form = {
                        businessId: $routeParams.businessId,
                        email: $routeParams.email
                    };

                    $scope.submit = function() {
                        UnsubscribeService.unsubscribe($scope.form).then(
                            function (resp) {
                                $scope.completed = resp.data.completed;
                            }
                        );
                    }

                }]);
});