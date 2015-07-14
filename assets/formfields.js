window.rateabiz = window.rateabiz || {};
window.rateabiz.ui = window.rateabiz.ui || {};
window.rateabiz.ui.formfields = (function ($) {

    /////////////////////////////////
    // Private methods and functions
    /////////////////////////////////

    var SUPPORTED_FIELDS = 'input:not("[type=submit], [type=button], [type=hidden]"), textarea, select';

    // Formats all text fields with default wrappers if they have not been added.
    function formatTextField($field) {
        var $this = $field.not('input[type=radio], input[type=checkbox], input[type=search]'); // do not include radio and checkbox fields
        var $target = $this.parent('.field-wrapper');

        $target = $target.add($this.filter(function() { return $target.has(this).length === 0; }));

        $target.each(function(e){
            var $this = $(this);
            var requiredField = $this.attr('required');

            // If field is not already wrapped
            if ($this.parents('.yv-formfield').length === 0) {
                $this.wrap('<div class="yv-formfield">'); // Wrap field to style error messages and helperText
            }

            var $fieldWrap = $this.parents('.yv-formfield');

            addCaptionToFieldWrap($fieldWrap);

            addAsteriskToLabel($this);
        });
    }

    function formatTextarea($form){

        // Resize Textarea
        var resize = function($textarea) {
            $textarea.height('auto').height(($textarea[0].scrollHeight + 5 ) + 'px');
            setTimeout(function() {
                $textarea.data('autosize-timeout-set', false);
            }, 80);
        }

        // Loops through each textarea. Filters out elements where data-autosize is false.
        $form.find('textarea.autosize').each(function(){
            var $textarea = $(this);
            var textarea = $textarea.get(0);

            resize($textarea);
        });


        $form.on('input keyup', 'textarea.autosize', function(){
            var $this = $(this);
            if (!$this.data('autosize-timeout-set')) {
                $this.data('autosize-timeout-set', true);
                resize($this);
            }
        });

    }

    function formatWrapOnFocus($form) {
        $($form).on('focus', SUPPORTED_FIELDS, function(){
            var $fieldWrap;
            $this = $(this);

            if ($this.parents('.yv-formfield').length !== 0){
                $fieldWrap = $this.parents('.yv-formfield');
            } else {
                $fieldWrap = $this.parents('.field-wrapper');
            }

            $fieldWrap.addClass('focus');
        });

        $($form).on('blur', SUPPORTED_FIELDS, function(){
            var $fieldWrap;
            $this = $(this);

            if ($this.parents('.yv-formfield').length !== 0){
                $fieldWrap = $this.parents('.yv-formfield');
            } else {
                $fieldWrap = $this.parents('.field-wrapper');
            }

            $fieldWrap.removeClass('focus');
        });
    }

    function addCaptionToFieldWrap ($fieldWrap) {
        // If field does not have a caption
        if ($fieldWrap.find('.fieldCaption').length === 0) {
            $fieldWrap.append('<div class="fieldCaption"></div>'); // This field caption element will display messages (i.e. errors, helperText)
        }
    }

    function formatRadioCheckboxField($form) {
        var fieldNameList = $.makeArray();
        var i = 0;

        $form.find("input[type=radio]:not('[data-toggle]'), input[type=checkbox]:not('[data-toggle]')").each(function(index) { // search through all radio and checkbox fields
            fieldNameList[index] = $(this).attr("name");
        });

        var fieldName = $.unique(fieldNameList); // Save only the unique field names

        // For each unique field name, wrap inputs
        $.each(fieldName, function(i) {
            var $field = $form.find('input[name="'+ fieldName[i] +'"]');

            if ($field.parents(".yv-formfield").length === 0) {
                $field.parent().wrapAll('<div class="yv-formfield radioCheckbox" />');
            }
            addCaptionToFieldWrap($field.parents('.yv-formfield'));
        });

        //Format checkbox
        var $checkboxes = $form.find('input[type="checkbox"]');

        $checkboxes.each(function(){
            var $checkbox = $(this),
                $wrapper = $checkbox.parent('.checkbox');

            $wrapper.on('click', function(){
                var $this = $(this);
                if($this.hasClass('checked')) {
                    $this.removeClass('checked');
                    $checkbox.prop('checked', false);
                }
                else {
                    $this.addClass('checked');
                    $checkbox.prop('checked', true);
                }
            })

        });

    }

    function formatSelectField($fieldWrap){
        // Add class of select to wrapper to allow styling
        $fieldWrap.addClass('select');
        var $fieldValue = $fieldWrap.find('select option:eq(0)').text();

        // If it currently has no div with a class of selected-option, append it
        if ($fieldWrap.find('.select-option').length === 0) {
            $fieldWrap.append('<div class="select-option">' + $fieldValue + '</div>');
        }
    }

    // Styles if field is valid
    function isValid($fieldWrap){
        $fieldWrap.removeClass("invalid").addClass("valid");
    }

    // Styles if field is invalid
    function isInvalid($fieldWrap){
        $fieldWrap.removeClass("valid").addClass("invalid");
    }

    // Default styles
    function defaultStyles($fieldWrap){
        $fieldWrap.removeClass("invalid").removeClass("valid");
    }

    // Automatically adds asterisk to field's label if it doesn't already have one and field is required
    function addAsteriskToLabel($fields){
        var required = $fields.attr('required');
        var label = getFieldLabelType($fields);

        $fields.each(function(){
            var $this = $(this);
            var required = $this.attr('required');
            var label = getFieldLabelType($this);

            var $formfieldWrap = $this.parents('.yv-formfield');

            labelValue = $this.parents('.yv-formfield').siblings(label).text();

            if (required && !hasAsterisk(labelValue)){
                $formfieldWrap.siblings(label).append('<span class="yv-required-field ' + label +'">*</span>'); // Add asterisk to label
            }
        });

    }

    // Checks if string contains an asterisk
    function hasAsterisk(string){
        // Checks to see if an asterisk
        if (string.indexOf('*') !== -1){
            return true;
        }
    }

    // Appropriately returns the field's label.
    function getFieldLabelType($field){
        if ($field.is('input[type=checkbox], input[type=radio]')){
            return 'legend';
        } else {
            return 'label';
        }
    }


    /////////////////////////////////
    // Public methods and functions
    /////////////////////////////////
    return {
        // Initializes the function. Receives type. Type is the type of formatting. The only option supported at the moment is "validate"
        format : function (selector, type) {
            var $form = $(selector);
            var $fields = $form.find(SUPPORTED_FIELDS);

            // Search through form for all radio/checkbox fields of the same name and wrap them
            formatRadioCheckboxField($form);

            // Search through all text fields and wrap it
            formatTextField($fields);

            // Search through all textarea fields
            //formatTextarea($form);

            // //Format upload fields
            // if (yodle.components.fileUpload){
            //     yodle.components.fileUpload.format($form);
            // }

            // //Format select fields
            // if (yodle.components.selectDropdown){
            //     yodle.components.selectDropdown.format($form);
            // }

            // // Format search fields
            // $form.each(function(){
            //     $this = $(this);

            //     if ($this.find("input[type=search]").length !== 0 && yodle.components.search){
            //         yodle.components.search.format($this);
            //     }
            // });

            addAsteriskToLabel($fields);

            formatWrapOnFocus($form);
        },

        // Shows or hides caption message
        captionMessage : function (element, msgType, msg) {
            var $fieldWrap = $(element).parents('.yv-formfield');
            var $fieldCaption = $fieldWrap.find('.fieldCaption');

            // Call appropriate format function depending on message Type (i.e. valid, invalid, default)
            switch(msgType) {
                case 'valid':
                    isValid($fieldWrap);
                    break;
                case 'invalid':
                    isInvalid($fieldWrap);
                    break;
                default:
                    defaultStyles($fieldWrap);
            }

            // If there's a message, add class to wrapper, and add message to caption
            if (msg){
                $fieldWrap.addClass('showMessage'); // Adds class of show message (adds padding to the fieldwrap);
                $fieldCaption.text(msg); // Display message on field caption

                // THIS IS UGLY!!!!!!! LET'S FIND A BETTER SOLUTION!! -- PRAM
                var msgHeight = $fieldCaption.height();
                $fieldWrap.css('padding-bottom', msgHeight);
            } else {
                $fieldWrap.removeClass('showMessage'); // Hide message
                $fieldWrap.css('padding-bottom', 0);
            }
        },

        // Returns the field's type. (i.e. select, email, checkbox, textarea, etc.)
        findFieldType : function($field) {
            var elementType;
            var fieldPattern = $field.prop('pattern');

            if (($field).is('select')) {
                elementType = 'select';
            } else if ($field.data('inputType')){
                elementType = $field.data('inputType');
            } else if (fieldPattern){
                elementType = 'custom';
            } else {
                elementType = $field.prop('type');
            }

            return elementType;
        }
    };
})(jQuery);