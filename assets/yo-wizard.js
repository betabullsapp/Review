define(
[
    'angular',
    'bootstrap/module', 
    'bootstrap/lib/plugins/text!../template/yo-wizard.html',
    'bootstrap/lib/plugins/text!../template/yo-wizard-item.html',
    'bootstrap/lib/plugins/css!../css/wizard.css'
], 
function(angular, yoBootstrap, yoWizardTemplate, yoWizardItemTemplate) {
    'use strict';
    yoBootstrap.directive('yoWizard', function() {
        var yoWizardController = function($scope){
            var items = $scope.items = [];

            this.addItem = function(item) {
                items.push(item);
            };

            this.getItemCount = function(){
                return $scope.items.length;
            };

            this.updateCompletedItems = function(index) {
                angular.forEach(items, function(i) {
                    if(i.id<index) {
                        i.completed = true;
                    }
                });
            };
        };

        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: yoWizardTemplate,
            scope: {},
            controller: yoWizardController,
            link: function($scope) {
                //Mark first/last item
                $scope.items[0].first = true;
                $scope.items[$scope.items.length-1].last = true;
            }
        };
    })
    .directive('yoWizardItem', function() {
        return {
            require: '^yoWizard',
            restrict: 'AE',
            replace: true,
            template: yoWizardItemTemplate,
            scope: {
                active: '@yoActive',
                title: '@yoTitle'
            },
            link: function($scope, $elem, $attrs, yoWizardCtrl) {
                $scope.id = yoWizardCtrl.getItemCount();
                yoWizardCtrl.addItem($scope);

                //If it's active, mark all previous items as completed 
                if ($scope.active) {
                    yoWizardCtrl.updateCompletedItems($scope.id);
                }

            }
        };
    });
});