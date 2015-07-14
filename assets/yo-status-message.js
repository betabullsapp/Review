define(
    [
        'bootstrap/module', 
        'bootstrap/lib/plugins/text!../templates/yo-status-message.html',
        'bootstrap/lib/plugins/css!../css/status-message.css'
    ], 
    function(yoBootstrap, groupTmpl) {
        'use strict';
        yoBootstrap.directive('yoStatusMessage', function() {

            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: groupTmpl,
                scope: {
                    title: '@yoTitle',
                    type: '@yoType'
                }
            };
        });
    }
);