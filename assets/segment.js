define(['directory/module'], function(app) {

    app.controller(
            "SegmentCtrl", ["$scope", "DirectoryService", "Page",
                function ($scope, DirectoryService, Page) {
                    Page.setTitle("Categories - RateABiz");

                    DirectoryService.getAllSegments().then(function(resp){
                        $scope.segments = resp.data;
                    });

                }]);
      
      ///////////////////////          
      app.filter('firstLetterFilter', [function () {
        return function(list) {
          var firstLetters = [];
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var firstLetter = item.charAt(0).toUpperCase();
            if (firstLetters.indexOf(firstLetter) === -1) {
              firstLetters.push(firstLetter);
            }
          };
          return firstLetters;
        }
      }]);
});