define([
        'bootstrap/module', 
        'bootstrap/lib/plugins/text!../templates/yo-nav.tpl.html', 
        'bootstrap/lib/plugins/text!../templates/yo-nav-item.tpl.html',
        'bootstrap/lib/plugins/text!../templates/yo-nav-label.tpl.html',
        'bootstrap/lib/plugins/css!bootstrap/components/navigation/css/sidebar-nav.css?priority=97',
    ], 
    function(yoBootstrap, yoNavTpl, yoNavItemTpl, yoNavLabelTpl) {
        'use strict';
        yoBootstrap.directive('yoNav', function() {
            var controllerFunc = function($scope, $element, $attrs, $location, $route, $window, themeService) {
                // flat list of all nav items
                var navItems = [];
                var addTab = function(tab) {
                    navItems.push(tab);
                    if ($route.current) {
                        refreshNav($route.current.navId);
                    }
                };
                
                var refreshNav = function(navItemId) {
                    for (var i in navItems) {
                        if (navItems.hasOwnProperty(i)) {
                            var navItem = navItems[i];
                            navItem.subNavExpanded = false;
                            if (navItem.id) {
                                navItem.selected = (navItem.id === navItemId);
                            } else {
                                navItem.selected = ($location.path() === navItem.url);
                            }
                        }
                    }
                };
                
                $scope.$on('$routeChangeSuccess', function(nextRoute, currentRoute) {
                    if (currentRoute) {
                        refreshNav(currentRoute.navId);
                    }
                    $scope.toggleSideNav("collapse");
                    if ($scope.isVertical){
                        // Scroll to the top of the page on successful route change. 
                        angular.element($window).scrollTop(0);
                    }
                });
                
                $scope.isVertical = $scope.type === 'vertical';
                $scope.isHorizontal = $scope.type === 'horizontal';
                $scope.expandSidebar = false;

                $scope.$watch(themeService.getBrand, function(brand) {
                    $scope.brand = brand;
                });

                $scope.$watch(themeService.getBase, function(base) {
                    $scope.base = base;
                });

                $scope.executeSearch = function() {
                    $location.path($scope.searchUrl);
                    $location.search({ query: $scope.search.query });
                };

                $scope.toggleSideNav = function(type) {
                    // Collapse sidebar if current it's currently expanded, or if we explicitly choose to collapse it
                    $scope.expandSidebar = $scope.expandSidebar === true || type === "collapse" ? false : true;

                    // If sidebar is expanded
                    if ($scope.expandSidebar && type !== "collapse") {
                        angular.element($window).bind('mousedown.nav', function(event){
                            event.stopPropagation();

                            if (!angular.element(event.target).closest('.side-nav-wrapper').length){
                                $scope.toggleSideNav("collapse");
                                $scope.$apply();

                                angular.element($window).unbind('mousedown.nav'); // Remove event
                            }
                        });
                    }
                };

                angular.element($window).bind("resize.nav", function() {
                    var windowWidth = $(this).width();
                    var collapsable = false;

                    // Match with media query
                    if (windowWidth < 1205) {
                        collapsable = true;
                    }

                    if (!collapsable) {
                        $scope.toggleSideNav("collapse");
                        $scope.$apply();
                    }

                    $scope.$on('$destroy', function() {
                        angular.element($window).unbind("resize.nav");
                    });
                });

                $scope.search = { query: $location.search().query };

                return {
                    addTab : addTab,
                    isVertical : $scope.isVertical
                };
            };

            return {
                restrict: 'AE',
                transclude: true,
                template: yoNavTpl,
                replace: true, 
                scope: {
                    id: '@',
                    type: '@',
                    cols: '@',
                    searchUrl: '@',
                    searchPlaceholder: '@',
                    logoUrl: '@'
                },
                controller: ['$scope', '$element', '$attrs', '$location', '$route', '$window', 'themeService', controllerFunc]
            };
        });

        yoBootstrap.directive('yoNavItem', function() {
            var linkFunc = function($scope, $element, $attrs, navCtrl) {
                $scope.hasSubNavs = $element.find("li").length > 0;
                $scope.subNavExpanded = false;

                if ($scope.hasSubNavs && !$scope.url) {
                    $scope.isDropdown = true;
                }

                // Returns boolean for active state of navigation element
                $scope.isActive = function() {
                    return $scope.selected || $scope.subNavExpanded || $element.find("li").hasClass('active');
                };

                $scope.onClick = function() {
                    if ($scope.hasSubNavs && !$scope.url) {
                        $scope.subNavExpanded = $scope.subNavExpanded === false ? true : false;
                    }
                };

                navCtrl.addTab($scope);
            };

            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                require: '^yoNav',
                template: yoNavItemTpl,
                scope: {
                    id: '@',
                    name: '@',
                    url: '@',
                    icon: '@',
                    target: '@'
                },
                link: linkFunc
            };
        });

        yoBootstrap.directive('yoNavLabel', function() {
            var linkFunc = function($scope, $element, $attrs, navCtrl) {
                navCtrl.addTab($scope);

                $scope.mainNavisVertical = navCtrl.isVertical;
            };

            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                require: '^yoNav', 
                template: yoNavLabelTpl,
                scope: {
                    id: '@',
                    name: '@'
                },
                link: linkFunc
            };
        });

        yoBootstrap.directive('yoReload', function() {
            return {
                restrict: 'AC',
                require: ['^yoNav'], 
                link: function($scope, $elem) {
                    $elem.find('a').attr('target', '_self');
                }
            };
        });
    }
);
