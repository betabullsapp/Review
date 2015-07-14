define([
    'bootstrap/module', 
    'bootstrap/lib/plugins/text!bootstrap/components/pagination/templates/paging-ctrl.html'
], function(module, pagingCtrlTmpl) {
    "use strict";

    module.filter('offset', function() {
        return function(input, start) {
            if (input) {
                start = parseInt(start, 10);
                return input.slice(start);
            }
            else {
                return [];
            }
        };
    });

    module.factory('Pager', [function() {
        return function() {
            this.items = [];
            this.page = 1;
            this.pageSize = 10;

            this.init = function(numPerPage) {
                this.pageSize = parseInt(numPerPage, 10);
            };

            this.pageStart = function() {
                return Math.min(this.pageOffset() + 1, this.items.length);
            };

            this.pageEnd = function() {
                return Math.min(this.pageOffset() + this.pageSize, this.items.length);
            };

            this.pageOffset = function() {
                return (this.page - 1) * this.pageSize;
            };

            this.setPage = function(p) {
                this.page = Math.max(Math.min(this.numPages(), p), 1);
            };

            this.nextPage = function() {
                this.setPage(this.page + 1);
            };

            this.prevPage = function() {
                this.setPage(this.page - 1);
            };

            this.isFirstPage = function() {
                return this.page <= 1;
            };

            this.isLastPage = function() {
                return this.page >= this.numPages();
            };

            this.numPages = function() {
                return Math.ceil(this.items.length / this.pageSize);
            };
        };
    }]);

    module.controller('paginate', ['$scope', 'Pager', function($scope, Pager) {
        $scope.pager = new Pager();

        $scope.$watch('pager.items', function(newVal, oldVal) {
            $scope.pager.setPage(1);
        }, true);

    }]);

    module.directive('yoPrevPage', [function() {
        return {
            restrict: 'AE',
            replace: true,
            require: '^paginate',
            template: '<a href="#" ng-click="pager.prevPage()" ng-class="{disabled: pager.isFirstPage()}" class="yo-icon-left-gate"></a>',
        };
    }]);

    module.directive('yoNextPage', [function() {
        return {
            restrict: 'AE',
            replace: true,
            require: '^paginate',
            template: '<a href="#" ng-click="pager.nextPage()" ng-class="{disabled: pager.isLastPage()}" class="yo-icon-right-gate"></a>',
        };
    }]);

    module.directive('yoPagingInfo', [function() {
        return {
            restrict: 'AE',
            replace: true,
            require: '^paginate',
            template: ' <span class="text">Displaying {{pager.pageStart()}} to {{pager.pageEnd()}} of {{pager.items.length}}</span>',
        };
    }]);

    module.directive('yoPagingCtrl', [function() {
        return {
            restrict: 'AE',
            replace: true,
            require: '^paginate',
            template: pagingCtrlTmpl,
        };
    }]);
});