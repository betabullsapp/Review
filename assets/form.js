window.rateabiz = window.rateabiz || {};
window.rateabiz.ui = window.rateabiz.ui || {};
window.rateabiz.ui.form = (function ($) {

    function submitForm(submitUrl, successHandler, errorHandler) {
        var data = $(this).serialize();
        $.post(submitUrl, data, successHandler, 'json')
            .fail(errorHandler);
    }

    function init(selector, submitUrl, successHandler, errorHandler) {
        $(selector).submit(function(event) {
            event.preventDefault();
            submitForm.call(this, submitUrl, successHandler, errorHandler);
            return true;
        });
    }

    return {
        init: init
    };
}(jQuery));
