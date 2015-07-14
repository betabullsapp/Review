define(
    [
        'bootstrap/module'
    ],
    function(yoBootstrap) {
        'use strict';
        yoBootstrap.filter("abbrNumber", ["numberFormattingUtils", function(numberFormattingUtils) {
            return numberFormattingUtils.abbreviateNumber;
        }]);

        yoBootstrap.filter("abbrCurrency", ["numberFormattingUtils", function(numberFormattingUtils) {
            return numberFormattingUtils.abbreviateCurrency;
        }]);

        yoBootstrap.filter("abbrCurrencyCents", ["numberFormattingUtils", function(numberFormattingUtils) {
            return numberFormattingUtils.abbreviateCurrencyCents;
        }]);
    }
);
