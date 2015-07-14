define([
    'bootstrap/module',
    'bootstrap/lib/plugins/css!../css/table.css'
], function (yoBootstrap) {
    'use strict';
    yoBootstrap.directive("yoTableSort", [function () {
        return {
            restrict: "A",
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var model = $attrs.yoModel;

                this.addSortField = function(fieldName) {
                    $element.find("th").removeClass("sorted_asc sorted_desc");

                    var newSort = '+' + fieldName;
                    var sortClass = "sorted_asc";
                    if (newSort === $scope[model]) {
                        newSort = '-' + fieldName;
                        sortClass = "sorted_desc";
                    }
                    $scope[model] = newSort;

                    return sortClass;
                };
            }]
        };
    }]);

    yoBootstrap.directive("yoTableSortField", [function () {
        return {
            restrict: "A",
            require: '^yoTableSort',
            transclude: 'true',
            template: '<a ng-transclude></a>',
            link: function (scope, element, attrs, yoTableSortCtrl) {

                // Currently needed to have the correct styling
                element.attr("data-sort-type", "");
                
                element.on("click", function() {
                    var sortClass = yoTableSortCtrl.addSortField(attrs.yoTableSortField);
                    element.addClass(sortClass);
                    scope.$digest();
                });
            }
        };
    }]);
});