define(['bootstrap/module'], function(yoBootstrap) {
    'use strict';
    yoBootstrap.factory('yoModalService', ['$document', function($document) {
        var modals = {};
        var body = $document.find('body').eq(0);
        
        var register = function(modalId, openModal, closeModal) {
            modals[modalId] = {
                open : openModal,
                close : closeModal
            };
        };
    
        var deregister = function(modalId) {
            delete modals[modalId];
        };
    
        var open = function(modalId) {
            if (modals[modalId]) {
                modals[modalId].open();
            }
        };

        var close = function(modalId) {
            if (modals[modalId]) {
                modals[modalId].close();
            }
        };
    
        return {
            register : register,
            deregister : deregister,
            open : open,
            close : close
        };
    }]);
});