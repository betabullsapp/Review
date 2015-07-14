define(
    [
        'bootstrap/module'
    ],
    function(yoBootstrap) {
        'use strict';
        yoBootstrap.service("numberUtils", [function() {
            var self = this;

            /**
             * Returns the order of magnitude of the given number (e.g. 10 -> 1, 100 ->2, etc).
             */
            this.getOrderOfMagnitude = function(number) {
                number = Math.abs(number);

                function loop(number, acc) {
                    if (number >= 10) {
                        return loop(number / 10, acc + 1);
                    }
                    else {
                        return acc;
                    }
                }

                return loop(number, 0);
            };

            this.isNumber = function(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            };

            this.smartQuotient = function(numer, denom) {
                var quotient = 0;
                if (denom !== 0) {
                    quotient = numer / denom;
                }
                return quotient;
            };
            
        }]);
    }
);
