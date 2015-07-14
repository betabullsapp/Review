define([
    'bootstrap/module',
    'bootstrap/lib/plugins/text!../templates/yo-modal.tpl.html',
    'bootstrap/lib/plugins/css!../css/modal.css',
    '../js/yo-modal-controller',
    '../js/yo-modal-service'
    ], function(yoBootstrap, yoModalTpl) {
    'use strict';
    yoBootstrap.directive('yoModal', [function() {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                modalCol: '@yoModalCol',
                type: '@yoType',
                id: '@id',
                onModalClose: '&yoOnModalClose',
                onModalOpen: '&yoOnModalOpen'
            },
            template: yoModalTpl,
            controller: 'yoModalCtrl'
        };
    }])
    .directive('yoModalHeader', [function() {
        return {
            require: '^yoModal',
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {},
            template: "<div class='yo-modal-header' ng-transclude></div>",
            link: function($scope, $element, $attrs, modalCtrl) {
                modalCtrl.setHeaderElement($element);
                $scope.isLightbox = modalCtrl.isLightbox();
            }
        };
    }])
    .directive('yoModalBody', [function() {
        return {
            require: '^yoModal',
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {},
            template: "<div class='yo-modal-body' x-ng-class='{\"yo-scroll-body\": !isLightbox}' ng-transclude></div>",
            link: function($scope, $element, $attrs, modalCtrl) {
                modalCtrl.setBodyElement($element);

                var heigthChanged = function() {
                    return $element.prop("scrollHeight");
                };

                $scope.$watch(heigthChanged, function() {
                    modalCtrl.setBodyElement($element);
                    modalCtrl.resetModal();
                });

                $scope.isLightbox = modalCtrl.isLightbox();
            }

        };
    }])
    .directive('yoModalFooter', [function() {
        return {
            require: '^yoModal',
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {},
            template: "<div class='yo-modal-footer' x-ng-class='{\"yo-scroll-footer\": !isLightbox}' ng-transclude></div>",
            link: function($scope, $element, $attrs, modalCtrl) {
                modalCtrl.setFooterElement($element);
                $scope.isLightbox = modalCtrl.isLightbox();
            }
        };
    }]);
    yoBootstrap.directive('yoModalOpen', [function() {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            controller: ['$scope', '$element', '$attrs', 'yoModalService', function($scope, $element, $attrs, yoModalService) {
                $element.on('click', function() {
                    $scope.$apply(function() {
                        yoModalService.open($attrs.yoModalOpen);
                    });
                });
            }]
        };
    }])
    .directive('yoModalClose', [function() {
        return {
            require: '^yoModal',
            restrict: 'A',
            replace: false,
            transclude: false,
            controller: ['$scope', '$element', 'yoModalService', function($scope, $element, yoModalService) {
                $element.on('click', function(){
                    $scope.$apply(function() {
                        yoModalService.close($scope.modalId);
                    });
                });
            }],
            link: function($scope, $element, $attrs, modalCtrl) {
                $scope.modalId = modalCtrl.getModalId();
            }
        };
    }])
    .directive('yoModalSave', [function() {
        return {
            require: '^yoModal',
            restrict: 'A',
            scope: {
                modalSave: '&yoModalSave'
            },
            controller: ['$scope', '$element', 'yoModalService', function($scope, $element, yoModalService) {
                $element.on('click', function(){
                    $scope.modalSave();
                    yoModalService.close($scope.modalId);
                });
            }],
            link: function($scope, $element, $attrs, modalCtrl) {
                $scope.modalId = modalCtrl.getModalId();
            }
        };
    }]);
});