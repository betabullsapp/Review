requirejs.config({
  shim: {
    'bootstrap/lib/bower-components/angular-busy/angular-busy': ['angular']
  }
});

define([
  'angular',
  'bootstrap/lib/plugins/text!bootstrap/components/loading/templates/loading-overlay.html',
  'bootstrap/lib/bower-components/angular-busy/angular-busy',
  'bootstrap/lib/plugins/css!bootstrap/components/loading/css/loading-animations.css',
  'bootstrap/lib/plugins/css!bootstrap/lib/bower-components/angular-busy/angular-busy.css'
], function(angular, ngBusyTmpl) {
  "use strict";
  var module = angular.module('cgBusyWrapped', ['cgBusy']);

  module.run(['$templateCache', function($templateCache) {
    $templateCache.put('angular-busy.html', ngBusyTmpl);
  }]);

  return module;
});
