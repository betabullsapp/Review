define(['angular', 'angularRoutes', 'angulartics', 'angularticsGoogleAnalytics'], function(angular) {
    return angular.module('home', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);
});