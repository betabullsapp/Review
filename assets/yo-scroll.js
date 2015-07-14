define(
    [
        'bootstrap/module'
    ], 
    function(yoBootstrap) {
    	"use strict";

        function scrollToSection(sectionId){
            var $target = $(sectionId);
            $("html, body").animate({scrollTop: $target.offset().top - 20}); // Targetting both body and html due to conflicts between firefox and chrome.
        }

        yoBootstrap.directive('a', function() {
            return {
                restrict: 'E',
                link: function($scope, $element, $attr){
                	$element.on('click', function(e){
                        var href = $attr.href ? $attr.href : "";
                		if (href[0] === '#' && href !== '#'){
                			e.preventDefault();
                            scrollToSection(href);
						}
                	});
                },
            };
        });
    }
);