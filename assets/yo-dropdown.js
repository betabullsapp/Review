requirejs.config({
  shim: {
    'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min': ['angular']
  }
});

define([
	'angular',
	'bootstrap/lib/bower-components/angular-bootstrap/ui-bootstrap-tpls.min',
	'bootstrap/lib/plugins/css!bootstrap/components/dropdown/css/dropdown.css'
], function(angular) {
	"use strict";
	var module = angular.module('uiDropdownWrapped', ['ui.bootstrap']);

	module.directive('yoDropdown', function() {
		return {
			restrict: 'AE',
			transclude: true,
			replace: true,

			template: '<div class="dropdown" ng-transclude></div>'
		};
	})

	.directive('yoDropdownToggle', function() {
		return {
			require: '?^yoDropdown',
			
			restrict: 'AE',
			transclude: true,
			replace: true,

			template: '<a class="dropdown-toggle {{alignment}}" ng-class="{ellipsis: !noEllipsis}"ng-transclude></a>',

			scope: {
				alignment: "@yoAlignment",
				noEllipsis: '@yoNoEllipsis'
			}
		};
	})

	.directive('yoDropdownOption', function() {
		return { 
			require: '?^dropdown',
			restrict: 'AE',

			link: function(scope, element, attrs, dropdownCtrl) {
				element.bind('click', function(){
					scope.$apply(function(){
						dropdownCtrl.toggle();
					});
				});
			}
		};
	});

	return module;
});
