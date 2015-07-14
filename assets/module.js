define(['angular',
        'bootstrap/components/loading/angular-busy-wrapped',
        'bootstrap/components/dropdown/js/yo-dropdown',
        'bootstrap/components/popover/js/yo-popover',
        'bootstrap/components/datepicker/js/yo-datepicker',
        'bootstrap/components/fuzzy-search/js/yo-fuzzy-search',
        'bootstrap/lib/plugins/css!bootstrap/lib/bower-components/bootstrap/dist/css/bootstrap.min.css?priority=100',
        'bootstrap/lib/plugins/css!bootstrap/layout/structure.css?priority=98',
        'bootstrap/lib/plugins/css!bootstrap/layout/core.css?priority=97'], function(angular) {
    return angular.module('yoBootstrap', ['cgBusyWrapped', 'uiDropdownWrapped', 'uiPopoverWrapped', 'ngTagsInputWrapped', 'uiDatepickerWrapped']);
});