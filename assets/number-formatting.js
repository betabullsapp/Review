/**
    IMPORTANT! READ THIS BEFORE ADDING/MODIFYING THIS MODULE.

    Because javascript is not typed and you can pass anything into these methods,
    we need protect against bad input. All of these functions need to return the input
    unchanged if it cannot be parsed into a number.

    Because all these methods deal with formatting, their outputs will be immediately
    visible on screen. We don't want bugs like YC-34451 that just takes undefined, turns
    it into a string and adds commas into it and have that be printed to the screen.

    For example:
    undefined -> undefined
    null -> null
    false -> false
    [Date] -> [Date]
    {} -> {}
    [] -> []
    '' -> ''
    'abc' -> 'abc'
    '734.234.343' -> '734.234.343'
    NaN -> NaN
    Inf -> Inf

    ONLY INPUT THAT CAN BE PARSED INTO NUMBERS SHOULD BE TRANSFORMED!

    A simple way to achieve that is use the following template for new number formatting
    methods:

    this.formatNumberSomehow = function(number) {
        return doIfValidNumber(number, function(n) {
            var formattingResult = ...

            ... do formatting using n ...

            return formattingResult;
        });
    }
*/
define(
    [
        'bootstrap/module'
    ],
    function(yoBootstrap) {
        'use strict';
        var numberFormatUtils = function(numberUtils) {
            var self = this;

            var MILLION_PLACES = 6;
            var THOUSAND_PLACES = 3;
            var HUNDRED_PLACE = 2;

            var powerMap = {
                1: "k",
                2: "m",
                3: "b"
            };

            function doIfValidNumber(input, f) {
                if (typeof input === 'object') {
                    return input;
                }

                var num = parseFloat(input);
                if (!numberUtils.isNumber(num)) {
                    return input;
                }

                return f(num);
            }

            /**
             * Copied from http://stackoverflow.com/questions/9318674/javascript-number-currency-formatting
             * With the currency symbol added
             */
            function formatMoney(number, currencySymbol, decPlaces, thouSeparator, decSeparator) {
                var n = number;
                var formattedDecPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
                var formattedDecSeparator = decSeparator === undefined ? "." : decSeparator;
                var formattedThouSeparator = thouSeparator === undefined ? "," : thouSeparator;
                var sign = n < 0 ? "-" : "";
                var i = parseInt(n = Math.abs(+n || 0).toFixed(formattedDecPlaces)) + "";
                var j = (j = i.length) > 3 ? j % 3 : 0;

                return sign + currencySymbol + (j ? i.substr(0, j) + formattedThouSeparator : "") + 
                    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + formattedThouSeparator) + 
                    (formattedDecPlaces ? formattedDecSeparator + Math.abs(n - i).toFixed(formattedDecPlaces).slice(2) : "");
            }

            function removeTrailingZeros(str) {
                var trailingZerosRegex = /0*$/;
                return str.replace(trailingZerosRegex, "");
            }

            /**
             * Examples with 2 decimal digits:
             *  1234 -> 1234
             *  100 -> 100
             *  100.9 -> 100
             *  1 -> 1
             *  1.00001 -> 1
             *  1.01 -> 1.01
             *  1.019 -> 1.01
             *  10.1 -> 10.1
             */
            function formatWithAtMostXDecimalDigits(number, decimalDigitsAllowed) {
                var isNegative = (number < 0);
                number = Math.abs(number);
                var truncatedSplitStrings = number.toString().split(".");
                var truncatedIntStr = Math.floor(number).toString();
                var truncatedDecimalStr = "";
                if (truncatedSplitStrings.length > 1) {
                    truncatedDecimalStr = truncatedSplitStrings[1];
                }

                var displayDecimals = "";
                if (truncatedIntStr.length < 3) {
                    var rawDecimal = truncatedDecimalStr.substr(0, decimalDigitsAllowed);
                    displayDecimals = removeTrailingZeros(rawDecimal);
                }

                if (isNegative) {
                    truncatedIntStr = "-" + truncatedIntStr;
                }

                if (displayDecimals !== "") {
                    return truncatedIntStr + "." + displayDecimals;
                }
                return truncatedIntStr;
            }

            /**
             Formatting per Yodle brand standards for currency formatting
             http://brandstandards.yodle.com/editorial-standards/numbers/dashboard-number-formatting/
             */
            function abbreviateNumber(number) {
                return doIfValidNumber(number, function(n) {
                    if (n < 0) {
                        return formatWithAtMostXDecimalDigits(n, 1);
                    }

                    var orderOfMagnitude = numberUtils.getOrderOfMagnitude(n);
                    
                    if (orderOfMagnitude < THOUSAND_PLACES) {
                        return formatWithAtMostXDecimalDigits(n, 1);
                    }
                    else if (orderOfMagnitude === THOUSAND_PLACES) {
                        return self.formatIntWithCommas(n);
                    }
                    else {
                        var power = Math.floor(orderOfMagnitude / THOUSAND_PLACES);
                        var truncated = n / Math.pow(10, 3 * power);
                        var displaySuffix = powerMap[power];
                        var formattedNumber = formatWithAtMostXDecimalDigits(truncated, 1);
                        if (orderOfMagnitude >= MILLION_PLACES) {
                            formattedNumber = formatWithAtMostXDecimalDigits(truncated, 2);
                        }
                        return formattedNumber + displaySuffix;
                    }
                });

            }

            /**
             Formatting per Yodle brand standards for currency formatting
             http://brandstandards.yodle.com/editorial-standards/numbers/dashboard-number-formatting/
             */
            function abbreviateCurrency(number, currencySymbol) {
                return doIfValidNumber(number, function(n) {
                    var formattedCurrencySymbol = (typeof currencySymbol === 'undefined') ? '$' : currencySymbol;
                    var num = n.toFixed(2).split('.');
                    var cents = parseInt(num[1]);
                    var dollars = parseInt(num[0]);
                    var wholeDollars = dollars + (cents >= 50 ? 1 : 0);
                    if (dollars < 100) {
                        return formatMoney(n, formattedCurrencySymbol, 2, ',', '.');
                    }
                    else if (wholeDollars < 1000) {
                        return formattedCurrencySymbol + wholeDollars;
                    }
                    else if (wholeDollars < 10000) {
                        // 1000 - 9999
                        var s = wholeDollars.toString();
                        var thousands = s.slice(0, 1);
                        var hundreds = s.slice(1, 2);
                        var result = thousands;
                        if (hundreds !== "0") {
                            result += '.' + hundreds;
                        }
                        return formattedCurrencySymbol + result + powerMap[1];
                    }
                    else {
                        return formattedCurrencySymbol + abbreviateNumber(wholeDollars);
                    }
                });
            }

            this.abbreviateNumber = function(number) {
                return abbreviateNumber(number);
            };


            this.abbreviateCurrency = function(number, currencySymbol) {
                return abbreviateCurrency(number, currencySymbol);
            };

            this.abbreviateCurrencyCents = function(numberCents, currencySymbol) {
                return doIfValidNumber(numberCents, function(n) {
                    return abbreviateCurrency(n/100, currencySymbol);
                });
            };

            this.formatIntWithCommas = function(number) {
                return doIfValidNumber(number, function(n) {
                    return formatMoney(n, '', 0, ',', '.');
                });
            };

            /**
             * Turns a number into a percentage. Any input that's not a string or number,
             * will be returned as is. If we can't parse the string, return the string as is.
             * All percents are returned with 3 digits of precision except when the decimal
             * places are only 0's.
             * 
             * 0 => 0%
             * 0.1 => 10%
             * 0.12 => 12%
             * 0.129 => 12.9%
             * 0.1297 => 13%
             * 1.23 => 123%
             * 1.239 => 123%
             */
            this.formatRateAsPercent = function(input) {
                return doIfValidNumber(input, function(num) {
                    return formatWithAtMostXDecimalDigits(num * 100, 1) + '%';
                });
            };

            this.formatPercent = function(input) {
                return doIfValidNumber(input, function(num) {
                    return formatWithAtMostXDecimalDigits(num, 1) + '%';
                });
            };

            this.formatSecondsAsDuration = function(totalSeconds) {
                return doIfValidNumber(totalSeconds, function(n) {
                    var secondsPart = Math.floor(n % 60);
                    var minutesPart = Math.floor(n / 60);

                    var durationMinutePart = minutesPart.toString();
                    if (minutesPart < 10) {
                        durationMinutePart = '0' + minutesPart.toString();
                    }

                    var durationSecondPart = secondsPart.toString();
                    if (secondsPart < 10) {
                        durationSecondPart = '0' + secondsPart.toString();
                    }

                    return durationMinutePart + ":" + durationSecondPart;
                });
            };
        };
        yoBootstrap.service("numberFormattingUtils", ['numberUtils', numberFormatUtils]);

        return numberFormatUtils;
    }
);
