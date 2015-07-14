define(['listing/module'], function (app) {

    app.service("BusinessService", ["$http", function ($http) {
        var getBusiness = function (businessId) {
                var promise = $http({
                    url: '/api/getBusiness/' + businessId,
                    method: 'GET'
                });
                return promise;
            };

        return {
            getBusiness: getBusiness
        };
    }]);
});

