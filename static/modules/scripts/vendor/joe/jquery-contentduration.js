/*
		jslint node: true, browser: true, devel: true, strict:false, debug:true 

		Append Content Duration
		Dependencies: jQuery

		by: Joe Burdick
		
*/

(function () {
	 'use strict';
}());

$.fn.contentDuration = function(options){

	$.fn.contentDuration.defaults = {
	  parent: $(this).parent().find('.content')[0],
	  durationClass: 'video-duration'
	};
	var settings = jQuery.extend({}, jQuery.fn.contentDuration.defaults, options);
	return this.each(function(i, el){
    	var duration = $(el).data('content--duration');
    	if ($(el).parent().find('.content .video-duration').length > 0)
    		return;
    	else 
    		$(el).parent().find('.content').children('p').last().append('<span class="'+ settings.durationClass +'">'+ duration +'</span>');	
	});
};



