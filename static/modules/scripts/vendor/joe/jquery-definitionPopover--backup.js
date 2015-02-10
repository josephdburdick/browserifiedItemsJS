/*jshint -W030 */

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

	$.fn.popupGlossary = function(options) {	

		var 
			el = this,
			defaults = {
				link_class:'glossary',
				popup_class:'',
				target_container_id:'nci-content-area',
				pointer_left_space:100,
				base_url:'/NCI/GlossaryTerm/',
				audioplayer_path:'/static/app/bower_components/jplayer/dist/jplayer/'//absolute path   // ../audioplayer   relative path, not url!
			},
			settings = $.extend(defaults, options),
			popup_status = 0,
			data_path,
			current_language = 'english',
			active_link,
			$container = $('.content-container'),
			$jPlayer;
		
		init = function(){
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
		
		log = function(s) {
			if (typeof console != "undefined") {
				console.log(s);
			} else {
				//alert(s);
			}
		};
		
		openPopupGlossary = function(target){
			
			//if we have one open, close it
			if (popup_status == 1){
				
				$('#popup-glossary').remove();
			}
			
			//build it
			popup_status = 1;
			buildPopupGlossary(target);
		};
		

		//disable popup
		closePopupGlossary = function(){
			//only if enabled
			if (popup_status == 1){
				
				//unbind events
				removePopupGlossaryEvents();
				
				//remove it
				//$('#popup-glossary').fadeOut('fast').remove();
				$('#popup-glossary').fadeOut('fast',function(){ $(this).remove(); });
				
				popup_status = 0;
				data_path = '';
			}
		};

		attachInitialGlossaryEvents = function(){

//alert('popupGlossary tot '+ $(el.selector).length );

			//open popup event
			$('body').delegate(el.selector, 'click', function(e){
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
		};
		
		attachPopupGlossaryEvents = function(){
			
log('attachPopupGlossaryEvents');
			var $p = $('#popup-glossary');
			
			//closing popup
			$p.delegate('#popup-glossary-close','click',closePopupGlossaryClick);
			
			//language toggle
			$p.delegate('#language-toggle','click',toggleLanguage);
			
			//audio
			$p.delegate('.button-pronunciation','click',playGlossarySound);
			
		};
		
		removePopupGlossaryEvents = function(){
			
			var $p = $('#popup-glossary');
			
			$p.undelegate('#popup-glossary-close','click',closePopupGlossaryClick);
			$p.undelegate('#language-toggle','click',toggleLanguage);
			$p.undelegate('.button-pronunciation','click',playGlossarySound);
		};
		
		closePopupGlossaryClick = function(e){
			e.preventDefault();
			
			closePopupGlossary();
			//$(this).blur();
			return false;
		};
		
		playGlossarySound = function(e){
			e.preventDefault();
			
			var href = $(e.currentTarget).attr('href');
			playAudio( href );
			
			return false;
		 };
		
		toggleLanguage = function(e){
			
			e.preventDefault();
			var lang_txt = (current_language == 'english') ? 'in English' : 'en Español';
			
			current_language = (current_language == 'english') ? 'spanish' : 'english';
			
log('toggleLanguage '+current_language);

			$('#language-toggle').text(lang_txt);
			
			revealContent();

			return false;
		};
		
		buildPopupGlossary = function(target){	

//log('buildPopupGlossary');
			
			active_link = target;
			
			var popup_html = 
			'<div id="popup-glossary">'+
				'<a href="#" class="float-rt" id="popup-glossary-close"></a>'+
				'<div id="popup-content-area">'+
				'	<span class="popup-loading">Loading...</span>'+
				'</div>'+
				'<div class="clear"></div>'+
				'<div class="pointer"></div>'+
			'</div>';

			// var popover_template =
			// '<div class="popover" role="tooltip">'+
			// 	'<div class="arrow"></div>'+
			// 	'<h3 class="popover-title"></h3>'+
			// 	'<div class="popover-content"></div>'+
			// '</div>';
			
			
			$container.append(popup_html); //body
			$('#popup-glossary').hide();
			$('#popup-glossary').popover('show');
			
			// positionGlossaryPopup();
			//prepare loader
			var id = $(target).attr('href');
			id = id.substr(1, id.length - 1);//after #
			//id = 'CDR' + parseInt(id,10);
			//log(id);
			var data_path = settings.base_url + id + '.xml';
			
			doPopupAjax(data_path);
		};
		
		// positionGlossaryPopup = function(){
			
		// 	if (popup_status === 0){
		// 		return;
		// 	}
			
		// 	var $doc = 		$(document),
		// 			$win = 		$(window),
		// 			target = 		$(active_link),
		// 			popup = 		$('#popup-glossary'),
		// 			a_top = 		$(target).position().top,
		// 			a_offset_top = $(target).offset().top,
		// 			a_left =		$(target).position().left,
		// 			v_padding = 	parseInt( popup.css('padding-top')) + parseInt( popup.css('padding-bottom')),
		// 			h_padding = 	parseInt( popup.css('padding-left')) + parseInt( popup.css('padding-right')),
		// 			popup_height = popup.height() + v_padding + 15,// 15 for pointer height...
		// 			popup_width = 	popup.width() + h_padding + 10,
		// 			new_top = 	Math.floor( a_top ), //- 55  - popup_height
		// 			new_left = 	Math.floor( a_left - settings.pointer_left_space ), //- 100
		// 			popup_top = 	new_top - popup_height,
		// 			too_top = 	popup_height + v_padding + 20,
					
		// 			offset = 		target.offset(),
		// 			d_top = 		offset.top - $doc.scrollTop(),
		// 			d_bottom = 	$win.height() - d_top - target.height(),
		// 			d_left = 		offset.left - $doc.scrollLeft(),
		// 			d_right =		$win.width() - d_left - target.width(),
		// 			page_right =	$container.width();
				
				
		// 	//scroll window if popup will be off top of screen
		// 	if (d_top < too_top){
		// 		//log ('too close to top');
		// 		//scroll so popup is visible
		// 		var scroll_top = a_offset_top - popup_height - 10;
				
		// 		//remove scroll listener before we scroll
		// 		//$(window).unbind('scroll');
				
		// 		//scroll page
		// 		$('html, body').animate({scrollTop:scroll_top}, 'fast', function(){
		// 			//restore scroll listener after we scroll
		// 			//$(window).scroll(function(){
		// 			//	positionGlossaryPopup();
		// 			//});
		// 		});
		// 	}
		// 	//recalc position of popup and pointer if too far right
		// 	if (page_right < new_left + popup_width){
		// 		new_left = page_right -  popup_width ;
				
		// 		//position pointer
		// 		var d_page_right = page_right - a_left;
		// 		var pointer_left = new_left - d_page_right;
		// 		popup.find('.pointer').css({left: pointer_left});
				
		// 		//log ('too close to right    d_page_right:'+d_page_right+'   pointer_left:'+pointer_left);// page_right:'+ page_right +'  popup_width:'+popup_width +'   '+ (new_left + popup_width));
		// 	}
			
			
			
		// 	//log('positionGlossaryPopup popup_top:'+ popup_top +'  ht:'+ popup_height +'  d:'+ d_top +'  too top:'+too_top );
			
		// 	//move popup and fade in
		// 	popup.css({top:popup_top, left:new_left}).fadeIn();
		// };
		
		doPopupAjax = function(data_path){
			
			//log(data_path);

			jQuery.ajax({
				//type: "GET",
				url: data_path,
				dataType: "xml",
				//data: query_string,
				success: function(response){
					
					//$("#"+settings.target_container_id).html('').html(response);
					processResponse(response);
				},
				error: function (xhr, ajaxOptions, thrownError){
					try {
						console.log("popupGlossary AJAX error: "+ xhr.status +" "+thrownError);
					} catch(e){}
					/*$("#"+settings.target_container_id).html("popupGlossary AJAX error: "+ xhr.status +" "+thrownError)
					processResponse();*/
				}       
			});
			
		};
		
		processResponse = function(response){	
		
			//log('processResponse');
			
			var term =          $(response).find('TermName').text(),
					term_sp =       $(response).find('SpanishTermName').text(),
					definition =    $(response).find('TermDefinition DefinitionText').text(),
					definition_sp = $(response).find('SpanishTermDefinition DefinitionText').text(),
					audio_path =    $(response).find('MediaLink[language=en]').attr('ref');
					audio_path_sp = $(response).find('MediaLink[language=es]').attr('ref');
					lang_txt = 		(current_language == 'english') ? 'en Español' : 'in English',
					link_txt = 		$(response).find('TermDefinition Dictionary').text(),
					the_link = 		'http://'+ link_txt +'/dictionary',
					audio_button = 	(audio_path !== undefined) ? '<a href="/nci/media/'+  audio_path +'.mp3" class="button-pronunciation">listen</a>' : '',
					audio_button_sp = (audio_path_sp !== undefined) ? '<a href="/nci/media/'+ audio_path_sp +'.mp3" class="button-pronunciation">listen</a>' : '';
					
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
				'<p class="gray95">Dictionary: <a href="'+ the_link +'" class="gray95 borderless" target="_blank">'+ link_txt +'</a></p>';

			$('#popup-content-area').empty().append(new_html);
			
			
			//setup popup contents
					
			//centerPopup();
			
			attachPopupGlossaryEvents();
			
			revealContent();			
		};
		
		revealContent = function(){
			
			var sp = $('.glossary-spanish');
			var en = $('.glossary-english');
			
			//log('revealContent '+current_language);
			
			switch (current_language){
				
				case 'english':
					
					sp.hide();//.slideUp('fast');
					en.show();//.slideDown('fast');
					break;
				case 'spanish':
				
					sp.show();//.slideDown('fast');
					en.hide();//.slideUp('fast');
					break;
			}
			
			// positionGlossaryPopup();
		};
		
		playAudio = function(audio_path){
			
			log('audio_path  '+audio_path);

			$jPlayer.jPlayer("setMedia", { mp3: audio_path });
			$jPlayer.jPlayer("play");
			
		};

		init();
	};
})(jQuery);