requirejs.config({
    shim: {
        'bootstrap/lib/bower-components/ng-tags-input/ng-tags-input': ['angular']
    }
});


define([
    'angular', 
    'bootstrap/lib/plugins/text!../template/yo-fuzzy-search.html', 
    'bootstrap/lib/bower-components/ng-tags-input/ng-tags-input',
    'bootstrap/lib/plugins/css!../css/fuzzy-search.css'
], function(angular, yoFuzzySearchTemplate) {
    "use strict";
    var module = angular.module('ngTagsInputWrapped', ['ngTagsInput']);

    var REGEX = {
        EMAIL_REGEX: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/
    };

    var KEYS = {
        backspace: 8,
        tab: 9,
        enter: 13,
        escape: 27,
        space: 32,
        up: 38,
        down: 40,
        comma: 188
    };

    module.config(["$provide", function($provide){
        $provide.decorator('tagsInputDirective', ["$delegate", "$controller", "$timeout", "tagsInputConfig", function($delegate, $controller, $timeout, tagsInputConfig){
            var directive = $delegate[0];

            /**
             * Decorate tagsInputDirective's scope
             * 
             * Added an expression to evaluate upon updating validation messages.
             * The message is available as $message
             * 
             */
            var scope = directive.scope;
            scope.updateMessage = '&';

            /**
             * Decorate tagsInputDirective's controller
             * 
             * Added extra variables to be loaded
             */
            var controllerName = directive.controller;
            directive.controller = ["$scope", "$attrs", "$element", function($scope, $attrs, $element) {
                angular.extend(this, $controller(controllerName, {$scope: $scope, $attrs: $attrs, $element: $element}));

                tagsInputConfig.load('tagsInput', $scope, $attrs, {
                    placeholder: [String, 'Add a tag'],
                    tabindex: [Number],
                    removeTagSymbol: [String, String.fromCharCode(215)],
                    replaceSpacesWithDashes: [Boolean, true],
                    minLength: [Number, 3],
                    maxLength: [Number],
                    addOnEnter: [Boolean, true],
                    addOnSpace: [Boolean, false],
                    addOnComma: [Boolean, true],
                    addOnBlur: [Boolean, true],
                    allowedTagsPattern: [RegExp, /.+/],
                    enableEditingLastTag: [Boolean, false],
                    minTags: [Number],
                    maxTags: [Number],
                    displayProperty: [String, 'text'],
                    allowLeftoverText: [Boolean, false],
                    addFromAutocompleteOnly: [Boolean, false],
                    /**
                     * Extra configuration variables
                     */
                    required: [Boolean, false],
                    allowedTagsType: [String, '']
                });

                this.setAutoCompleteVisibility = function(isVisible) {
                    $scope.isAutoCompleteVisible = isVisible;
                };
            }];

            /**
             * Decorate tagsInputDirective's link
             * 
             * Extended validation feature.
             */
            var link = directive.link;
            directive.compile = function() {
                return function(scope, element, attrs, ngModelCtrl) {
                    link.apply(this, arguments);

                    var events = scope.events,
                        tagList = scope.tagList,
                        options = scope.options,
                        errorMessage, validationKey;

                    var isValidInputText = function(inputText) {
                        if(options.allowedTagsType && options.allowedTagsType === "email" && !REGEX.EMAIL_REGEX.test(inputText)) {
                            validationKey = options.allowedTagsType;
                            errorMessage = "Invalid email address.";
                            return false;
                        }
                        else {
                            return true;
                        }
                    };

                    var isValidTagList = function() {
                        if (options.required && tagList.items.length===0) {
                            validationKey = "required";
                            errorMessage = "Required";
                            return false;
                        }
                        else {
                            return true;
                        }
                    };

                    var isUniqueTag= function(inputText) {
                        var array = tagList.items,
                            key = options.displayProperty,
                            tag = {};

                        tag[key] = inputText;

                        for (var i = 0; i < array.length; i++) {
                            if (array[i][key].toLowerCase() === tag[key].toLowerCase()) {
                                validationKey = "uniqueness";
                                errorMessage = "It's already added.";

                                return false;
                            }
                        }
                        return true;
                    };

                    var validateLastAddedTag = function() {
                        var lastIndex = tagList.items.length-1,
                            lastTagText = tagList.items[lastIndex][options.displayProperty];

                        if(!isValidInputText(lastTagText)) {
                            tagList.remove(lastIndex);
                            scope.newTag.text = lastTagText;
                            
                            scope.newTagChange();
                            scope.newTag.invalid = true;
                        }
                    };

                    events
                        .on('invalid-tags-input', function(){
                            ngModelCtrl.$setValidity(validationKey,false);
                            events.trigger('update-message', {$message: errorMessage});
                        })
                        .on('valid-tags-input', function(){
                            ngModelCtrl.$setValidity(validationKey, true);
                            events.trigger('update-message', {$message: ""});
                        })
                        .on('update-message', scope.updateMessage)
                        .on('input-typing', function(inputText) {
                            if(!scope.isAutoCompleteVisible) {
                                if(inputText==="" && scope.tags.length>0){
                                    if(isValidTagList()) {
                                        events.trigger('valid-tags-input');
                                    }
                                    else {
                                        events.trigger('invalid-tags-input');
                                    }
                                }
                                if(inputText) {
                                    if(isValidInputText(inputText)) {
                                        events.trigger('valid-tags-input');
                                    }
                                    else {
                                        events.trigger('invalid-tags-input');
                                    }
                                }
                            }
                        })
                        .on('input-leave', function(inputText) {
                            if(!scope.isAutoCompleteVisible) {
                                if(inputText===""){
                                    if (isValidTagList()){
                                        events.trigger('valid-tags-input');
                                    }
                                    else {
                                        events.trigger('invalid-tags-input');
                                    }
                                }
                                else if( isUniqueTag(inputText) && isValidInputText(inputText)) {

                                    tagList.addText(inputText);
                                    events.trigger('valid-tags-input');
                                }
                                else {
                                    events.trigger('invalid-tags-input');
                                }
                            }
                        });
                        
                    
                    var input = element.find('input');
                    input.on('keydown', function(e){
                        var key = e.keyCode,
                            addKeys = {},
                            newTagAdded;

                        addKeys[KEYS.enter] = options.addOnEnter;
                        addKeys[KEYS.comma] = options.addOnComma;
                        addKeys[KEYS.space] = options.addOnSpace;

                        newTagAdded = !options.addFromAutocompleteOnly && addKeys[key];

                        if(newTagAdded) {
                            validateLastAddedTag();
                        }
                    })
                    .on('blur', function(){
                        events.trigger('input-leave', scope.newTag.text);
                    });


                    var promise = null;
                    var inputValidator = function() {
                        if (promise!==null) {
                            $timeout.cancel(promise);
                            promise = null;
                        }
                        events.trigger('input-typing', scope.newTag.text);
                    };
                    var deferredValidator = function() {
                        if (promise === null) {
                            $timeout(inputValidator, 500);
                        }
                    };

                    scope.$watch('newTag.text', function(newValue, oldValue){
                        deferredValidator();
                    });
                };
            };

            return $delegate;

        }]);

        $provide.decorator('autoCompleteDirective', ["$delegate", "$controller", function($delegate, $controller){
            var directive = $delegate[0];

            /**
             * Decorate autoCompleteDirective's link
             * 
             * Added accessibility to autocompelete's display status.
             */
            var link = directive.link;
            directive.compile = function() {
                return function(scope, element, attrs, tagsInputCtrl) {
                    link.apply(this, arguments);

                    scope.$watch('suggestionList.visible', function(isVisible){
                        tagsInputCtrl.setAutoCompleteVisibility(isVisible);
                    });

                };
            };

            return $delegate;
        }]);
    }])
    .directive('yoFuzzySearch', function() {
        return {
            restrict: 'AE',
            template: yoFuzzySearchTemplate,
            replace: true,
            scope: {
                tags: '=yoTags',
                displayProperty: '@yoDisplayProperty',
                tagsType: '@yoTagsType',
                placeholder: '@placeholder',
                autoCompleteSrc: '&yoAutoCompleteSrc',
                maxResultsToShow: '@yoMaxResults'
            },
            link: function(scope, element){
                scope.autoCompleteSrc({
                    query: ''
                });

                scope.displayErrorMessage = function($message) {
                    scope.errorMessage = $message;
                };

                if(element.attr('required') === "required") {
                    scope.required = true;
                }
            }
        };
    });

    return module;
});