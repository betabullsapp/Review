define(['bootstrap/module'], function(bootstrap) {
    'use strict';
    bootstrap.factory('themeService', [function() {
        var sheets = [];
        var currentBrand;
        var currentTheme;
        var base;

        /**
         * Adds a tagged stylesheet to the page (that can be removed later)
         *
         * @param tag the tagged name of the stylesheet which can be used to remove it. subsequent calls
         *        with the same tag will remove the existing stylesheet
         */
        this.addTaggedStylesheet = function(tag, location) {
            var sheet = { tag: tag, location: location };

            for (var i = 0; i < sheets.length; i++) {
                if (sheets[i].tag === tag) {
                    var returnedSheets = sheets[i] = sheet;
                    return returnedSheets;
                }
            }

            return sheets.push(sheet);
        };

        this.setBrand = function(brand) {
            currentBrand = brand;
            this.addTaggedStylesheet('brand', 'brands/' + brand + '/brand.css');
        };

        this.getBrand = function() {
            return currentBrand;
        };

        this.setTheme = function(theme) {
            currentTheme = theme;
            this.addTaggedStylesheet('theme', 'themes/' + theme + '.css');
        };

        this.getTheme = function() {
            return currentTheme;
        };

        this.setBase = function(baseUrl) {
            if (baseUrl && baseUrl.slice(-1) === '/') {
                baseUrl = baseUrl.substring(0, baseUrl.length - 1);
            }
            base = baseUrl;
        };

        this.getBase = function() {
            return base;
        };

        // The exposed methods
        return {
            addTaggedStylesheet: this.addTaggedStylesheet,
            getBrand: this.getBrand,
            setBrand: this.setBrand,
            getTheme: this.getTheme,
            setTheme: this.setTheme,
            setBase: this.setBase,
            getBase: this.getBase,
            sheets: sheets
        };
    }]);
    bootstrap.directive('yoTheme', ['$compile', 'themeService', function($compile, themeService) {
        return {
            restrict: 'A',
            template: '',
            link: function(scope, element, attributes) {
                var elementTemplate = $compile('<link rel="stylesheet" data-ng-repeat="sheet in sheets" data-ng-href="{{ base + sheet.location }}" data-ng-if="base && sheet.location" type="text/css" />');
                scope.sheets = themeService.sheets;
                var cssElement = angular.element(elementTemplate(scope));
                
                var firstScript = element.find("script")[0];
                if (firstScript === undefined) {
                    element.append(cssElement);
                } else {
                    cssElement.insertBefore(firstScript);
                }

                attributes.$observe('yoBaseUrl', function(baseUrl) {
                    if (baseUrl !== undefined && baseUrl !== "") {
                        themeService.setBase(baseUrl);
                        scope.base = themeService.getBase() + "/";
                    }
                });

                attributes.$observe("yoTheme", function(yoTheme) {
                    if (yoTheme !== undefined && yoTheme !== "") {
                        themeService.setTheme(attributes.yoTheme);
                    }
                });
                attributes.$observe("yoBrand", function(yoBrand) {
                    if (yoBrand !== undefined && yoBrand !== "") {
                        themeService.setBrand(attributes.yoBrand);
                    }
                });
            }
        };
    }]);
});
