define([
    'directory/module'
], function(directory) {
    return directory.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {

            $routeProvider
                .when('/c', {
                    controller: 'SegmentCtrl',
                    templateUrl: '/assets/partials/allsegments.html'
                })
                .when('/c/:segmentName', {
                    controller: 'DirectoryCtrl',
                    templateUrl: '/assets/partials/listingsForSegment.html'
                });

            $locationProvider.html5Mode(true);
        }
    ]);
});
