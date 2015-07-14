define(['angular', 'bootstrap/module'], function(angular, yoBootstrap) {
    'use strict';
    var EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    var INTEGER_REGEX = /^\-?(\d+)$/;
    var DOLLAR_INT_REGEX = /^\$?(\d+)$/;
    var NUMBER_REGEX = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    var PHONE_REGEX = /^\s*1?( |-|\.)?\(?[2-9]{1}[0-9]{2}\)?( |-|\.)?[0-9]{3}( |-|\.)?[0-9]{4}\s*$/;
    var URL_REGEX = /^((http|https|ftp):\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/.*)*$/;
    var ZIP_REGEX = /^\d{5}([\-]\d{4})?$/;

    var validations = [
        function($element, value, tag) { // required
            if (typeof $element.attr('required') !== 'undefined') {
                var type = $element.attr('type');
                if (type === 'radio' || type === 'checkbox') {
                    var name = $element.attr('name');
                    var selected = $('input[name="' + name + '"]:checked');
                    return selected.size() === 0 ? 'Required.' : null;
                }
                else {
                    return value === '' ? 'Required.' : null;
                }
            }
            return null;
        },
        function($element, value, tag) { // data-input-type
            var type = $element.data('input-type') ? $element.data('input-type') : $element.prop('type');
            if (typeof type === 'undefined') {
                return null;
            }
            if (value === "") {
                return null;
            } else if (type === 'email') {
                return EMAIL_REGEX.test(value) ? null : 'Invalid email address.';
            } else if (type === 'integer') {
                return INTEGER_REGEX.test(value) ? null : 'Invalid integer.';
            } else if (type === 'number') {
                return NUMBER_REGEX.test(value) ? null : 'Invalid number.';
            } else if (type === 'dollar-integer') {
                return DOLLAR_INT_REGEX.test(value) ? null : 'Invalid dollar amount.';
            } else if (type === 'tel') {
                return PHONE_REGEX.test(value) ? null : 'Invalid phone number.';
            } else if (type === 'url') {
                return URL_REGEX.test(value) ? null : 'Invalid web URL.';
            } else if (type === 'zip') {
                return ZIP_REGEX.test(value) ? null : 'Invalid zip code.';
            }
            return null;
        }
    ];

    function trim(object) {
        return (typeof object === 'string')  ? $.trim(object) : "";
    }
    
    function validate($element, tag, controller) {
        var value = trim($element.val());
        var message = null;
        for(var i = 0; i < validations.length; i++) {
            message = validations[i]($element, value, tag);
            if (message !== null) {
                break;
            }
        }
        if (controller){
            controller.setValidationError(message);
        }

        // Temporary Solution until we refactor css to support this ----------
        var $fieldWrap = $element.closest('.yv-formfield');
        var $fieldCaption = $fieldWrap.find('.fieldCaption:visible');
        if (message !== null && $fieldCaption.length){
            var msgHeight = $fieldWrap.find('.fieldCaption').height() + 7;
            $fieldWrap.css('padding-bottom', msgHeight);
        } else {
            $fieldWrap.css('padding-bottom', '');
        }
        // ----------

        return (message === null || !$element.is(':visible') );
    }

    function bind($element, $timeout, controller) {
        // The attributes of a form element may change on the page.  For example, the required
        // attribute may be added as a result of some other input change.  As a result, we need
        // to check whether we should apply the validation, and then apply the validation every
        // time.
        var tag = $element.prop('nodeName').toLowerCase();
        var promise = null;
        function validator() {
            if (promise !== null) {
                $timeout.cancel(promise);
                promise = null;
            }
            validate($element, tag, controller);
        }
        function deferValidator() {
            if (promise === null) {
                promise = $timeout(validator, 500);
            }
        }
        $element.on('blur', function(){
            $(this).closest('.yv-formfield').removeClass('focus');
            validator();
        });
        $element.on('change keyup', function() {
            if (tag === 'select') {
                validator();
            } else {
                deferValidator();
            }
        });
        $element.on('focus', function(){
            $(this).closest('.yv-formfield').addClass('focus');
        });
    }

    function isSupportedElement($element) {
        var tag = $element.prop('nodeName').toLowerCase();
        if (tag === 'select' || tag === 'textarea') {
            return true;
        } else if (tag === 'input') {
            var type = $element.attr('type');
            if (type === 'submit' || type === 'button' || type === 'hidden') {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    var directive = ['$timeout', function($timeout) {
        return {
            require: ['?^yoForm', '?^yoFormField', '?^yoFormFieldset'],
            restrict: 'E',
            link: function($scope, $element, $attr, ctrls) {
                var yoFormCtrl = ctrls[0] !== undefined ? ctrls[0] : '';
                var yoFormFieldCtrl = ctrls[1] || ctrls[2];

                if (yoFormFieldCtrl && isSupportedElement($element)) {
                    bind($element, $timeout, yoFormFieldCtrl);
                }
                
                if (yoFormCtrl !== ""){
                    yoFormCtrl.addFormfield(function() {
                        return validate($element, $element.prop('nodeName').toLowerCase(), yoFormFieldCtrl);
                    });
                }

            }
        };
    }];

    yoBootstrap.directive('input', directive);
    yoBootstrap.directive('textarea', directive);
    yoBootstrap.directive('select', directive);

    yoBootstrap.directive('yoFormSubmit', function(){
        return {
            require: '^yoForm',
            restrict: 'AE',
            link: function($scope, $element, $attr, ctrl) {
                $element.on('submit', function(evt){

                    var isFormValid = ctrl.validateForm($element);
                    
                    if (!isFormValid){
                        evt.preventDefault();
                        // If not visible, scroll to first invalid field and focus on it. 
                        var $firstInvalidField = $(this).find('.yv-formfield.invalid').eq(0);
                        
                        if (elementIsVisible($firstInvalidField)){
                            $('html,body').animate({scrollTop: $firstInvalidField.offset().top - 50}, 300, function(){
                                $firstInvalidField.eq(0).find('input').eq(0).focus();
                            });
                        }
                    } else {
                        if($attr.yoFormSubmit){
                            $scope.$apply($attr.yoFormSubmit);
                        }
                    }
                });

                // Checks to see if element is within the viewport (visible on the screen)... 
                // NOTE: This is different than the jquery :visible selector.
                function elementIsVisible($element){
                    var windowTop = $(window).scrollTop();
                    var windowBottom = windowTop + $(window).height();
                    var elementTop = $element.offset().top;

                    return (elementTop < windowTop || elementTop > windowBottom);
                }

            }
        };
    });
});