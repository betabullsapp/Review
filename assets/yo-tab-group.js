/**
 * disabled: setting disabled does not disable the tab
 */
define(
    [
        'bootstrap/module', 
        'bootstrap/lib/plugins/text!../templates/yo-tab-group.html',
        'bootstrap/lib/plugins/css!../css/tabs.css'
    ], 
    function(yoBootstrap, groupTmpl) {
        'use strict';
        yoBootstrap.directive('yoTabGroup', function() {
            var yoTabsController = function($scope) {
                if (!$scope.tabWidth) {
                    $scope.tabWidth = 3;
                }

                var tabs = $scope.tabs = [];
                $scope.isVertical = $scope.type === 'vertical';

                if ($scope.isVertical) {
                    $scope.navYoColParam = $scope.tabWidth;
                    $scope.contentYoColParam = 'offset-' + $scope.tabWidth;
                }
                
                $scope.select = this.select = function(tab) {
                    angular.forEach(tabs, function(t) {
                        t.active = false;
                    });
                    tab.active = true;

                    $scope.onChange();
                    
                    tab.onSelect();
                };

                this.addTab = function(tab) {
                    tabs.push(tab);
                    tabs[tab.id] = tab;
                    if (tabs.length === 1 || tab.active) {
                        $scope.select(tab);
                    }
                };
            };

            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: groupTmpl,
                scope: {
                    type: '@yoType',
                    tabWidth: '@yoTabWidth',
                    onChange: '&yoOnChange',
                    navClass: '@yoClass',
                    activeTab: '@yoSetActiveTab'
                },
                controller: ['$scope', yoTabsController],
                link: function($scope, $element) {
                    $element.find('nav').addClass($scope.navClass);
                    if ($scope.activeTab) {
                    	$scope.select($scope.tabs[$scope.activeTab]);
                    }

                    if ($scope.isVertical){
                        $scope.$watch(function(){
                            return $element.find('nav').eq(0).find('ul').height();
                        }, function(newValue, oldValue){
                            $element.find('.tab-content').css('min-height', newValue + 30);
                        });
                    }
                }
            };
        });
    }
);
