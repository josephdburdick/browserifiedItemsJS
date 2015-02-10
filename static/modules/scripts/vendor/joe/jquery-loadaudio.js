/*
		jslint node: true, browser: true, devel: true, strict:false, debug:true 

		Load Audio
		Dependencies: jQuery, jPlayer

		by: Joe Burdick
		
*/
/*jshint -W087 */

(function () {
	'use strict';
	
	var 
		isMobile = false,
		inSidebar = function(el){
			return $(el).parents('.side-column').length > 0;
		};

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	 isMobile = true;
	}

	var interfaceTitle = (function(){
		return [
			'<div class="jp-details">',
	    	'<div class="jp-title" aria-label="title">',
	    	'</div> <!-- /.jp-title -->',
	  	'</div> <!-- /.jp-details -->',
		].join('\n');
	})();

	var playPause = (function(){
		return [
			'<div class="jp-controls">',
	      '<button class="jp-play" role="button" tabindex="0">play</button>',
	      '<button class="jp-pause" role="button" tabindex="0">pause</button>',
	    '</div> <!-- /.jp-controls -->',
		].join('\n');
	})();

	var progress = (function(){
		return [
			'<div class="jp-progress-duration">',
				'<div class="jp-time-holder">',
	        '<div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div>',
	        '<div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div>',
	      '</div> <!-- /.jp-time-holder -->',

	      '<div class="jp-progress">',
	        '<div class="jp-seek-bar">',
	          '<div class="jp-play-bar"></div>',
	        '</div>',
	      '</div> <!-- /.jp-progress -->',
			'</div> <!-- /.jp-progress-duration -->',
		].join('\n');
	})();

	var volControls = (function(){
		return [
			'<div class="jp-volume-controls">',
	  		'<div class="facemask"></div>',
	  		'<div class="jp-volume-control-popup">',
	        '<div class="jp-volume-bar">',
	          '<div class="jp-volume-bar-value"></div>',
	        '</div>',
	        '<button class="jp-mute" role="button" tabindex="0">mute</button>',
	  		'</div> <!-- /.jp-volume-control-popup -->',
	    '</div> <!-- /.jp-volume-controls -->',
		].join('\n');
	})();

	var downloadBtn = (function(){
		return [
			'<div class="jp-download-controls">',
	    	'<a class="jp-download" role="button" tabindex="0">download</a>',
	    '</div>',
		].join('\n');
	})();
		
	var interfaceControls = function(){
		if (inSidebar(this)){
			return [
				'<div class="jp-interface--controls">',
					
					interfaceTitle,
			  	progress,
			  	// '<div class="jp-sidebar-button-container">',
				  	isMobile ? '' : volControls,
				  	playPause,
						isMobile ? '' : downloadBtn,
					// '</div> <!-- /.jp-sidebar-button-container -->',
				'</div> <!-- /.jp-interface--controls -->'
			].join('\n');
		} else {
			return [
				'<div class="jp-interface--controls">',
					
					interfaceTitle,
			  	playPause,
			  	progress,
			  	isMobile ? '' : volControls,
					isMobile ? '' : downloadBtn,

				'</div> <!-- /.jp-interface--controls -->'
			].join('\n');
		}
	};

	$.fn.loadAudio = function(options){
		$.fn.loadAudio.defaults = {
			inSidebar: inSidebar(this),
			title: $(this).data('player--title') || "Untitled",
		  file: $(this).data('player--audio'),
			image: $(this).data('player--image') || "../images/ysm_shield.svg",
			volume: $(this).data('player--volume') || 0.95,			
			autostart: false
		};
		var settings = jQuery.extend({}, jQuery.fn.loadAudio.defaults, options);
				
		// return this.each(function(i, el){

			if (settings.autostart === undefined)
				settings.autostart = false;
			if ($(this).parents('.side-column').length > 0)
				settings.inSidebar = true;
			
			$(this).next('.jp-audio').find('.jp-interface').append(interfaceControls);
	    $(this).jPlayer({
	      ready: function () {
	      	var 
	      		controls = $(this).next('.jp-audio'),
        		volToggle = $(controls).find('.jp-volume-controls'),
        		volPopup = {
        			el: $(controls).find('.jp-volume-control-popup'),
        			visible: false
        		},
        		btnDownload = $(controls).find('.jp-download');

        		$(controls).find('.jp-title').text(settings.title);

		        $(this).jPlayer("setMedia", {
		          mp3: settings.file
		        });

		        $(btnDownload).attr({ target: '_blank', href: settings.file });
		        
		        $(volToggle).on('click',function(e){
		        	e.preventDefault();

		        	if (volPopup.visible === false){
		        		volToggle.toggleClass('active');
		        		$('.jp-interface').toggleClass('vol-open');
		        	}
		        });	        
	      },
	      play: function() { // To avoid multiple jPlayers playing together.
					$(this).jPlayer('pauseOthers');
				},
				cssSelectorAncestor: "#" + $(this).next().attr('id'),
				globalVolume: true,
	     	swfPath: "/static/app/bower_components/jplayer/dist/jplayer/",
	      supplied: "mp3",
	      autoBlur: false,
	      keyEnabled: true,
	      smoothPlayBar: true,
	      verticalVolume: true,
	      remainingDuration: true,
	      toggleDuration: true
	    }); // jplayer init
			
			$('.facemask').on('click', '.jp-volume-controls.active', function(e){
					e.stopPropagation();
	    		$('.jp-volume-controls').removeClass('active');
	    });

	  // }); //each 
	};

	
}());



