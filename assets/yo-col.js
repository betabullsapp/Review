define(['bootstrap/module'], function(yoBootstrap) {
    'use strict';
    yoBootstrap.directive('yoCol', function() {
        return {
            restrict: 'A',
            replace: true,
            link: function($scope, $element, $attributes) {
                $attributes.$observe('yoCol', function(width) {
                    var currentWidth = $element.data('yo-col-width');

                    if (currentWidth !== null) {
                        $element.removeClass('col-md-' + currentWidth);
                    }

                    if (width) {
                        $element.addClass('col-md-' + width);
                    }

                    $element.data('yo-col-width', width);
                });
            }
        };
    });
});
