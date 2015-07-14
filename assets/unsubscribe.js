define(['listing/module'], function (app) {

    app.service("UnsubscribeService", ["$http", function ($http) {
        var unsubscribe = function (request) {
            var promise = $http({
                url: '/api/unsubscribe',
                method: 'POST',
                data: $.param({
                    businessId: request.businessId,
                    email: request.email
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            return promise;
        };

        return {
            unsubscribe: unsubscribe
        };
    }]);
});
