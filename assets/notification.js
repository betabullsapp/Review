window.rateabiz = window.rateabiz || {};
window.rateabiz.ui = window.rateabiz.ui || {};
window.rateabiz.ui.notification = (function ($) {

    function formatNotification(type,heading,message) {
        var $container = $('<div>');

        $container.addClass('notification-container ' + type);
        $container.append($('<div class="notification-inner">'));

        var $inner = $container.find('.notification-inner');

        $inner.append($('<h4 class="notification-heading">')).append($('<p class="notification-body">'));
        $container.wrap($('<div class="block notification-block">'));

        var $block = $container.parent();

        var $heading = $container.find('.notification-heading'),
            $message = $container.find('.notification-body');

        if (heading) {
            $heading.text(heading);
        }
        else {
            $heading.text(type+"!");
        }
        
        $message.text(message);

        $('.notification-wrapper').prepend($block);
    }

    function displayNotification(type, heading, message){
        formatNotification(type,heading, message);
        var $notification = $('.notification-wrapper .notification-block');

        setTimeout (function(){
            $notification.fadeOut();
        }, 6000);
    }

    return {
        show: displayNotification
    };
}(jQuery));
