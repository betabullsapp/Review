define(['common/module'], function(app) {
    app.provider("HeadInjector", function () {

        function HeadInjector($compile, $rootScope) {

            var head = angular.element(document.getElementsByTagName('head')[0]),
                scope;

            $rootScope.$on('$locationChangeStart', function()
            {
                // sometimes we want to change the url without removing the dynamic content
                if ($rootScope.headPreserve != true) {
                    removeAll();
                }
                $rootScope.headPreserve = false;
            });

            var _initScope = function () {
                if (scope === undefined) {
                    if ((scope = head.scope()) === undefined) {
                        throw("Head Provider error: Please initialize the app in the HTML tag and ensure there is a HEAD tag.");
                    }
                }
            };

            var addElement = function (html) {
                _initScope();

                if (scope.injectedElements === undefined) {
                    scope.injectedElements = [];
                } else {
                    for (var i in scope.injectedElements) {
                        if (scope.injectedElements[i] == html) {
                            return;
                        }
                    }
                }
                head.append($compile(html)(scope));
                scope.injectedElements.push(html);
            };

            var removeAll = function () {
                _initScope();

                head.children('.ng-scope').remove();

                if (scope.injectedElements !== undefined) {
                    scope.injectedElements = [];
                }
            };

            return {
                add: addElement,
                removeAll: removeAll
            };
        }

        this.$get = ['$compile', '$rootScope', function ($compile, $rootScope) {
            return new HeadInjector($compile, $rootScope);
        }];

    });
});

