define(['bootstrap/module'], function(yoBootstrap) {
	'use strict';
    yoBootstrap.filter("secondsToDuration", ["numberFormattingUtils", function(numberFormattingUtils) {
        return numberFormattingUtils.formatSecondsAsDuration;
    }]);
});
