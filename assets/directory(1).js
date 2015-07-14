define(['directory/module'], function(app) {

    app.controller(
            "DirectoryCtrl", ["$scope", "$routeParams", "Page", "DirectoryService",
                function ($scope, $routeParams, Page, DirectoryService) {
                    $scope.businesses = [];

                    $scope.order = { selectedOrder: 'name' };

                    $scope.segmentName = $routeParams.segmentName;

                    function toTitleCase(str)
                    {
                        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    }

                    $scope.capitalizedSegmentName = toTitleCase($scope.segmentName);

                    DirectoryService.getListingsForSegment($scope.segmentName, true).then(
                        function(response) {
                            $scope.businesses = response.data.businesses;
                            $scope.businesses.length = response.data.count;

                        }
                    );

                    DirectoryService.getListingsForSegment($scope.segmentName, false).then(
                        function(response) {
                            $scope.businesses = response.data;
                        }
                    );
                }]);
});