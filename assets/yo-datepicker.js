requirejs.config({
  shim: {
    'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min': ['angular']
  }
});

define(['angular',
    'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min',
    'bootstrap/lib/plugins/css!../css/datepicker.css'
  ],
  function (angular) {
    "use strict";
    var module = angular.module('uiDatepickerWrapped', ['ui.bootstrap']);

    module.directive('yoDatepicker', function () {
      return {
        restrict: 'AE',
        transclude: true,
        replace: false,
        template: '<datepicker class="well-sm datepicker" ng-model="newDate" min-date="minDate" max-date="maxDate" ' +
          'init-date="initDate" date-disabled="disabled(date, mode)" ng-class="classes"></datepicker>',
        scope: {
          datepicker: "@yoDatepicker",
          classes: "@yoClasses",
          newDate: "=yoNewDate",
          minDate: "=?yoMinDate",
          maxDate: "=?yoMaxDate",
          startingDay: "@yoStartingDay",
          initDate: "@yoInitDate",
          dateDisabled: "&yoDateDisabled",
          newOptions: "=?yoNewOptions"
        }
      };
    })
      .config(['datepickerConfig', function (datepickerConfig) {
        datepickerConfig.showButtonBar =  false;
        datepickerConfig.datepicker = 'shortDate';
        datepickerConfig.showWeeks = false;
      }])
    .directive('yoDatepickerPopup', function () {
      return {
        require: '^yoDatepicker',
        restrict: 'AE',
        transclude: true,
        replace: false,
        template: '<input datepicker-popup type="text" class="datepicker form-control" is-open="isOpen" init-date="initDate" datepicker-options="newOptions" date-disabled="disabled(date, mode)" min-date="minDate" max-date="maxDate" ng-model="newDate" />',
        scope: {
          open: '&open',
          datepickerPopup: "@yoDatepickerPopup",
          isOpen: "=?yoIsOpen"
        }
      };
    })
      .config(['datepickerPopupConfig', function (datepickerPopupConfig) {
        datepickerPopupConfig.showButtonBar =  false;
        datepickerPopupConfig.datepickerPopup = 'shortDate';
      }]);

    return module;
  });


