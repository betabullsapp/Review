window.rateabiz = window.rateabiz || {};
window.rateabiz.ui = window.rateabiz.ui || {};
window.rateabiz.ui.validation = (function ($) {

    /////////////////////////////////
    // Private methods and functions
    /////////////////////////////////

    var SUPPORTED_FIELDS = 'input:not("[type=submit], [type=button]"):visible, textarea:visible, select:visible, input[name=rating]';
    var VALIDATOR_TYPE_FUNCTIONS = {
        'email' : function($field) {
            var fieldValue = $field.val();
            var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage : 'Invalid email address.'
            };
        },
        'tel' : function($field) {
            var fieldValue = $field.val();
            var pattern = new RegExp(/^\s*1?( |-|\.)?\(?[2-9]{1}[0-9]{2}\)?( |-|\.)?[0-9]{3}( |-|\.)?[0-9]{4}\s*$/);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage :  'Invalid phone number.'
            };
        },
        'url' : function($field) {
            var fieldValue = $field.val();
            var pattern = new RegExp(/^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/.*)*$/);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage :  'Invalid web URL.'
            };
        },
        'zip' : function($field) {
            var fieldValue = $field.val();
            var pattern = new RegExp(/^\d{5}([\-]\d{4})?$/);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage : 'Invalid zip code.'
            };
        },
        'number' : function($field) {
            var fieldValue = $field.val();
            var pattern =  new RegExp(/^\-?((\d+)|(\d*\.\d+))$/);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage : 'Invalid number.'
            };
        },
        'integer' : function($field) {
            var fieldValue = $field.val();
            var pattern =  new RegExp(/^\-?(\d+)$/);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage : 'Invalid integer.'
            };
        },
        'custom' : function($field) {
            var fieldValue = $field.val();
            var fieldPattern = $field.attr('pattern').replace(/\/$/, '').replace(/^[\/]|\/$/, '');
            var pattern = new RegExp(fieldPattern);
            return {
                isValid : pattern.test(fieldValue),
                invalidMessage : getCustomMessage($field)
            };
        },
        'password' : function($field) {
            return validatePassword($field);
        }
    };

    function validatePassword($field) {
        var fieldValue = $field.val();
        var error;
        if (fieldValue.length < 6) {
            error = "Password must be at least 6 characters long.";
        } else if (new RegExp(/.*\s+.*/).test(fieldValue)) {
            error = "Password must not contain spaces.";
        } else if (!new RegExp(/.*\d+.*/).test(fieldValue)) {
            error = "Password must contain at least one number.";
        } else if (!new RegExp(/.*[a-zA-Z]+.*/).test(fieldValue)) {
            error = "Password must contain at least one letter.";
        }

        return {
            isValid : !error,
            invalidMessage : error
        }
    }

    function getCustomMessage($field) {
        var invalidMessage = $field.data('invalidMessage');
        if (invalidMessage) {
            return invalidMessage;
        } else {
            return "Invalid entry.";
        }
    }

    // Returns the field's type. (i.e. select, email, checkbox, textarea, etc.)
    function findFieldType($field) {
        var elementType;
        var fieldPattern = $field.prop('pattern');

        if (($field).is('select')) {
            elementType = 'select';
        } else if ($field.data('inputType')){
            elementType = dataInputTypeFallback($field.data('inputType'));
        } else if (fieldPattern){
            elementType = 'custom';
        } else {
            elementType = $field.prop('type');
        }

        return elementType;
    }

    // Defaults data-input-type to text if system does not support/recognize the specified type (This is the default action for regular input type attribute)
    function dataInputTypeFallback(elementType) {
        var elementIsSupported = (VALIDATOR_TYPE_FUNCTIONS).hasOwnProperty(elementType);

        if (!elementIsSupported){
            elementType = 'text';
        }

        return elementType;
    }

    // Displays helper text
    function showHelperText($field) {
        var helperText = $field.data('helperText');

        window.rateabiz.ui.formfields.captionMessage($field, 'helperText', helperText);
    }

    // Removes leading and excess space from string and returns value
    function trimStringVal(string){
        var trimmedVal = $.trim(string);
        return trimmedVal;
    }

    // Initiate field events
    function initFieldEvents($form) {
        var timer;

        $form.on('focus', SUPPORTED_FIELDS, function(){
            var $this = $(this).not('select');
            var helperText = $this.data('helperText');

            // If field has helpertext and is not valid
            if (helperText && fieldIsEmpty($this)) {
                showHelperText($this);
            }
        }); // everything

        $form.on('blur', SUPPORTED_FIELDS, function(){
            var $this = $(this).not('[readonly]');

            clearTimeout(timer); // Clear Timer for keyup event

            validateField($this);

            $this.parents('.yv-formfield').removeClass('focus');
        });

        $form.on('change', SUPPORTED_FIELDS, function (){
            var $this = $(this);
            var fieldValue = trimStringVal($this.val()); // Field value without the leading and ending spaces

            clearTimeout(timer); // Clear timer for keyup event

            // Validate field on change, when field is not empty or when field is a select field.
            if (!fieldIsEmpty($this) || findFieldType($this) === 'checkbox' || findFieldType($this) === 'select') {
                validateField($this);
            }
        });

        $form.on('keyup', SUPPORTED_FIELDS, function() {
            var $this = $(this);
            var helperText = $this.data('helperText');
            var fieldValue = trimStringVal($this.val()); // Field value without the leading and ending spaces

            clearTimeout(timer); // Clear Timer

            if (helperText && fieldIsEmpty($this)) {
                showHelperText($this);
            } else {
                timer = setTimeout(function() {
                    if(!fieldIsEmpty($this)){
                        validateField($this);
                    }
                }, 500);
            }
        });
    }

    // Checks if field (entered as the parameter) is empty.
    function fieldIsEmpty($field) {
        var fieldType = findFieldType($field);
        var fieldValue = trimStringVal($field.val());
        var fieldName = $field.attr('name');
        var fieldIsSelected = $field.parents('.yv-formfield').find('input:checked').length;

        // If field is of type radio or checkbox and empty
        if ((fieldType === 'radio' || fieldType === 'checkbox') && !(fieldIsSelected)) {
            return true;
        } else if (fieldName === 'rating' && fieldValue === '0') {
            return true;
        } else if (fieldValue === '') {
            return true;
        } else {
            return false;
        }
    }

    // Checks if field is required
    function fieldIsRequired($field) {
        var status = $field.attr('required');

        if (findFieldType($field) === 'checkbox' || findFieldType($field) === 'radio') {
            status = $field.parents('.yv-formfield').find('input').attr('required');
        }

        return status;
    }

    // Validates Field === Returns false if invalid, and true if valid
    function validateField($field) {
        var disabled = $field.parents('.yv-formfield').find('input, select, textarea').prop('disabled');
        var fieldType = findFieldType($field);
        var validator = VALIDATOR_TYPE_FUNCTIONS[fieldType];
        var customValidationFunctions = getCustomValidationFunctions($field);

        // === Required and empty === //
        if (fieldIsRequired($field) && fieldIsEmpty($field) && !disabled) {
            window.rateabiz.ui.formfields.captionMessage($field, 'invalid', 'Required.');
            return false;
        }
        // === Field is invalid === //
        if (!fieldIsEmpty($field) && validator) {
            var validationResult = validator($field);
            if (!validationResult.isValid) {
                window.rateabiz.ui.formfields.captionMessage($field, 'invalid', validationResult.invalidMessage);
                return false;
            }
        }
        if (!fieldIsEmpty($field) && customValidationFunctions.length > 0) {
            for (var i in customValidationFunctions) {
                var fn = customValidationFunctions[i];
                var validationResult = fn($field);
                if (validationResult.isValid === undefined) {
                    console.log('Validation result: ' + JSON.stringify(validationResult) + ' is not of the form: {isValid:[true/false], invalidMessage:[message when fail]}')
                }
                else if (validationResult.isValid === false) {
                    var msg = 'Invalid.';
                    if (validationResult.invalidMessage) {
                        msg = validationResult.invalidMessage;
                    }
                    window.rateabiz.ui.formfields.captionMessage($field, 'invalid', msg);
                    return false;
                }
            }
        }

        // === Field is valid === //
        // === Blank field that's not required === //
        window.rateabiz.ui.formfields.captionMessage($field, $field.data('external-validation'));
        return true;
    }

    function getCustomValidationFunctions($field) {
        var fns = [];
        var rawAttr = $field.data('customValidationFunctions');
        if (rawAttr) {
            var fnStrings = $field.data('customValidationFunctions').split(' ');
            $.each(fnStrings, function(i, v) {
                var fn = window[v];
                if (typeof(fn) == 'function') {
                    fns.push(fn);
                }
                else {
                    console.log('No function named: ' + v + ' was found. Will not be calling it.');
                }
            })
        }
        return fns;
    }

    // Initialize on submit event
    function initOnSubmit($form, callback){
        $form.on('submit', function (evt) {
            var $this = $(this);

            // If at least one field on the form is invalid
            if (!validateForm($this)) {
                evt.preventDefault();
                evt.stopImmediatePropagation();

                // If not visible, scroll to first invalid field and focus on it.
                var $firstInvalidField = $this.find('.yv-formfield.invalid').eq(0);

                if (elementIsVisible($firstInvalidField)){
                    $('html,body').animate({scrollTop: $firstInvalidField.offset().top - 50}, 300, function(){
                        $firstInvalidField.eq(0).find('input').eq(0).focus();
                    });
                }

            } else if (callback !== undefined) {
                return callback();
            }
        });
    }

    // Checks to see if element is within the viewport (visible on the screen)... NOTE: This is different than the jquery :visible selector.
    function elementIsVisible($element){
        var windowTop = $(window).scrollTop();
        var windowBottom = windowTop + $(window).height();
        var elementTop = $element.offset().top;

        return (elementTop < windowTop || elementTop > windowBottom);
    }

    // Initialize on reset event
    function initOnReset($form){
        $form.on('reset', function () {
            var $form = $(this);
            var $fields = getSupportedFields($form);

            setTimeout(function(){
                window.rateabiz.ui.formfields.captionMessage($fields);
            });
        });
    }

    function validateForm($form) {
        var $fields = getSupportedFields($form);
        var submit = true;

        $fields.each(function(){
            var $this = $(this);

            if (!validateField($this)){
                submit = false;
            }
        });

        return submit;
    }

    function getSupportedFields($form) {
        return $form.find(SUPPORTED_FIELDS);
    }

    /////////////////////////////////
    // Public methods and functions
    /////////////////////////////////
    return {
        // Initializes the function. Receives form id, as well as a callback if it is defined.
        init : function (selector, onValidatedSubmitCallback) {
            var $form;
            // Search for form within the selector
            if ($(selector).is('form')){
                $form = $(selector);
            } else {
                $form = $(selector).find('form');
            }

            // Format Fields
            window.rateabiz.ui.formfields.format($form, 'validate');

            // Initialize field events
            initFieldEvents($form);

            // Initialize on submit;
            initOnSubmit($form, onValidatedSubmitCallback);

            // Initialize on reset;
            initOnReset($form);
        },
        validateField : validateField
    };
})(jQuery);
