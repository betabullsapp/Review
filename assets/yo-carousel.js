define(
[
    'bootstrap/module', 
    'bootstrap/lib/plugins/text!../templates/yo-carousel.html',
    'bootstrap/lib/plugins/text!../templates/yo-slide.html',
    'bootstrap/lib/plugins/css!../css/carousel.css'
], 
function(yoBootstrap, yoCarouselTemplate, yoSlideTemplate) {
	"use strict";
	yoBootstrap.controller('yoCarouselController', ['$scope','$timeout', '$transition', '$controller', function($scope, $timeout, $transition, $controller){
		angular.extend(this, $controller('TwitterCarouselController', {
			$scope: $scope,
			$timeout: $timeout,
			$transition: $transition
		}));

		$scope.currentIndex = -1;
		$scope.currentSlide = null;

		this.updateCurrentSlide = function(slide) {
			$scope.currentSlide = slide;
			$scope.currentIndex = $scope.slides.indexOf(slide);
		};

		this.goToNextSlide = function(){
			if(!$scope.disableNextControl) {
				$scope.next();
			}
		};

		this.goToPrevSlide = function(){
			if(!$scope.disablePrevControl) {
				$scope.prev();
			}
		};
	}])

	.directive('yoCarousel', function(){
		return {
			restrict: 'AE',
			transclude: true,
			replace: true,
			controller: 'yoCarouselController',
			require: 'yoCarousel',
			template: yoCarouselTemplate,
			scope: {
				type: '@yoType',
				interval: '=yoInterval',
				noTransition: '=yoNoTransition',
				noPause: '=yoNoPause',
				noAutoCycle: '@yoNoAutoCycle',
				noControls: '@yoNoControls',
				enableIndicators: '@yoEnableIndicators',
				indexTitle: '@yoIndex'
			},
			link: function(scope, element, attrs, yoCarouselCtrl) {
				element.find('.carousel-control.left').bind('click', yoCarouselCtrl.goToPrevSlide);
				element.find('.carousel-control.right').bind('click', yoCarouselCtrl.goToNextSlide);

				if(scope.noAutoCycle) {
					scope.$watch('currentIndex', function(currentIndex) {
						scope.disableNextControl = (currentIndex === scope.slides.length-1);
						scope.disablePrevControl = (currentIndex === 0);
					});
				}
			}
		};
	})

	.directive('yoSlide', function(){
		return {
			require: '^yoCarousel',
			restrict: 'AE',
			transclude: true,
			replace: true,
			template: yoSlideTemplate,
			scope: {
				active: '=?'
			},
			link: function (scope, element, attrs, yoCarouselCtrl) {
				yoCarouselCtrl.addSlide(scope, element);
				//when the scope is destroyed then remove the slide from the current slides array
				scope.$on('$destroy', function() {
					yoCarouselCtrl.removeSlide(scope);
				});

				scope.$watch('active', function(active) {
					if (active) {
						yoCarouselCtrl.select(scope);
						yoCarouselCtrl.updateCurrentSlide(scope);
					}
				});
			}
		};
	})

	.directive('yoSkip', function(){
		return {
			require: '^yoCarousel',
			link: function(scope, element, attrs, yoCarouselCtrl) {
				element.bind('click', yoCarouselCtrl.goToNextSlide);
			}
		};
	});
});