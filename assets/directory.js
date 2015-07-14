define(['directory/module'], function(app) {

    app.service("DirectoryService", ["$http", function ($http) {

        var getListingsForSegment = function(segment, isPreview) {
            var baseUrl = isPreview ? '/api/getPreviewListingsForSegment/' : '/api/getListingsForSegment/';
            var promise = $http({
               url: baseUrl + segment,
               method: 'GET'
			});
			return promise;
        };

        var getAllSegments = function(){
            var promise = $http({
                url: '/api/getAllSegments',
                params: {},
                method: 'GET'
            });
            return promise;
        };

        return {
            getAllSegments : getAllSegments,
            getListingsForSegment : getListingsForSegment
        };
    }]);
});
