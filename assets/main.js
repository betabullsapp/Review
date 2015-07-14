requirejs.config({
    baseUrl: '/assets/',

    // The packages that are independent modules in the eyes of requirejs
    packages: [
        {
            name: 'common',
            location: 'javascript/app/common'
        },
        {
            name: 'home',
            location: 'javascript/app/home'
        },
        {
            name: 'listing',
            location: 'javascript/app/listing'
        },
        {
            name: 'directory',
            location: 'javascript/app/directory'
        }
    ],

    // Set up the paths to the actual resources so that a module can simply depend on "angular" and it will use
    // the application-wide version of it
    paths: {
    		angular: 'bootstrap/src/lib/angular-1.2.13/angular',
            async: 'bootstrap/src/lib/requireJs/async',
            propertyParser: 'bootstrap/src/lib/requireJs/propertyParser',
    		angularRoutes: 'bootstrap/src/lib/angular-1.2.13/angular-route',
    		angularMocks: 'bootstrap/src/lib/angular-1.2.13/angular-mocks',
    		jquery: 'javascript/lib/jquery/jquery-1.10.2',
            angulartics: 'angulartics/src/angulartics',
            angularticsGoogleAnalytics: 'angulartics/src/angulartics-ga',
            goog: 'bootstrap/src/lib/requireJs/goog',
            text: 'bootstrap/src/lib/requireJs/text',
    		bootstrap: 'bootstrap/src'
    	},

    	// Determines which dependencies need to be loaded for non-AMD scripts (such as angular)
    	shim: {
    		angular: {
    			exports: 'angular', // The name of the variable that the "angular" module should expose to the world
    			deps: ['jquery']
    		},
    		angularRoutes: {
    			deps: ['angular'] // ngRoute has a dependency on base angular
    		},
    		angularMocks: {
    			deps: ['angular'] // ngMocks has a dependency on base angular
    		},
            angulartics: ['angular'],
            angularticsGoogleAnalytics: ['angulartics']
    	}
});

require(['angular', 'bootstrap/all', 'home', 'listing', 'directory', 'common'], function(angular, bootstrap, home, listing, directory, common){
    return angular.bootstrap(document, [bootstrap.name, home.name, listing.name, directory.name, common.name]);
});
