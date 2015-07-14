define(['angular', 'angularRoutes', 'angulartics', 'angularticsGoogleAnalytics'], function(angular) {
   return angular.module('listing', ['ngRoute', 'angulartics', 'angulartics.google.analytics']);
});