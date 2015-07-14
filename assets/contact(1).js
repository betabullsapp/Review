window.rateabiz = window.rateabiz || {};
window.rateabiz.contact = (function ($) {

    var CONTACT_MODAL_SELECTOR = '#contact-modal';
    var CONTACT_FORM_SELECTOR = '#contact-form';

    function onSubmitSuccess(responseData) {
        var $contactFormModal = $(CONTACT_MODAL_SELECTOR),
            $contactForm = $contactFormModal.find(CONTACT_FORM_SELECTOR),
            $title = $contactFormModal.find('.yo-modal-header .heading-text'),
            $statusMessage = $contactFormModal.find('.status-message'),
            titleText = $title.text();

        $contactForm.fadeOut(500, function() {
            $title.text("Thank You");
            $statusMessage.fadeIn(500);
        });

        $contactFormModal.on('click', '.close-modal', function() {
            window.rateabiz.ui.modal.close(CONTACT_MODAL_SELECTOR);
            setTimeout(function() {
                $title.text(titleText);
                $contactForm.show();
                $statusMessage.hide();
            },1000)
        });
    }

    function onSubmitError() {

    }

    function init() {
        window.rateabiz.ui.form.init('#contact-form', '/api/sendMessage', onSubmitSuccess, onSubmitError);
    }

    return {
        init: init
    };

}(jQuery));

$(document).ready(function(){
    window.rateabiz.ui.validation.init('#contact-form');
    window.rateabiz.contact.init();
})

