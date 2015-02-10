/*
		jslint node: true, browser: true, devel: true, strict:false, debug:true 

		Load Video
		Dependencies: jQuery

		by: Joe Burdick
		
*/
/*jshint -W087 */
(function () {
	 'use strict';


	$.fn.loadVideo = function(options){
		$.fn.loadVideo.defaults = {
		  file: $(this).data('player--video'),
			image: $(this).data('player--image'),
			aspectratio: "16:9",
			width: $(this).data('player--weight') || "100%",
			height: $(this).data('player--height') || 391,
			stream: $(this).data('player--stream'),
			autostart: $(this).data('player--autoplay')
		};
		var settings = jQuery.extend({}, jQuery.fn.loadVideo.defaults, options);
		if (settings.autostart === undefined)
			settings.autostart = false;
		var videoTemplate = function(){
			switch (true){
				case (settings.file.indexOf('vimeo.com') != -1):
					if (settings.file.indexOf('www') != -1)
							settings.file.replace('www', '');
					if (settings.file.indexOf('channels/staffpicks/') != -1)
							settings.file = settings.file.replace('channels/staffpicks/', '');
					if (settings.autostart === true)
						settings.autostart = 1;
					else 
						settings.autostart = 0;
					settings.file = settings.file.replace('http://', '//player.').replace('//player.vimeo.com/', '//player.vimeo.com/video/');
					if (settings.file.indexOf('video/video') != -1)
						settings.file = settings.file.replace('video/video', 'video');
					return [
							'<iframe class="jw-body--iframe" id="iframe-'+ this.id +'" src="' + settings.file + '?title=0&amp;autoplay='+ settings.autostart +'&amp;byline=0&amp;output=embed&amp;portrait=0&amp;color=ffffff&amp;api=1&amp;player_id=iframe-'+ this.id +'" width="'+ settings.width +'" height="'+ settings.height +'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
					].join('\n');
				default:
					return [
						'<div class="jw-body--video">',
							'<div class="jw-body--video-wrapper" id="jw-videoplayer-container-'+ this.id +'">Loading Video...</div>',
							'<script type="text/javascript">',
								'jwplayer("jw-videoplayer-container-'+ this.id +'").setup({',
									'file: "' + settings.file + '",',
									'image: "' + settings.image + '",',
									'aspectratio: "' + settings.aspectratio + '",',
									'width: "' + settings.width + '",',
									'height: "' + settings.height + '",',
									'autostart: "' + settings.autostart + '"',
								'});',
							'</script>',
						'</div>'
					].join('\n');
				}
		};
		
		if ($(this).data('toggle') == "modal"){
			return videoTemplate;
		} else {
			$(this).html(videoTemplate);

			// Makes iframe video responsive
			if ($(this).children('iframe').length > 0){
				$(this).find('iframe').parent().addClass('video-responsive');
			}

			return this;
		}	
	};
}());



