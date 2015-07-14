define(
[
    'angular',
    'bootstrap/module', 
    'bootstrap/lib/plugins/text!../template/yo-accordion.html',
    'bootstrap/lib/plugins/text!../template/yo-accordion-item.html',
    'bootstrap/lib/plugins/css!../css/accordion.css'
], 
function(angular, yoBootstrap, yoAccordionTemplate, yoAccordionItemTemplate) {
    'use strict';
    yoBootstrap.directive('yoAccordion', function() {
        var controller = ['$scope', function($scope) {
            var items = [];

            this.open = function(item) {
                angular.forEach(items, function(item) {
                    item.active = false;
                });
                item.active = true;
            };
            $scope.open = this.open;

            this.addItem = function(item) {
                items.push(item);
                if (item.active) {
                    $scope.open(item);
                }
            };
        }];

        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: yoAccordionTemplate,
            controller: controller
        };
    })
    .directive('yoAccordionItem', function() {
        return {
            require: '^yoAccordion',
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: yoAccordionItemTemplate,
            scope: { title: '@yoTitle', active: '@yoActive' },
            controller: function() {
                this.setTitle = function(element) {
                    this.title = element;
                };
            },
            link: function($scope, $elem, $attrs, yoAccordionCtrl) {
                yoAccordionCtrl.addItem($scope);
                $scope.$watch('active', function(active) {
                    if (active) {
                        yoAccordionCtrl.open($scope);
                    }
                });
            }
        };
    })
    .directive('yoAccordionItemTitle', function() {
        return {
            require: '^yoAccordionItem',
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: '',
            compile: function($element, attr, transclude) {
                return function link($scope, $element, $attr, yoAccordionItemCtrl) {
                    yoAccordionItemCtrl.setTitle(transclude($scope, function() {}));
                };
            }
        };
    })
    .directive('yoAccordionTransclude', function() {
        return {
            require: '^yoAccordionItem',
            link: function($scope, $element, $attr, controller) {
                $scope.$watch(function() { return controller[$attr.yoAccordionTransclude]; }, function(title) {
                    if (title) {
                        $element.html('');
                        $element.append(title);
                    }
                });
            }
        };
    })
    ;
});