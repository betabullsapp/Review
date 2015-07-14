define([
        'bootstrap/module',
        '../js/yo-modal-service'
        ], function(yoBootstrap) {
            'use strict';
    yoBootstrap.controller('yoModalCtrl', ['$scope', '$element', '$window', '$document', 'yoModalService', function($scope, $element, $window, $document, yoModalService) {

        var docBody = $document.find('body').eq(0);
        var headerElement;
        var bodyElement;
        var footerElement;

        var windowScrollTop;
        var windowHeight;
        var headerHeight;
        var scrollBodyHeight;
        var footerHeight;

        var setHeaderElement = function(element) {
            headerElement = element;
        };

        var setBodyElement = function(element) {
            bodyElement = element;
        };

        var setFooterElement = function(element) {
            footerElement = element;
        };

        var getMinBodyHeight = function() {
            var maxScrollHeight = 200;
            return Math.min(scrollBodyHeight, maxScrollHeight);
        };

        var getMaxBodyHeight = function() {
            var maxHeight = Math.round(windowHeight * 0.80) - headerHeight - footerHeight;
            return maxHeight;
        };

        var resetModal = function() {
            if ($scope.isLightbox) {
                return;
            }

            windowScrollTop = angular.element($window).scrollTop();
            windowHeight = angular.element($window).height();
            headerHeight = headerElement? headerElement.outerHeight() : 0;
            scrollBodyHeight = bodyElement? bodyElement.prop("scrollHeight") : 0;
            footerHeight = footerElement? footerElement.outerHeight() : 0;

            var minBodyHeight = getMinBodyHeight();
            var maxBodyHeight = getMaxBodyHeight();

            $element.children().eq(0).css({
                'top': Math.round(windowScrollTop + (windowHeight * 0.10)) + 'px',
                'min-height': (minBodyHeight + headerHeight + footerHeight) + 'px',
                'max-height': (maxBodyHeight + headerHeight + footerHeight) + 'px'
            });


            if (bodyElement) {
                bodyElement.css({
                    'min-height': minBodyHeight + 'px',
                    'max-height': maxBodyHeight + 'px'
                });
            }
        };

        var initModalType = function() {
            if ($scope.type === 'lightbox') {
                $scope.isLightbox = true;
                $document.bind('keyup', function (evt) {
                    if (evt.which === 27) {
                        yoModalService.close($scope.modalId);
                    }
                });
            } else {
                angular.element($window).bind("resize.modal", resetModal);
            }
        };

        var initOpenModal = function() {
            if (!$scope.isLightbox) {
                docBody.css('overflow', 'hidden');
                resetModal();
            }
        };

        var initCloseModal = function() {
            if (!$scope.isLightbox) {
                docBody.css('overflow', 'auto');
            }
        };

        var closeModal = function() {
            initCloseModal();
            $element.fadeOut(function() {
                $scope.isVisible = false;
            });


            if ($scope.onModalClose) {
                $scope.onModalClose();
            }
        };

        var openModal = function() {
            //Calculate the top of the visible window and set the top of the modal 10% down
            $element.children().eq(0).css({
                top: Math.round(angular.element($window).scrollTop() + (angular.element($window).height() * 0.10)) + 'px'
            });
            $element.fadeIn(function() {});
            $scope.isVisible = true;
            initOpenModal();
            if ($scope.onModalOpen) {
                $scope.onModalOpen();
            }
        };

        var isLightbox = function() {
            return $scope.type === 'lightbox';
        };

        var getModalId = function() {
            return $scope.id;
        };

        docBody.append($element);
        $scope.modalId = getModalId();
        $scope.isLightbox = isLightbox();

        initModalType();

        yoModalService.register($scope.modalId, openModal, closeModal);
        $scope.$on('$destroy', function() {
            $element.remove();
            yoModalService.deregister($scope.modalId);
            angular.element($window).unbind("resize.modal");
            docBody.css('overflow', 'auto');
        });

        return {
            isLightbox: isLightbox,
            getModalId: getModalId,
            setHeaderElement: setHeaderElement,
            setBodyElement: setBodyElement,
            setFooterElement: setFooterElement,
            resetModal: resetModal,
            openModal: openModal,
            closeModal: closeModal
        };
    }]);
});