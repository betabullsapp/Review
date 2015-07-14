define([
    'common/module'
], function(app) {
    return app.filter('phone', [function() {
        return function (phone) {
            if (!phone) {
                return '';
            }

            var value = $.trim(phone.toString());

            // If the phone number already has formatting, keep it.
            if (value.match(/[^0-9]/)) {
                return phone;
            }

            // Handle 10-digit numbers for now, returning the value passed if it is not 10 digits.
            if (value.length != 10) {
                return phone;
            }

            var areaCode = value.slice(0, 3);  // XXXxxxxxxx
            var prefix = value.slice(3, 6);    // xxxXXXxxxx
            var number = value.slice(6);       // xxxxxxXXXX

            return areaCode + "-" + prefix + "-" + number;
        };
    }]);
});