define([
    'home/module'
], function(home) {
    return home.config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {

            $routeProvider
                .when('/', {
                    templateUrl: '/assets/partials/main.html'
                })
                .when('/termsAndConditions', {
                    templateUrl: '/assets/partials/termsandconditions.html'
                })
                .when('/privacyPolicy', {
                    templateUrl: '/assets/partials/privacypolicy.html'
                })
                ;

            $locationProvider.html5Mode(true);
        }
    ]);
});
