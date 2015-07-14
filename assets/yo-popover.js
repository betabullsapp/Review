requirejs.config({
  shim: {
    'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min': ['angular']
  }
});

define(['angular',
    'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min'
  ],
  function (angular) {
    "use strict";
    var module = angular.module('uiPopoverWrapped', ['ui.bootstrap']);

    module.directive('yoPopover', function () {
      var newTemplate = '<span class="btn btn-default" ng-model="content" popover="{{popover}}" popover-title="{{popoverTitle}}" popover-placement="{{popoverPlacement}}" popover-animation="{{popoverAnimation}}" popover-popup-delay="{{popoverPopupDelay}}" popover-trigger="{{popoverTrigger}}" popover-append-to-body="{{popoverAppendToBody}}"></span>';

      return {
        restrict: 'AE',
        scope: true,
        compile:function (tElement, tAttrs, transclude) {
          var content = tElement.text();
          tElement.html(newTemplate).children().append(content);

          return function (scope, element, attrs) {
            scope.content = content;
            scope.popover = attrs.yoPopover;
            scope.popoverTitle = attrs.yoPopoverTitle;
            scope.popoverPlacement = attrs.yoPopoverPlacement;
            scope.popoverAnimation = attrs.yoPopoverAnimation;
            scope.popoverPopupDelay = attrs.yoPopoverPopupDelay;
            scope.popoverTrigger = attrs.yoPopoverTrigger;
            scope.popoverAppendToBody = attrs.yoPopoverAppendToBody;
          };
        }
      };
    })

    .directive('yoInputPopover', function () {
      return {
        restrict: 'AE',
        require: 'yoPopover',
        transclude: true,
        replace: false,
        template: '<input type="{{type}}" value="{{value}}" popover="{{popover}}"  popover-trigger="{{popoverTrigger}}" />',
        scope: {
          popover: '@yoInputPopover',
          type: "@type",
          value: "@value"
        },
      };
    });
    return module;
  });