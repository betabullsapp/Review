define(
    [
        'angular',
        'bootstrap/module',
        'bootstrap/lib/plugins/text!../templates/yo-event-feed-content.html',
        'bootstrap/lib/plugins/text!../templates/yo-event-feed-group.html',
        'bootstrap/lib/plugins/css!../css/event-feed.css'
    ],
    function (angular, yoBootstrap, yoEventFeedContentTemplate, yoEventFeedGroupTemplate) {
        //Includes the sidebar block.
        'use strict';
        yoBootstrap
          //Wraps the entire group of events
          .directive('yoEventFeedGroup', function () {
            return {
              restrict: 'AE',
              transclude: true,
              replace: true,
              template: yoEventFeedGroupTemplate
            };
          })
          .directive('yoEventFeedItem', function () {
            //Wraps the content
            return {
              restrict: 'AE',
              transclude: true,
              replace: true,
              template: yoEventFeedContentTemplate,
              scope: {
                iconClass: "@yoFeedIconClass",
                title: "@yoFeedTitle",
                subTitle: "@yoFeedSubtitle"
              }
            };
          });
});