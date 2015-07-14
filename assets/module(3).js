define(['angular', 'angularRoutes', 'angulartics', 'angularticsGoogleAnalytics'], function(angular) {
    return angular.module('directory', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);
});