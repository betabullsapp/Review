define(['listing/module'], function (app) {

    app.service("ContactService", ["$http", function ($http) {
        var submitMessage = function(message) {
            var promise = $http({
                url: '/api/sendMessage',
                method: 'POST',
                data: {
                    businessId: message.businessId,
                    name: message.name,
                    email: message.email,
                    phone: message.phone,
                    message: message.message
                }
            });
            return promise;
        };

        return {
            submitMessage: submitMessage
        };
    }]);
});


