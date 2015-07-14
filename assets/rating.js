window.rateabiz = window.rateabiz || {};
window.rateabiz.ui = window.rateabiz.ui || {};
window.rateabiz.ui.rating = (function ($) {
	/////////////////////////////////
    // Private methods and functions
    /////////////////////////////////
    var MAX_RATING = 5;

    //To activate 0th to (index)th rating stars, and
    //Inactivate (index+1)th to 5th rating stars 
    function populateRatingItems($items, index){
    	for (var i=0; i<=index; i++) {
    		$items.eq(i).addClass('selected');
    	}
    	for (var i=index+1; i<MAX_RATING; i++) {
    		$items.eq(i).removeClass('selected');
    	}

        populateRatingDescription($items, index);
    }

    function populateRatingDescription($items, index) {
        var $helper = $items.siblings('.helper-text');
        switch(index) {
            case 0:
                $helper.text('It was terrible');
                break;
            case 1:
                $helper.text('It was bad');
                break;
            case 2:
                $helper.text('It was OK');
                break;
            case 3:
                $helper.text('It was good');
                break;
            case 4:
                $helper.text('It was great');
                break;
            default:
                $helper.text('Unrated');
        }
    }

    function getCurrentIndex($field) {
        if($field.val()) {
            return parseInt($field.val())-1;
        }
        else {
            return -1;
        }
    }

    function populateRatingGroup($ratingGroup) {
        var ratingValue = $ratingGroup.attr('data-rating-value'),
            integerPart = Math.floor(ratingValue),
            decimalPart = ratingValue - integerPart;

        var $ratingItems = $ratingGroup.find('.rating-item');
        for (var i=0; i<integerPart; i++){
            $ratingItems.eq(i).find('.icon-star').addClass('on');
        }

        if (decimalPart>0) {
            var $halfStarItem = $ratingItems.eq(integerPart).find('.icon-star'),
                $halfStarWrapper = $('<span class="icon-star-bg">*</span>');
            //Adding half star
            $halfStarItem.addClass('half');

            var roundedWidth = parseInt(decimalPart/0.25)
            roundedWidth = (decimalPart % 0.25) > 0.125?(roundedWidth+1):roundedWidth;
            roundedWidth = roundedWidth * 25;

            $halfStarItem.css('width', roundedWidth + "%");

            $halfStarItem.wrap($halfStarWrapper);
        }
    }

	/////////////////////////////////
    // Public methods and functions
    /////////////////////////////////
    return {
    	initSelector: function(selector) {
    		var $group = $(selector),
    			$items = $group.find('.rating-item'),
    			$rating = $group.parent('.field-wrapper').find('input[type="text"]').eq(0),
    			$formfield = $group.parents('.yv-formfield');

    		$rating.val("");
            // Make top border of error message visible for rating selector
            $formfield.find('.fieldCaption').addClass('rating-selectior-fieldCaption');

    		$items.each(function(){
    			var $this = $(this),
    				index = $this.index();

    			$this.hover(function(){
    				populateRatingItems($items, index);
    			}, function(){
    				populateRatingItems($items, getCurrentIndex($rating));
    			});

    			$this.on('click', function(){
    				populateRatingItems($items, index);
    				$rating.val(index+1);

    				window.rateabiz.ui.validation.validateField($rating);

    				console.log($rating.val());
    			});
    		});
    	},
        populateRatingGroups: function(selector){
            var $ratingGroups = $(selector);

            $ratingGroups.each(function(){
                populateRatingGroup($(this));
            });
        }

    };

})(jQuery);