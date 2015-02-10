/*jshint -W030 */
/*jshint debug:true*/

/*

Yale School of Medicine
Popup Glossary component
Forked from Jon Krauss, jonkrauss.com


This component creates a popup overlay and dynamically loads content via AJAX.


_How to instantiate:

$('#container').popupGlossary({
	link_class:'popup-link',
	popup_class:'popup-medium'
});

...where container is the id of the div containing links to open the popup window.

_Sample HTML link

<a href="http://backend-path-for-ajax-loading" class=""></a>

*/


(function($) {	
	'use strict';

	$.fn.popupGlossary = function(options) {	

		var 
			el = this,
			defaults = {
				link_class: 'glossary',
				popup_class: '',
				target_container_id: 'nci-content-area',
				pointer_left_space: 0, // was 100
				base_url: '/NCI/GlossaryTerm/',
				audioplayer_path: '/static/app/bower_components/jplayer/dist/jplayer/'//absolute path   // ../audioplayer   relative path, not url!
			},
			settings = $.extend(defaults, options),
			popup_status = 0,
			data_path,
			current_language = 'english',
			active_link,
			$container = $('.content-container'),
			$jPlayer;
		

		var init = function(){
			////log('popupGlossary');
			
			//add audioplayer
			$('footer.main').append('<div id="jquery_jplayer"></div><div id="jp_container"></div>');
			$jPlayer = $("#jquery_jplayer");
			$jPlayer.jPlayer({
				ready: function () {			
					log('popupGlossary jplayer ready');

					attachInitialGlossaryEvents();
				},
				swfPath: settings.audioplayer_path,
				cssSelectorAncestor: "#jp_container",
				supplied: "mp3",
				wmode: "window"
			});
		};
		
		var log = function(s) {
			if (typeof console != "undefined") {
				console.log(s);
			} else {
				//alert(s);
			}
		};
		
		var openPopupGlossary = function(target){
			function build(){
				//build it
				popup_status = 1;
				buildPopupGlossary(target);
			}

			//if we have one open, close it
			if (popup_status == 1){
				
			}
			
			build();	
		};
		
		//disable popup
		var closePopupGlossary = function(){
			//only if enabled
			if (popup_status == 1){
				
				//unbind events
				removePopupGlossaryEvents();
				
				//remove it				
				$('#popup-glossary').fadeOut('fast',function(){ $(this).remove(); });

				popup_status = 0;
				data_path = '';
			}
		};

		var attachInitialGlossaryEvents = function(){

			//alert('popupGlossary tot '+ $(el.selector).length );

			//open popup event
			$('body').on('click', el.selector, function(e){
				e.preventDefault();
				openPopupGlossary( e.target );
				$(this).blur();
				return false;
			});
			
			//close popup when esc clicked
			$(document).keypress(function(e){
				if (e.keyCode == 27 && popup_status == 1){
					closePopupGlossary();
				}
			});
			$(window).on('resize', closePopupGlossary);
		};
		
		var attachPopupGlossaryEvents = function(){
			
			log('attachPopupGlossaryEvents');
			var $p = $('#popup-glossary');
			
			//closing popup
			$('#popup-glossary-close').on('click', $p, closePopupGlossaryClick);
			
			//language toggle
			$('#language-toggle').on('click', $p, toggleLanguage);
			
			//audio
			$('.button-pronunciation').on('click', $p, playGlossarySound);
		};
		
		var removePopupGlossaryEvents = function(){
			
			var $p = $('#popup-glossary');
			
			$('#popup-glossary-close').off('click', $p, closePopupGlossaryClick);
			$('#language-toggle').off('click', $p, toggleLanguage);
			$('.button-pronunciation').off('click', $p, playGlossarySound);
			$(window).unbind('scroll');
		};
		
		var closePopupGlossaryClick = function(e){
			e.preventDefault();
			closePopupGlossary();
			return false;
		};
		
		var playGlossarySound = function(e){
			e.preventDefault();
			
			var href = $(e.currentTarget).attr('href');
			playAudio( href );
			
			return false;
		 };
		
		var toggleLanguage = function(e){
			e.preventDefault();
			var lang_txt = (current_language == 'english') ? 'in English' : 'en Español';
			
			current_language = (current_language == 'english') ? 'spanish' : 'english';
			
			log('toggleLanguage '+current_language);

			$('#language-toggle').text(lang_txt);
			
			revealContent();

			return false;
		};
		
		var buildPopupGlossary = function(target){	

			//log('buildPopupGlossary');
			
			active_link = target;
			
			var popup_html = 
				'<div id="popup-glossary" class="popover top" role="tooltip">'+
					'<div class="arrow"></div>'+
					'<a href="#" class="pull-right" id="popup-glossary-close">'+
						'<svg version="1.1" id="popup-glossary-close-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'+
		 					'width="17.1px" height="17.1px" viewBox="0 0 17.1 17.1" enable-background="new 0 0 17.1 17.1" xml:space="preserve">'+
						'<polygon fill="#010101" points="17.1,1.1 16,0 8.5,7.5 1.1,0 0,1.1 7.5,8.5 0,16 1.1,17.1 8.5,9.6 16,17.1 17.1,16 9.6,8.5 "/>'+
						'</svg></a>'+
					'<div id="popup-content-area">'+
					'	<span class="popup-loading">Loading...</span>'+
					'</div>'+
					'<div class="clear"></div>'+
				'</div>';
			if ($('#popup-glossary').length === 0){
				$container.append(popup_html);	
			}
			
			var id = $(target).attr('href');
			log("target id: "+ id);
			if (id === undefined){
				popup_status === 0;
				$('#popup-glossary').hide();
			} else {
				id = id.substr(1, id.length - 1); //after #
			}
			var data_path = settings.base_url + id + '.xml';
			
			doPopupAjax(data_path);
		};
		
		var positionArrow = (function(link, popup, options){
			var
				el = $(popup.el).find('.arrow'), 
				size = 11,
				defaults = {
					width: size * 2,
			 		height: size,
			 		left: '50%',
			 		marginLeft: -size,
			 		bottom: -size
				},
				settings= $.extend(defaults, options);

				if ($(popup.el).hasClass('mobile')){
					settings.right = 'auto';
					settings.left = ($(active_link).offset().left - $container.offset().left) + (link.width() / 2); //- (settings.width);
				}
				else if (link.docked == "left"){
					settings.right = 'auto';
					settings.left = $(active_link).position().left + (link.width() / 2);
				} else if (link.docked == "right"){					
					settings.left = 'auto';
					settings.right = link.rightDistance - (settings.width / 2);
				}
				
				$(el).css(settings);

		});

		var positionGlossaryPopup = function(){
			
			if (popup_status === 0){
				return;
			}

			var link = {
				el: function(){return $(active_link);},
				top: function(){return Math.floor($(active_link).offset().top);},
				left: function(){return Math.floor($(active_link).position().left);},
				width: function(){return $(active_link).width();}
			},

			popup = {
				el: (function(){ return $('#popup-glossary');})(),
				top: function(){ return Math.floor($(active_link).offset().top - $container.offset().top);},
				width: function(){ return $('#popup-glossary').outerWidth();},
				height: function(){ return $('#popup-glossary').outerHeight();},
				left: function(){ return Math.floor(($(active_link).position().left + $(active_link).outerWidth() / 2) - ($('#popup-glossary').outerWidth() / 2));},
				right: function(){ return Math.floor($('#popup-glossary').position().left + $('#popup-glossary').outerWidth());}
			},
			wW = (function(){ return $container.outerWidth();})(),
			d_top = $('#popup-glossary').offset().top - $(document).scrollTop();

			var containerWidth = $('.content-container').outerWidth(),
					middleLeftDistance = (link.left() + link.width() / 2),
					middleRightDistance = containerWidth - middleLeftDistance;

			var halfPopupWidth = (popup.width() / 2);
			
			if (wW < 640){
			
				popup.el.addClass('mobile');
				positionArrow(link, popup);
			
			} else if (middleLeftDistance < halfPopupWidth || middleRightDistance < halfPopupWidth){
				var arrowOptions = {};			
				if (middleLeftDistance < halfPopupWidth){
					//log("wont fit left side");
					popup.el
						.css({
							left: 0,
							right: ''
						});
					link.leftDistance = middleLeftDistance;
					link.rightDistance = middleRightDistance;
					link.docked = 'left';
					positionArrow(link, popup, arrowOptions);

				} else if ( middleRightDistance < halfPopupWidth ){
					//log("wont fit right side");
					popup.el
						.css({
							right: 0,
							left: 'auto'
						});
					link.leftDistance = middleLeftDistance;
					link.rightDistance = middleRightDistance;
					link.docked = 'right';
					positionArrow(link, popup, arrowOptions);
				}				
			} else {
				popup.el
					.css({
						left: popup.left(),
						right: 'auto' 
					});
				positionArrow(link, popup);
			}

			popup.el.css('top', popup.top() - popup.height());
			//scroll window if popup will be off top of screen
			if (d_top < popup.height()){
				//log ('too close to top');
				//scroll so popup is visible
				var scroll_top = link.top() - popup.height() - 30;
				
				//remove scroll listener before we scroll
				$(window).unbind('scroll');
				
				//scroll page
				$('html, body').animate({scrollTop: scroll_top}, 'fast', function(){
					//restore scroll listener after we scroll
					$(window).scroll(function(){
						positionGlossaryPopup();
					});
				});
			}
			
			$('#popup-glossary').fadeIn();

		};
		
		var doPopupAjax = function(data_path){
			
			//log(data_path);
			jQuery.ajax({
				
				url: data_path,
				dataType: "xml",
				
				success: function(response){					
					processResponse(response);
				},
				error: function (xhr, ajaxOptions, thrownError){
					try {
						console.log("popupGlossary AJAX error: "+ xhr.status +" "+ thrownError);
					} catch(e){}
				}       
			});
			
		};
		
		var processResponse = function(response){	
		
			//log('processResponse');
			var audioIconSVG = '<svg version="1.1" id="audio-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'+
	 				'width="14.3px" height="14px" viewBox="0 0 14.3 14" enable-background="new 0 0 14.3 14" xml:space="preserve">'+
					'<g>'+
						'<polygon points="0.2,3.8 0.2,9.9 3.1,9.9 9.3,14 9.3,0 3.1,3.8 	"/>'+
						'<rect x="11.5" y="6.2" width="2.7" height="1.5"/>'+
						'<rect x="11.4" y="10.2" transform="matrix(-0.7073 -0.7069 0.7069 -0.7073 14.0528 27.7078)" width="2.7" height="1.5"/>'+
						'<rect x="12" y="1.7" transform="matrix(0.7071 0.7071 -0.7071 0.7071 5.8986 -8.1298)" width="1.5" height="2.7"/>'+
					'</g>'+
				'</svg>';
			var term =          $(response).find('TermName').text(),
					term_sp =       $(response).find('SpanishTermName').text(),
					definition =    $(response).find('TermDefinition DefinitionText').text(),
					definition_sp = $(response).find('SpanishTermDefinition DefinitionText').text(),
					audio_path =    $(response).find('MediaLink[language=en]').attr('ref'),
					audio_path_sp = $(response).find('MediaLink[language=es]').attr('ref'),
					lang_txt = 		(current_language == 'english') ? 'en Español' : 'in English',
					link_txt = 		$(response).find('TermDefinition Dictionary').text(),
					the_link = 		'http://'+ link_txt +'/dictionary',
					audio_button = 	(audio_path !== undefined) ? '<a href="/nci/media/'+  audio_path +'.mp3" class="button-pronunciation">'+ audioIconSVG +'</a>' : '',
					audio_button_sp = (audio_path_sp !== undefined) ? '<a href="/nci/media/'+ audio_path_sp +'.mp3" class="button-pronunciation">'+ audioIconSVG +'</a>' : '';
					
			log('popupGlossary audio '+audio_path+' '+audio_path_sp);			
			var new_html = 
				'<div class="glossary-english">'+
					'<h3>'+ term +'</h3>'+ audio_button + '<br />' +					
					'<p>'+ definition +'</p>'+
					'<hr />'+
				'</div>'+
				
				'<div class="glossary-spanish">'+
					'<h3>'+ term_sp +'</h3>'+ audio_button_sp + '<br />' +				
					'<p>'+ definition_sp +'</p>'+
					'<hr />'+
				'</div>'+
				
				'<a href="#" id="language-toggle">'+ lang_txt +'</a>'+
				'<p class="margin-bottom0">Dictionary: <a href="'+ the_link +'" class="gray95 borderless" target="_blank">'+ link_txt +'</a></p>';

			$('#popup-content-area').empty().append(new_html);
			
			
			//setup popup contents
					
			//centerPopup();
			
			attachPopupGlossaryEvents();
			
			revealContent();			
		};
		
		var revealContent = function(){
			
			var sp = $('.glossary-spanish');
			var en = $('.glossary-english');
			
			//log('revealContent '+current_language);
			
			switch (current_language){
				
				case 'english':
					
					sp.hide();
					en.show();
					break;
				case 'spanish':
				
					sp.show();
					en.hide();
					break;
			}
			
			positionGlossaryPopup();
		};
		
		var playAudio = function(audio_path){
			
			log('audio_path  '+audio_path);

			$jPlayer.jPlayer("setMedia", { mp3: audio_path });
			$jPlayer.jPlayer("play");
			
		};

		init();
	};
})(jQuery);