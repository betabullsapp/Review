define(['bootstrap/module'], function(yoBootstrap) {
	'use strict';
    yoBootstrap.filter("toPercent", ["numberFormattingUtils", function(numberFormattingUtils) {
        return numberFormattingUtils.formatRateAsPercent;
    }]);
});
