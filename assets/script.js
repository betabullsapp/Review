$(document).ready(function(){
	//Initialize all modals
	$('.modal-trigger').each(function(){
		var $this = $(this),
			modalId = "#" + $this.attr('data-modal-id'),
			$modal = $(modalId);

		$this.on('click', function(){
			window.rateabiz.ui.modal.open(modalId);
		});
		$modal.on('click', '.close-modal', function(){
			window.rateabiz.ui.modal.close(modalId);
		});

	});

	initReviewBody();
	//Initialize rating groups
	window.rateabiz.ui.rating.populateRatingGroups('.rating-group.average-rating');
});

function initReviewBody() {
	$('.user-review-summary .accordion-block').each(function() {
		var $body = $(this).find('.review-body'),
			fullBodyText = $body.text(),
			truncatedBodyText,
			$link = $('<span class="link">'),
			isLinkDisplayed = false;

		if (fullBodyText.length > 300) {
	 		truncatedBodyText = fullBodyText.slice(0, 299).split(" ").slice(0, -1).join(" ") + "..."
	 		$body.text(truncatedBodyText);
	 		isLinkDisplayed = true;
	 	}

	 	if(isLinkDisplayed) {
	 		$link.text("More").addClass('expand');
	 		$body.append($link);
	 	}

	 	$body.on('click', '.expand', function(){
	 		$link.removeClass('expand').text('Less').addClass('hide');
	 		$body.text(fullBodyText).append($link);
	 	});
	  	$body.on('click', '.hide', function(){
	 		$link.removeClass('hide').text('More').addClass('expand');
	 		$body.text(truncatedBodyText).append($link);
	 	});

	});
}
