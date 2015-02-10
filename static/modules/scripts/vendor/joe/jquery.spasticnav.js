'use strict';
(function($) {

	$.fn.spasticNav = function(options) {
	
		options = $.extend({
			overlap : 7,
			speed : 500,
			reset : 1500,
			easing : 'linear'
		}, options);
	
		return this.each(function() {
		
		 	var nav = $(this),
		 		currentPageItem = $('#nav-primary-selected', nav),
		 		blob,
		 		reset;
		 		
		 	$('<li id="primary-nav-blob"></li>').css({
		 		width : currentPageItem.outerWidth(),
		 		height : currentPageItem.outerHeight() + options.overlap,
		 		left : currentPageItem.position().left,
		 		top : currentPageItem.position().top - options.overlap / 2
		 	}).appendTo(this);
		 	
		 	blob = $('#primary-nav-blob', nav);
					 	
			$('li:not(#primary-nav-blob)', nav).hover(function() {
				// mouse over
				clearTimeout(reset);
				if(!Modernizr.csstransitions){
					blob.animate(
						{
							left : $(this).position().left,
							width : $(this).width()
						},
						{
							duration : options.speed,
							easing : options.easing,
							queue : false
						}
					);
				} else {
					blob.css(
						{
							left : $(this).position().left,
							width : $(this).width()
						},
						{
							duration : options.speed,
							easing : options.easing,
							queue : false
						}
					);
				}
			}, function() {
				// mouse out	
				reset = setTimeout(function() {
					if(!Modernizr.csstransitions){
						blob.animate({
							width : currentPageItem.outerWidth(),
							left : currentPageItem.position().left
						}, options.speed);
					} else {
						blob.css({
							width : currentPageItem.outerWidth(),
							left : currentPageItem.position().left
						}, options.speed);
					}
				}, options.reset);
				
			});
		 
		
		}); // end each
	
	};

})(jQuery);