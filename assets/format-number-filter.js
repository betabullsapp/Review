define(['bootstrap/module'], function(yoBootstrap) {
	'use strict';
    yoBootstrap.filter("formatIntWithCommas", ["numberFormattingUtils", function(numberFormattingUtils) {
        return numberFormattingUtils.formatIntWithCommas;
    }]);
});
