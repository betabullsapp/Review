define(
    [
        'bootstrap/module',
        'bootstrap/lib/plugins/text!../template/yo-form.html', 
        'bootstrap/lib/plugins/text!../template/yo-form-field.html', 
        'bootstrap/lib/plugins/text!../template/yo-form-footer.html',
        'bootstrap/lib/plugins/text!../template/yo-form-fieldset.html',
        'bootstrap/lib/plugins/css!../css/form.css'
    ], 
    function(
        yoBootstrap, 
        yoFormTpl, 
        yoFormFieldTpl,
        yoFormFooterTpl,
        yoFormFieldsetTpl
    ) {
        'use strict';
        yoBootstrap.directive('yoForm', function() {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: yoFormTpl,
                controller: ['$scope', function($scope){
                    var formfields = [];
                    
                    this.addFormfield = function(validateField){
                        formfields.push(validateField);
                    };

                    this.validateForm = function($element){
                        var formValidity = true;
                        var invalidFields = [];

                        angular.forEach(formfields, function(value, key){
                            if (!value()){
                                formValidity = false;
                                //console.log(value);
                                invalidFields.push(value);
                            }
                        });

                        return formValidity;
                    };
                }]
            };
        })
        .directive('yoFormField', function() {
            return {
                require: '?^yoForm',
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: yoFormFieldTpl,
                scope: {
                    label: '@yoLabel',
                    info: '@yoInfo',
                    error: '@yoError'
                },
                controller: ['$scope', function($scope) {
                    this.setValidationError = function(error) {
                        $scope.validationError = error;
                        $scope.$digest();
                    };
                }],
                link: function($scope, $element, $attr, controller) {
                    // Add add required to scope if element is required
                    $scope.isRequiredField = $element.find('[required]').length > 0;
                    if ($scope.isRequiredField){
                        $scope.required = true;
                    }

                    var $field = $element.find('input, select, textarea');
                    $scope.fieldType = getInputType();

                    function getInputType() {
                        var inputType = $field[0] ? $field[0].tagName.toLowerCase() : '';
                        if (inputType === 'input') {
                            inputType = $field.data('inputType') ? $field.data('inputType') : $field.prop('type');
                        }
                        return inputType;
                    }

                    $scope.$watch(function(){
                        return $element.find('[disabled]').length > 0;
                    }, function(newValue, oldValue){
                        $scope.isDisabledField = newValue;
                    });

                    // Select Fields
                    var $select = $element.find("select");
                    $scope.isSelectField = $select.length > 0;
                    if (!$scope.isSelectField) {
                        return;
                    }

                    var $fieldWrapper = $element.find(".field-wrapper");
                    var $selectOption = $element.append("<div class='select-option'></div>").find(".select-option");
                    $fieldWrapper.append($selectOption);

                    function updateSelectOption() {
                        var $selectedOption = $fieldWrapper.find('select option:selected');
                        if ($selectedOption.length === 0) {
                            $selectedOption = $fieldWrapper.find('select option').eq(0);
                        }
                        $selectOption.text($selectedOption.text());
                    }

                    function getOptionsValue() {
                        return $select.val();
                    }

                    $scope.$watch(getOptionsValue, function(newVal, oldVal){
                        updateSelectOption();
                    });
                }
            };
        })
        .directive('yoFormFooter', function() {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: yoFormFooterTpl,
                scope: true
            };
        })
        .directive('yoFormFieldset', function() {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                template: yoFormFieldsetTpl,
                scope: {
                    label: '@yoLabel',
                    info: '@yoInfo',
                    error: '@yoError'
                },
                controller: ['$scope', function($scope) {
                    this.setValidationError = function(error) {
                        $scope.validationError = error;
                        $scope.$digest();
                    };
                }],
                link: function($scope, $element, $attr) {
                    // Add add required to scope if element is required
                    $scope.isRequiredField = $element.find('input:required').length > 0;
                    if ($scope.isRequiredField){
                        $scope.required = true;
                    }

                    // Automatically add disabled class to parent-wrap of each disabled radio/checkbox. 
                    // * This allows the user to avoid having to add disabled class manually
                    $scope.$watch(function(){
                        return $element.find('input:disabled').length;
                    }, function(newValue, oldValue){
                        $element.find('.radio, .checkbox').each(function(){
                            if ($(this).children('label').find('[disabled]').length){
                                $(this).attr('disabled', '');
                            } else {
                                $(this).removeAttr('disabled');
                            }
                        });
                    });
                }
            };
        });
    }
);