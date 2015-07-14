define(
    [
        'bootstrap/module'
    ],
    function(yoBootstrap) {
        'use strict';
        yoBootstrap.filter("toDollars", [function(numberFormattingUtils) {
            return function(input) {
                return '$' + (input / 100).toFixed(2);
            };
        }]);
    }
);
