/*jslint node: true, browser: true, devel: true, strict:false, debug:true */
/*global $:false, Modernizr:false, picturefill: false, jwplayer: false , Devices*/

"use strict";

$.extend({
    replaceTag: function (currentElem, newTagObj, keepProps) {
        var $currentElem = $(currentElem);
        var i, $newTag = $(newTagObj).clone();
        if (keepProps) {
            var newTag = $newTag[0];
            newTag.className = currentElem.className;
            $.extend(newTag.classList, currentElem.classList);
            $.extend(newTag.attributes, currentElem.attributes);
        }
        $currentElem.wrapAll($newTag);
        $currentElem.contents().unwrap();
        return this; // Suggested by ColeLawrence
    }
});

$.fn.extend({
    replaceTag: function (newTagObj, keepProps) {
        return this.each(function() {
            $.replaceTag(this, newTagObj, keepProps);
        });
    }
});

// Check to see if string is empty or null
function isEmpty(str) {  return (!str || 0 === str.length); }
// Check to see if object is in an array
function include(arr, obj) {
    for(var i=0; i<arr.length; i++) { if (arr[i] == obj) return true;}
}

function quote(){
    if ($('.blockquote-container').length){
        $('.blockquote-container').each(function(i, el){
            var lastP = $(el).find('p').last();
            lastP.text($.trim(lastP.text()) + "\"");
        });
    }
}

var vertCenter = function(el, container, percentage){
    return Math.round($(container).outerHeight(true) / 2) + 'px';
};

function uniqueId(el, string , i){
    if (el.length === 1){
        return $(el).attr('id', string + i);
    } else {
        return $(el).each(function(int, item){
            $(item).attr('id', string + i);
        });
    }
}

function wW(){
    var $w = $(window);
    $('body').append('<div id="res">BOOM</div>');
    $("#res").css({
        display: "block",
        position: "fixed",
        bottom: "0",
        right: "0",
        color: "white",
        zIndex: "999",
        padding: "10px",
        background: "green"
    });
    
    $w.resize(function(){
        setTimeout(function(){
            $('#res').text($w.width());
        }, 500);
    });
    $('#res').text($w.width());
}

function createColumns(){
    var classes = [];
    $('.columns').each(function(i, el){
        if ($(el).is('[class*="col-"]')){
           classes = $(el).attr('class').split(/\s+/);
           $(classes).each(function(i, className){
            if (className.indexOf('col-') > -1){
                $(el).columnize({columns: (this.split('-')[1])});
            }
           });
        }
    });
}

function spasticNav(){
    if ($("#nav-primary-selected").length > 0){
        var navPrimarySelected = $("#nav-primary-selected");
        $("#nav-primary-spastic").spasticNav({ speed: 200 });
        $("#nav-primary-menu-container").hover(function() {
            $(this).addClass("dropdown-delay");
            setTimeout(function() {
                $(".dropdown-delay").addClass("dropdown-active");
            }, 200);
        }, function() {
            setTimeout(function() {
                $(".dropdown-delay").removeClass("dropdown-active dropdown-delay");
            }, 100);
        });

        // Resize the spasticNav highlight on window resize.
        $(window).resize(function(){
            setTimeout(function(){
                $('#primary-nav-blob').css({
                    width : navPrimarySelected.outerWidth(),
                    height : navPrimarySelected.outerHeight(),
                    left : navPrimarySelected.position().left,
                    top : navPrimarySelected.position().top + (7/2)
                });
            }, 100);
        });
    }
}
function tags(){
    $('ul.tags').each(function(i, el){
        var label = $(el).find('.label');
        $(el).css('padding-left', label.outerWidth(true) + 5);
    });
}
function selects(){
    // Custom select menu
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        $('select').selectpicker('mobile');
    } else{
        $('select').selectpicker();
    }
    if($('select.navigation').length > 0){
        $('select.navigation').each(function(){
            $(this).change(function(){
                window.location.href = $(this).val();
            });
        });
    }
    if($('.multiple-select').length > 0){
        $('.multiple-select').each(function(i, el){
            if ($(el).children('.option').length){
                $(el).find('.option').each(function(i, el){
                    uniqueId($(el).find('input'), 'checkbox-', i);
                    uniqueId($(el).find('label'), 'label-', i);
                    $(el).find('label').attr('for', $(el).find('input').prop('id'));
                });                
            }

            if($('.search-news').length){
                $('.search-news--filters').hide();
            }
        });
    }
    
}

function clickLink(target){ $('#' + target).trigger('click'); }
function anchor(target){
    var scrollTarget, scrollTargetOffset;
        scrollTarget = $('[name=' + target + ']');
    if (scrollTarget.parents('.mobile-nav-primary').length > 0 && $('.mobile-nav-primary').is(':visible')) {
        if (!$('.mobile-nav-toggle').hasClass('active')){
            $('.mobile-nav-toggle').addClass('active');
        }
    }
    scrollTargetOffset = scrollTarget.offset();
    if (scrollTarget.length > 0){ $('html, body').animate({ scrollTop: scrollTargetOffset.top - 20 });}
}

function lightbox(target){
    console.log('Going to execute lightbox: ' + target);
    if (target.slice(-1) == "/"){
        target = target.substring(0, target.length - 1);
    }
    if ($('[src="'+ target +'"]').length > 0){
        var lightboxTarget = $('[src="'+ target +'"]').parent('a[href="#modal-image"]');
        lightboxTarget.trigger('click');
    } else {
        alert("Sorry, but we couldn't locate "+ target +" on this page.");
    }
}

function carousel(lazyloadSpeed){
    $('.photoset').loadPhotoset();
    $('.carousel').loadCarousel();
    $('.carousel').on('slid.bs.carousel',function(e){
        picturefill({reevaluate: true});
        $(window).trigger('resize');
    }).trigger('slid.bs.carousel');
}

function calendars(){
    var 
        calendarShow = function(calendar){
        },
        changeDate = function(calendar){
        },
        changeYear = function(calendar){
        },
        changeMonth = function(calendar){
        };


    if ($('.calendar').length > 0){
        $('.calendar').each(function(i, el){
            uniqueId(el, 'calendar-', i);
            $('#calendar-' + i).datepicker({
                todayHighlight: true,
                show: calendarShow(this),
                changeDate: changeDate(this),
                changeYear: changeYear(this),
                changeMonth: changeMonth(this)
            });
        });
    }
}

function accordion(){
    
    $('#expandAll').on('click',function(e){
        e.preventDefault();
        var id = $(e.currentTarget).data('parent');
        $(id).find('.panel-collapse').removeClass('collapse').addClass('in').end()
            .find('[data-toggle="collapse"]').removeClass('collapsed');
    });

    $('#collapseAll').on('click',function(e){
        e.preventDefault();
        var id = $(e.currentTarget).data('parent');
        $(id).find('.panel-collapse').addClass('collapse').removeClass('in').end()
            .find('[data-toggle="collapse"]').addClass('collapsed');
    });
    // This was to override bootstrap's normal behavior to trigger collapse all or expand all.
    // This changes the class for the .indicator which says it's on or off.
    // *** NOTE: I have removed the collapse functionality from Bootstrap and programmed it myself.
    $('a[data-toggle="collapse"]').on('click',function(e){
        e.preventDefault();
        var id = $(this).attr('href');
        $(this).toggleClass('collapsed');
        $(id).toggleClass('in');
    });
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substrRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};

function urlhash(){
    var hashVal, hashAction, actions, action, target;
    if ( window.location.hash ) {
        hashVal = window.location.hash;
        actions = ['anchor', 'lightbox', 'image', 'link'];
        hashAction = hashVal.split("=")[0].split("#")[1];
        if (include(actions, hashAction)){
            action = hashVal.split("=")[0].split('#')[1];
            target = hashVal.split("=")[1];

            if (include(actions, action)){
                if (action === "anchor"){
                    anchor(target);
                }
                else if (action === "link"){
                    clickLink(target);
                }
                else if (action === "lightbox" || "image"){
                    lightbox(target);
                }
                return true;
            } else {
                console.log("Target undefined.");
            }
        } else {
            tabTrigger();
        }
    }
}

function hash(){
    $(window).on('hashchange', function(){
        if (urlhash() === false){
            debugger;
        }
    }).trigger('hashchange');
}

function mobileNav(){
    $('.mobile-nav-toggle, .nav-item-parent').on('click',function(e){
        $(this).toggleClass('active').next('.nav').toggleClass('active');
        e.preventDefault();
    });
}

function lazyload(){
    $(window).on('scroll',function(){
        if ($('[data-srcset]').length > 0){
            $('[data-srcset]:not(.image-loaded)').each(function(i, image){
                if ($(image).visible( true, true )){
                    $(image).lazyloadsrcset();
                    picturefill({reevaluate: true});
                }
            });
        }
    }).trigger('scroll');
}

function videos(){
  $('.content-body--video').each(function(i, el){
    uniqueId(el, 'video-', i);
    $('#video-' + i).loadVideo();
  });
  $('[data-content--duration]').contentDuration();
}

function audio(){
    if ($('.jp-jplayer').length > 0){
        var i = 1;
        $('.jp-jplayer').each(function(i, el){
            $(el).attr('id', 'jquery_jplayer_'+i)
            .next('.jp-audio').attr('id', 'jp_container_'+i)
            .end().loadAudio();
            i++;
        });
    }
}

function tabs(){

    $('.nav-tabs').tabdrop('layout');
    $('a[data-toggle="tab"]').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
        
        // set url hash
        if(history.pushState) {
            history.pushState(null, null, '#' + $(e.target).attr('href').substr(1));
        }
        else {
            location.hash = '#' + $(e.target).attr('href').substr(1);
        }
    }).on('shown.bs.tab', function(e) {
        e.preventDefault();
        tags();
    });
    $(window).on('resize', function(){
        $('.nav-tabs').tabdrop('layout');
    });

}
function tabTrigger(){
    /* hashval doesn't match any of the predefined actions. 
    Fall back: find any tabs on the page that match the hashval
    
    Handle bootstrap tabs via urlhash */
    if ($('a[href="' + location.hash + '"]').length){
        $('a[href="' + location.hash + '"]').tab('show');
    } 
}

function multipleSelectTags(){
    var tagTemplate = function (el){
        return [
           '<span class="tag" data-checkbox="' +
                el.id + '" data-bucket="' + 
                $(el).data('bucket') + '">'+ 
                $(el).next('label').text() +
                '<span class="close">&times;</span>',
            '</span>'
        ].join('\n');
    };
    if ($('[data-function="tags"]').length){
        $('[data-function="tags"]').each(function(i, el){
            uniqueId(el, 'tag-controller-', i);
        });
        var closeIcon = (function(){
            return [
                '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',
                     'width="17.1px" height="17.1px" viewBox="0 0 17.1 17.1" enable-background="new 0 0 17.1 17.1" xml:space="preserve">',
                '<polygon fill="#ffffff" points="17.1,1.1 16,0 8.5,7.5 1.1,0 0,1.1 7.5,8.5 0,16 1.1,17.1 8.5,9.6 16,17.1 17.1,16 9.6,8.5 "/>',
                '</svg>'
            ];
        })();
        
        $('[data-function="tags"] input[type="checkbox"]').on('change', function(){
            if ($(this).prop('checked') === false){
                var id = $(this).prop('id');
                $(this).closest('[data-function="tags"]').find('[data-checkbox="'+id+'"]').remove();
            } else {
                $(this).closest('.input-wrap').append(tagTemplate(this));    
            }
        });

        $('[data-function="tags"]').on('click', '.tag .close', function(){
            var id = $(this).parent().data('checkbox'),
                tag = $(this).parent('.tag');
            $('[data-function="tags"]').find("#"+id).attr('checked', false);
            $(tag).remove();
        });

    }
}

function typeahead(){
    function parsePeople(people){
        var peopleNames = [];
        $(people).each(function(i, person){
            peopleNames.push(person.name);
        });
        return peopleNames;
    }
    var tagTemplate = function (el){
        return [
           '<span class="tag" data-uid="' + el.id + '">'+ $(el).val() +'<span class="close">&times;</span></span>'
        ].join('\n');
    };

    $('.typeahead').each(function(i, el){
        if ($(el).data('json')){
            uniqueId(el, 'typeahead-', i);
            var requestUrl = $(el).data('json'),
                names;
            
            $.get(requestUrl, function(data){
                names = parsePeople(data);
                $('#typeahead-' + i)
                    .typeahead({
                        source: names
                    });
            },'json');
            $(document).keypress(function(e) {
              if($(el).is(":focus") && e.which == 13) {
                if (include(names, $(el).val())){
                    $(el).closest('.input-wrap')
                        .append(tagTemplate(el)).end()
                        .val('');
                }
              }
            });
        }
    });
}

function popovers(){
    $('main.container-fluid a.glossary').popupGlossary({
        link_class: 'glossary',
        popup_class: 'popover'
    });
}
function forms(){
    tags();
    multipleSelectTags();
    typeahead();
    newsfilter();

    //Clear selected elements on form
    $('form').on('click', '.search-news--clear-filters, .form-reset-fields', function(e){
        e.preventDefault();
        $(e.currentTarget).closest('form')[0].reset();
        $(e.currentTarget).closest('form').find('span.tag').remove();
    });
}
function newsfilter(){
    if($('.search-news').length){
        $('.search-news--filter-toggle').on('click', function(e){
            e.preventDefault();
            var toggleText = $(this).find('.toggle-text');
            $(this).toggleClass('active')
                .closest('form').find('.search-news--filters').toggle()
                .end().find('.caret').toggleClass('up');

            if ($(this).hasClass('active')){
                $(toggleText).text("Hide filters");
            } else {
                $(toggleText).text("Show filters");
            }
        });
    }
}

function modals(){
    var linkImageUrl, linkImageTitle, linkImageCaption, linkImageCredit, modalID, modalBody, modalContent, videoTemplate;
    $('.video-carousel, .thumb, .module-video, .module-image, .photoset').on('click', '[data-toggle="modal"]', function(e){
        e.preventDefault();
        modalID = $($(this).attr('href'));
        modalBody = modalID.find('.modal-body');

        if ($(this).attr('href') == "#modal-image"){
            linkImageUrl = $(this).data('modal-url');
            linkImageTitle = $(this).data('modal-title');
            linkImageCaption = $(this).data('modal-caption') || $(this).parent().find('figcaption').html();
            linkImageCredit = $(this).data('modal-credit');
            modalContent = '<img alt="image" class="modal-image" src="'+ linkImageUrl +'">';

                if (linkImageTitle){
                    modalContent += '<h4 class="modal-title" id="modal-image-title">'+ linkImageTitle +'</h4>';
                }
                if (linkImageCaption){
                    modalContent += '<figcaption>' + linkImageCaption +'</figcaption>';
                }
                if (linkImageCredit){
                    modalContent += [
                        '<small class="modal-credit">',
                            '<label>Photo credit:</label> <span class="modal-credit-source">' + linkImageCredit +'</span>',
                        '</small>'
                    ].join('\n');
                }
            modalBody.html(modalContent);
        }
        if ($(this).attr('href') == "#modal-gallery"){
            if($(this).parents('.modal').length === 0){
                modalBody.empty();
                $(this).loadModalCarousel();
                $('#modal-gallery .carousel').on('slid.bs.carousel',function(e){
                    picturefill({reevaluate: true});
                }).trigger('slid.bs.carousel');
            }
        }
        if ($(this).attr('href') == "#modal-video"){
            modalBody.empty();
            var videoTemplate = $(this).loadVideo({autostart: true});
            modalBody.html(videoTemplate);
        }
    });

    // Removes hash from URL after user exits
    $('#modal-image').on('hidden.bs.modal', function (e) {
        if (window.location.hash){
            window.location = window.location.href.substr(0, window.location.href.indexOf('#'));
            e.preventDefault();
        }
    });
    $('#modal-video').on('hide.bs.modal', function (e) {
        $(e.currentTarget).find('.modal-body').empty();
    });

    /* Special case for NCI content since can't touch the HTML... */
    $('.photo-wrapper-rt').on('click', function(e){
        $('#modal-image').modal('show');

        var markup = $(this).html(),
            img = $(markup).find('img'),
            caption = $(markup).find('.popup-photo-description');
            img.attr('src', img.attr('longdesc'));
            
        var template = ['<img alt="image" class="modal-image" src="'+ $(img).attr('longdesc') +'">',
                '<figcaption><p>',
                    caption.html(),
                '</p></figcaption>'].join('\n');

        $('#modal-image').find('.modal-body').html(template).end().modal('show');
    });
}

function fallbacks(){
    // If the browser doesn't support SVGs search for a png with the same filename
    if (!Modernizr.svg) {
        var imgs = document.getElementsByTagName('img');
        var svgExtension = /.*\.svg$/;
        var l = imgs.length;
        for(var i = 0; i < l; i++) {
            if(imgs[i].src.match(svgExtension)) {
                imgs[i].src = imgs[i].src.slice(0, -3) + 'png';
                console.log(imgs[i].src);
            }
        }
    }
}

function scrollbars(){
    var options = {
        scrollInertia: 0,
        normalizeDeltae: true,
        scrollEasing: 'linear',
        alwaysShowScrollbar: 1,
        mouseWheel: {
            deltaFactor: 1
        }        
    };

    $('.mCustomScrollbar').each(function(i, el){
        if ($(el).data('theme'))
            options.theme = $(el).data('theme');
        $(el).mCustomScrollbar(options);
    });
}
function interfaces() {
    picturefill({reevaluate: true});
    calendars();
    lazyload();
    spasticNav();
    mobileNav();
    forms();
    selects();
    modals();
    carousel(200);
    accordion();
    videos();
    tabs();
    hash();
    quote();
    audio();
    

    // Column polyfill
    if (!Modernizr.csscolumns){
        createColumns();
    }

    // Custom select menu
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
        $('select').selectpicker('mobile');
    } else{
        $('select').selectpicker();
    }

    /* ==== DEVELOPMENT ONLY ==== */
    // wW();
}

$(document).ready(function() {
    fallbacks();
    interfaces();
    Devices.init();
});
$(window).load(function(){
    $(window).trigger('scroll');
    scrollbars();    
});
