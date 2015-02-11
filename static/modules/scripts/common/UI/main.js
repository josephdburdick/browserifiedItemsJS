module.exports = function(MyApp) 
{
    'use strict';

    var $ = MyApp.vendor.jquery;
/*
    YSM Helpers

    by: Joe Burdick
    License: MIT
    
*/
/*jshint -W087 */

// $(el).isOverflowWidth(); // true/false
(function($) {
    "use strict";
    var width = function(t, el) {
        return t.width() > el.width();
    };
    $.fn.isOverflowWidth = function() {
        return this.each(function() {
            var el = $(this);
            if (el.css("overflow") == "hidden") {
                var text = el.html();
                var t = $(this.cloneNode(true)).hide().css('position', 'absolute').css('overflow', 'visible').width('auto').height(el.height());
                el.after(t);

                
                return(width(t, el));
            }
        });
    };
});

// $(el).isOverflowHeight(); // true/false
(function($) {
    "use strict";
    var height = function(t, el) {
        return t.height() > el.height();
    };
    $.fn.isOverflowHeight = function() {
        var el = $(this);
        return el[0].scrollHeight -1 > el[0].clientHeight;
    };
});

/*
    Lazy Load srcset

    by: Joe Burdick
    License: MIT
    
*/

$.fn.lazyloadsrcset = function(options){
    var settings = $.extend({ speed: 0 }, options);
    var inModal = function (obj) { return $(obj).parents('.modal').length > 0; };
    var inCarousel = function (obj) { return $(obj).parents('.carousel').length > 0; };
    var inThumb = function(obj) { return $(obj).parents('.thumb, .carousel-featured-thumb').length > 0; };
    return this.each(function(i, el){
        
        if ($(el).data('srcset') && !$(el).attr('srcset')){
            $(el)
                .attr('srcset', $(el).data('srcset'))
                .attr('src', $(el).data('src')).addClass('lazy-loaded');
        }
        if (inModal(el)){ // el image is in modal
            if ($(el).data('modalsrcset') && $(el).attr('srcset') !== $(el).data('modalsrcset')){
                $(el)
                    .attr('data-srcset', $(el).data('modalsrcset'))
                    .attr('srcset', $(el).data('modalsrcset'));
                if ($(el).attr('data-srcset') && $(el).attr('srcset') !== $(el).data('modalsrcset').split(',')[0].split(' ')[0]){
                    $(el).attr('src', $(el).data('modalsrcset').split(',')[0].split(' ')[0]); //Grab first image src from modalsrcset
                }
            }
        }
        if (inThumb(el)){
            if ($(el).data('thumbsrcset') && $(el).attr('srcset') !== $(el).data('thumbsrcset')){
                $(el)
                    .attr('srcset', $(el).data('thumbsrcset'))
                    .attr('src', $(el).data('src')).addClass('lazy-loaded');
            }
        }
    });
};
/*
    jslint node: true, browser: true, devel: true, strict:false, debug:true 

    Load Bootstrap Carousel
    Dependencies: lazyloadsrcset

    by: Joe Burdick
    
*/
/*jshint -W087 */

(function () {
   'use strict';
    var globalOverlay = false,
        captionBelow = false;
    var carouselPagination = function(carousel) {
        var hasPermalink = function(){
            if (carousel.attr('data-permalinktext'))
                return true;
            else
                return false;
        }; 

        var permalink = function(){
            if (hasPermalink())
                return "<a href='"+ carousel.attr('data-permalink') +"' class='permalink'>"+ carousel.attr('data-permalinktext') +"</a>";
            else 
                return "";
        };

        return [
            "<a href='#' class='pagination-left'>",
            "<svg version='1.1' id='pagination_left' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='10px' height='10px' viewBox='0 0 10 10' enable-background='new 0 0 10 10' xml:space='preserve'>",
            "<polygon points='10,10 10,0 0,5 '/></svg></a>",
            "<span class='pagination-status'><span class='pagination-status-current'></span> of <span class='pagination-status-total'></span></span>" + permalink(),
            
            "<a href='#' class='pagination-right'>",
            "<svg version='1.1' id='pagination_right' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='10px' height='10px' viewBox='0 0 10 10' enable-background='new 0 0 10 10' xml:space='preserve'>",
            "<polygon points='0,0 0,10 10,5 '/>",
            "</svg></a>"
        ].join('\n'); 
    },
    carouselArrows = function(carousel){
        return [
            "<a href='#' class='carousel-chevron carousel-left' data-target='#"+ carousel.attr('id') +"'>",
                "<svg version='1.1' id='chevron_left' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
                "width='10.9px' height='18px' viewBox='0 0 10.9 18' enable-background='new 0 0 10.9 18' xml:space='preserve'>",
                "<g><polygon fill='#ffffff' points='9.5,0 10.9,1.5 2.9,9 10.9,16.6 9.5,18 0,9'/></g></a>",
            "<a href='#' class='carousel-chevron carousel-right' data-target='#"+ carousel.attr('id') +"'>",
                "<svg version='1.1' id='chevron_right' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'",
                "width='10.9px' height='18px' viewBox='0 0 10.9 18' enable-background='new 0 0 10.9 18' xml:space='preserve'>",
                "<g><polygon fill='#ffffff' points='1.4,18 0,16.6 8,9 0,1.5 1.4,0 10.9,9'/></g>",
                "</svg></a>"
        ].join('\n');  
    },
    carouselAutoplay = function(carousel, autoPlayStatus){
        var isPlaying = JSON.parse(autoPlayStatus),
            playSVG = [
                "<svg version='1.1' id='icon_play' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='30px' height='30px' viewBox='0 0 30 30' enable-background='new 0 0 30 30' xml:space='preserve'>",
                    "<path d='M15,0C6.7,0,0,6.7,0,15c0,8.3,6.7,15,15,15s15-6.7,15-15C30,6.7,23.3,0,15,0z M11.2,21.7V8.8l9.9,6.5L11.2,21.7z'/>",
                "</svg>"
            ].join('\n'),

            pauseSVG = [
                "<svg version='1.1' id='icon_pause' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 30 30' style='enable-background:new 0 0 30 30;' xml:space='preserve'>",
                    "<path d='M15,0C6.716,0,0,6.716,0,15c0,8.284,6.716,15,15,15s15-6.716,15-15C30,6.716,23.284,0,15,0z M11.563,21.34V9.59h2v11.75H11.563z M16.438,21.34V9.59h2v11.75H16.438z'/>",
                "</svg>"
            ];
            return "<a href='#' class='carousel-autoplay' data-autoplay='"+ isPlaying +"' data-target='#"+ carousel.attr('id') +"'><span class='carousel-autoplay-icon'>"+ (isPlaying ? pauseSVG : playSVG) +"</span><span class='carousel-autoplay-text'>"+ (isPlaying ? "Pause" : "Play") +" Slideshow</span></a>";
    },
    autoPlayStatus = function(carousel){
        if ($(carousel).attr('data-autoplay'))
            return JSON.parse($(carousel).attr('data-autoplay'));
        else
            return false;
    },
    loadSlideContent = function(carousel){
        var contentArea = $(carousel).find('.carousel-content');
        contentArea.empty();
        if (carousel.find('.carousel-main').children('.carousel-inner').find('.item.active').children('[data-content]').length){
            contentArea.show().html(carousel.find('.carousel-main').children('.carousel-inner').find('.item.active').children('[data-content]').html());
        } else{
            contentArea.hide();
        }
    };
    
    $.fn.loadSlides = function(options){

        var settings = $.extend({ speed: false }, options),
            inModal = function (obj) { return $(obj).parents('.modal').length > 0; };

        if ($(this).find('img[data-srcset], img[data-modalsrcset]').length > 0){
            var items = $(this).find('.item'),
            activeItem = $(this).find('.item.active'),
            images = [];
            if (activeItem.index() === 0){
                images.push($(this).find('.item').last()[0]);
            } else {
                images.push($(this).find('.item.active').prev()[0]);    
            }
            images.push($(this).find('.item.active')[0]);
            if (activeItem.index() == items.length - 1){
                images.push($(this).find('.item').first()[0]);
            } else {
                images.push($(this).find('.item.active').next()[0]);    
            }
            if ($.isArray(images)){
                var imageArray = [];
                $(images).each(function(i, el){
                    var images = $(el).find('[data-srcset], [data-modalsrcset], [data-thumbsrcset]');
                    imageArray.push(images);
                });
                $(imageArray).lazyloadsrcset();
            } else {
                $(images).lazyloadsrcset();    
            }
        }
        return this;
    };

    $.fn.loadCarousel = function(options){
        var settings = $.extend({
            speed: false
        }, options),
            arrowData = false;

        function updatePagination(carousel, event){
            var slides = $(carousel).find('.carousel-main .item'),
                activeSlide = slides.parent().find('.active'),
                siblingThumbs = activeSlide.siblings(),
                c = function() { return $(activeSlide).find('.item'); },
                cSlides = $(c).find('.item');
            if (carousel.children('.pagination-permalink')){
                var permalink = carousel.find('.pagination-permalink');
                
                permalink
                    .attr('href', carousel.data('permalink'))
                    .text(carousel.data('permalinktext'));
            }
            var paginationStatus = function() {
                if (carousel.hasClass('photo-carousel')){
                    var p = activeSlide.parent().parent().parent().find('.carousel-pager'),
                        pThumbs = $(p).find('.thumb'),
                        pActiveSlide = $(p).find('.item.active'),
                        pActiveSlideThumbs = $(pActiveSlide).find('.thumb'),
                        pActiveSlideFirstThumb = pActiveSlideThumbs.first(),
                        pActiveSlideLastThumb = pActiveSlideThumbs.last(),
                        pActiveThumb = $(pActiveSlide).find('.thumb.active'),
                        pActiveThumbSiblings = $(pActiveThumb).siblings('.thumb');
                        
                        return (pActiveSlideFirstThumb.index('.thumb') + 1) + " – " + (pActiveSlideLastThumb.index('.thumb') + 1);
                    
                } else if ($(carousel).hasClass('video-carousel')){
                    var v = activeSlide.parent().parent().parent().find('.carousel-main'),
                        vThumbs = $(v).find('.video-carousel--item'),
                        vActiveSlide = $(v).find('.item.active'),
                        vActiveSlideThumbs = $(vActiveSlide).find('.video-carousel--item'),
                        vActiveSlideFirstThumb = vActiveSlideThumbs.first(),
                        vActiveSlideLastThumb = vActiveSlideThumbs.last(),
                        vActiveThumb = $(vActiveSlide).find('.thumb.active'),
                        vActiveThumbSiblings = $(vActiveThumb).siblings('.video-carousel--item');
                       
                        return (vActiveSlideFirstThumb.index('.video-carousel--item') + 1) + " – " + (vActiveSlideLastThumb.index('.video-carousel--item') + 1);
                }    
            },
            paginationTotal = function () {
                if (carousel.hasClass('photo-carousel')){
                    return slides.length;
                } else {
                    return $(c).find('.video-carousel--item').length;
                }
            };
            
            if (!cSlides.hasClass('left')){
                carousel.parent().find('.pagination-status-current')
                    .text(paginationStatus()).end()
                .parent().find('.pagination-status-total')
                    .text(paginationTotal());    
            }
        }

        function updatePager(carousel, event){
            var pager = carousel.find('.carousel-pager'),
                pagerID = pager.attr('id'),
                activeThumb = $('[data-slide-to="'+ $(event.currentTarget).find('.active').index() +'"]'),
                activeSlide = activeThumb.parent('.item');
                
            // Update new pager thumbnail
            pager.find('.item a').removeClass('active').find('.thumb').removeClass('active');
            activeThumb.addClass('active');

            // Find lazy loaded thumbnails 
            activeSlide.find('img').lazyloadsrcset({ speed: settings.speed });
            if (!activeThumb.parent('li').hasClass('active')){
                $('#'+pagerID).carousel($(activeSlide).index());
            }
            pager.carousel('pause');
        }

        function updateTitle(carousel, event){
            if ($(event.currentTarget).find('.item.active').find('a[data-modaltitle]').length > 0){
                var title = $(event.currentTarget).find('.item.active').find('a[data-modaltitle]').attr('data-modaltitle');
                carousel.parents('.modal-content').find('.modal-header .modal-title').text(title);
            }
        }
        // Gather each carousel and create an ID out of the classes, appending the index to differentiate.
        return this.each(function(index){

            // Execute carousel if there's more than 1 slide
            if ($(this).find('.carousel-inner .item').length == 1){
                $(this).find('.item [data-srcset]').lazyloadsrcset();
            }
            if ($(this).find('.carousel-inner .item').length > 1){
                // Give carousel an id if it doesn't already have one;
                if (!$(this).attr('id')){
                    $(this).attr('id', $(this).attr('class').split(' ').join('-') + "-" + index);    
                }
                
                var carousel  = $(this),
                    inner     = $(this).find('.carousel-inner'),
                    slides    = $(this).find('.carousel-inner .item'),
                    inSidebar = function () { return $(carousel).parents('.side-column').length > 0; },
                    inContent = function () { return $(carousel).parent('.content-body').length > 0; },
                    inModal   = function () { return $(carousel).parents('#modal-gallery').length > 0; },
                    hasPager  = function () { return (inContent() || inModal()) && carousel.hasClass('hasPager'); },
                    isVideo   = function () { return $(carousel).hasClass('video-carousel'); };

                // Give the inner, main carousel a parent div with it's own ID
                var mainCarouselID = $(carousel).attr('class').split(' ').join('-') + "-main-" + index;
                carousel.find(inner).wrap('<div id="'+ mainCarouselID +'" class="carousel-main carousel slide"></div>');

                /*

                Pagination 

                */
                if (!inContent() && !inModal() && !isVideo() && inSidebar() && slides.length > 1){
                    carousel.find('#'+mainCarouselID).after('<div class="carousel-pagination"></div>');
                } 
                if (inModal() && slides.length > 5 || 
                    inContent() && slides.length > 5 || 
                    inContent() && isVideo() && slides.length > 1)
                {
                    carousel.find('#'+mainCarouselID).before('<div class="carousel-pagination"></div>');
                    carousel.find('.carousel-pagination').addClass('dark');
                }
                
                carousel.find('.carousel-pagination').html(carouselPagination(carousel));

                //bind events to newly created elements
                $('.carousel .carousel-pagination a[class^="pagination-"]').unbind('click').on('click', function(e){
                    e.preventDefault();
                    if ($(e.currentTarget).parent().parent().hasClass('video-carousel')){
                        if ($(e.currentTarget).hasClass('pagination-left')){
                            $(e.currentTarget).parent().siblings('.carousel-main').carousel('prev');                        
                        } else {
                            $(e.currentTarget).parent().siblings('.carousel-main').carousel('next');
                        }
                    }
                    else if($(this).parent('.carousel-pagination').hasClass('dark')){
                        if ($(e.currentTarget).hasClass('pagination-left')){
                            $(e.currentTarget).parent().siblings('.carousel-pager').carousel('prev');                        
                        } else {
                            $(e.currentTarget).parent().siblings('.carousel-pager').carousel('next');
                        }
                    } else {
                        if ($(e.currentTarget).hasClass('pagination-left')){
                            $(e.currentTarget).parent().siblings('.carousel-main').carousel('prev');                        
                        } else if ($(e.currentTarget).hasClass('pagination-right')) {
                            $(e.currentTarget).parent().siblings('.carousel-main').carousel('next');
                        }
                    }       
                });

                updatePagination(carousel);

                /*

                Pager

                */
                if (hasPager()){
                    var thumbs = [], str, activeClass;

                    $(slides).each(function(i, el){
                        if ($(el).attr('class').indexOf('active') > 0){
                            activeClass = " active";
                        } else {
                            activeClass = "";
                        }
                        // Grab each image and wrap it in a link that will toggle carousel.
                        var img = $(el).find('img');
                        var str = (function() {
                            return [ 
                                '<a href="#" class="thumb' + activeClass + '" data-target="#'+ mainCarouselID +'" data-slide-to="'+ i +'">',
                                    '<img src="'+ img.attr('src') +'" ',
                                        'data-thumbsrcset="'+ img.attr('data-thumbsrcset') +'" ',
                                        'data-srcset="'+ img.attr('data-srcset') +'" ',
                                        'data-modalsrcset="'+ img.attr('data-modalsrcset') +'" ',
                                        'alt="'+ img.attr('alt')+'">',
                                '</a>'
                            ].join('\n');
                            })();
                        thumbs.push(str);
                    });
                    // Populate pager with all the thumbs
                    carousel.find('#'+ mainCarouselID).before('<div id="'+ mainCarouselID +'-pager" class="carousel-pager carousel slide"></div>').end()
                        .find('.carousel-pager').html(thumbs);

                    // Wrap every 5 thumbnails into a slide
                    for( var i = 0; i < thumbs.length; i+=5 ) {
                        var a = carousel.find('.carousel-pager a');
                        a.slice(i, i+5).wrapAll('<div class="item"></div>');
                    }
                    carousel.find('.carousel-pager .item')
                        .wrapAll('<div class="carousel-inner"></div>')
                        .find('.active').parent().addClass('active');

                    // Execute carousel
                    $('#' + mainCarouselID +'-pager').carousel('pause');
                    $('#' + mainCarouselID +'-pager').on('slid.bs.carousel',function(e){
                        $(this).loadSlides();
                        updatePagination(carousel, e);
                    }).trigger('slid.bs.carousel');
                }

                /*

                Add Arrows

                */
                if (!isVideo() && inContent() || inModal()){
                    if ($(this).hasClass('figcaptionArrows')){
                        var figCaptionArrows = function(){
                            return [
                                '<a class="carousel-chevron carousel-left"',
                                    'href="#'+ $(carousel).attr('id') +'" role="button" data-slide="prev">',
                                    '<svg version="1.1" id="svg-carousel-arrow-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="33px" viewBox="0 0 18 33" enable-background="new 0 0 18 33" xml:space="preserve"><g><polygon points="16.6,0 18,1.4 2.8,16.5 18,31.6 16.6,33 0,16.5  "/></g></svg>',
                                    '<span class="sr-only">Previous</span>',
                                '</a>',
                                '<a class="carousel-chevron carousel-right"',
                                    'href="#'+ $(carousel).attr('id') +'" role="button" data-slide="next">',
                                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="33px" viewBox="0 0 18 33" enable-background="new 0 0 18 33" xml:space="preserve"><g><polygon points="1.4,33 0,31.6 15.2,16.5 0,1.4 1.4,0 18,16.5"/></g></svg>',
                                    '<span class="sr-only">Next</span>',
                                '</a>'
                            ].join('\n');  
                        };
                        carousel.find('#'+ mainCarouselID).find('figcaption p:last-child').after(figCaptionArrows());
                    } else {
                        carousel.find('#'+ mainCarouselID).find('.carousel-inner').after(carouselArrows(carousel));    
                    }
                    
                    $('.carousel .carousel-chevron').unbind('click').on('click', function(e){
                        e.preventDefault();
                        if ($(e.currentTarget).hasClass('carousel-left')){
                            $(this).closest('.carousel-main').carousel('prev');
                        } else {
                            $(this).closest('.carousel-main').carousel('next');
                        }
                    });
                }

                /*

                Add Autoplay controls

                */
                var autoPlayContainer = carousel.find('.carousel-autoplay-container');
                if (carousel.hasClass('hasAutoplay')){

                    var autoPlayActiveClass = (function() {
                        if (autoPlayStatus(carousel)){
                            return " autoplay-on";
                        } else {
                            return "";
                        }
                    })();
                    
                    carousel.find('#'+ mainCarouselID).find('.carousel-inner')
                        .after("<div class='carousel-autoplay-container" + autoPlayActiveClass + "'></div>");
                    autoPlayContainer = carousel.find('.carousel-autoplay-container');
                    autoPlayContainer.html(carouselAutoplay(carousel, autoPlayStatus(carousel)));
                }
                if (carousel.data('autoplay') === false)
                    carousel.carousel({interval: false, pause: 'hover'});

                /*

                Add dynamic carousel content

                */
                if (inContent() || inModal()){
                    carousel.find('.carousel-main').after('<div class="carousel-content"></div>');
                    loadSlideContent(carousel);
                }

                /*

                Setup autoplay behavior for carousel

                */
                if (JSON.parse(autoPlayStatus(carousel)))
                    $('#'+mainCarouselID).carousel('cycle');
                else
                    $('#'+mainCarouselID).carousel('pause');

                $(autoPlayContainer).unbind('click').on('click', 'a.carousel-autoplay', function(e){
                    e.preventDefault();

                    var autoPlayBtn = $(this);

                    if (autoPlayContainer.hasClass('autoplay-on')){
                        $('#' + mainCarouselID).carousel('pause');
                        autoPlayContainer
                            .removeClass('autoplay-on') 
                            .html(carouselAutoplay(carousel, false));  
                    } else {
                        $('#' + mainCarouselID).carousel({ interval: 200, cycle: true });
                        autoPlayContainer
                            .addClass('autoplay-on')
                            .html(carouselAutoplay(carousel, true));   
                    }
                });


                /*

                Default action on main carousel slid

                */
                carousel.on('slid.bs.carousel',function(e){ 

                    $(this).loadSlides();
                    if(hasPager())
                        updatePager(carousel, e); loadSlideContent(carousel);
                    if (inModal())
                        updateTitle(carousel, e);
                    updatePagination(carousel, e);

                    // Stop all videos within slideshow on slid.
                    $(e.currentTarget).find('.content-body--video').each(function(i, el){
                        
                        if ($(el).find('iframe').length > 0){
                            var vimeoiframeId = $(el).find('iframe').attr('id');
                            $('#' + vimeoiframeId).vimeo("pause");
                        }

                        if ($(el).find('.jw-body--video').length > 0){
                            var videoId = $(el).find('.jw-body--video .jwplayer').attr('id');
                            jwplayer(videoId).pause(true);
                        }
                                                        
                    });
                }).trigger('slid.bs.carousel');


                /*

                Handle 

                */
                if (carousel.data('arrows')){
                   (function(){
                        var template,
                            arrow,
                            thinSVGIcon;
                        arrowData = carousel.data('arrows');

                        // Dynamically position elements within slideshow
                        if (carousel.data('arrows')){
                            arrowData = carousel.data('arrows');
                            
                            // Dynamically position global overlay
                            if (arrowData.position === "left")
                                carousel.find('.overlay-global').addClass('right');
                            else
                                carousel.find('.overlay-global').addClass('left');

                            $(carousel).find('.item').each(function(i, el){
                                // Dynamically position caption and image-wrap
                                if (arrowData.position === "left"){
                                    $(el).find('.image-wrap').addClass('left').end().find('.caption,.overlay').addClass('right');
                                }
                                else{
                                    $(el).find('.image-wrap').addClass('right').end().find('.caption,.overlay').addClass('left');
                                }
                            });
                        }
                        thinSVGIcon = function(direction, mobile){
                            if (!mobile)
                                return '<svg version="1.1" id="svg-carousel-arrow-'+ direction +'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="18px" height="33px" viewBox="0 0 18 33" enable-background="new 0 0 18 33" xml:space="preserve"><g><polygon points="16.6,0 18,1.4 2.8,16.5 18,31.6 16.6,33 0,16.5  "/></g></svg>';
                            else
                                return [ '<div class="png-carousel-arrow ' + direction + '"></div>'].join('\n');
                        };
                        arrow = function(direction, grouped, mobile){
                            var fixedClass = grouped ? "" : (direction+'-fixed'),
                                responsiveClasses = mobile ? "visible-xs-inline-block visible-sm-inline-block mobile-only" : "visible-md-inline-block visible-lg-block desktop-only";
                            return [
                                '<a class="carousel-arrow arrow-white-block '+ direction + ' '+ fixedClass +' ' + responsiveClasses + '"',
                                    'href="#'+ $(carousel).attr('id') +'" role="button" data-slide="'+ (direction === "left" ? "prev" : "next") +'">',
                                    thinSVGIcon(direction, mobile),
                                    '<span class="sr-only">'+ (direction === "left" ? "Previous" : "Next") +'</span>',
                                '</a>'
                            ].join('\n');
                        };
                        template = [
                            arrowData.grouped ? "<div class='arrow-container--container visible-md-block visible-lg-block " + arrowData.position + "'>" : "",
                            arrow('left', arrowData.grouped, false),
                            arrowData.grouped ? "<div class='divider'></div>" : "",
                            arrow('right', arrowData.grouped, false),
                            arrowData.grouped ? "</div> <!-- /.arrow-container -->" : "",
                            arrow('left', false, true),
                            arrow('right', false, true),
                        ].join('\n');

                        if (arrowData.static === true){
                            carousel
                                .before('<div class="carousel-controller-container"></div>')
                                .parent().find('.carousel-controller-container')
                                .attr('id', 'static-controller-' + carousel.attr('id'));
                                
                            var controllerContainer = carousel.parent().find('.carousel-controller-container');

                            if (!carousel.hasClass('caption-aside')){
                                controllerContainer.append(template);
                            } else {
                                controllerContainer.append(
                                    arrow('left', false, true),
                                    arrow('right', false, true)
                                );
                                template = $(template).not('.mobile-only').removeClass('left right').addClass('bottom center');
                                carousel.parent().find('.overlay-global').append(template);
                            }
                            var target = (function(){
                                if (arrowData.grouped === true)
                                    return controllerContainer.find('.arrow-container--container'); 
                                else if (arrowData.grouped === false)
                                    return controllerContainer.filter('.carousel-arrow');
                            })();
                            carousel.find('.carousel-controller-container, .carousel-arrow').hide(); //.removeClass('fadeOut').addClass('fadeIn');
                            $(window).on('resize', function(){
                                if (arrowData.grouped === true){
                                    // Control vertical placement of contained group of arrows as well as separated mobile-only arrows
                                    $(target).css('top', vertCenter(target, carousel.find('.carousel-inner')));
                                    controllerContainer.find('.carousel-arrow').filter('.mobile-only')
                                        .css('top', vertCenter(controllerContainer.find('.carousel-arrow'), carousel.find('.carousel-inner')));
                                } else {
                                    if (carousel.hasClass('caption-bottom')){
                                        // caption-bottom carousels are a special case due to their placement.
                                        controllerContainer.find('.carousel-arrow').filter('.mobile-only')
                                            .css('top', vertCenter(controllerContainer.find('.carousel-arrow'), carousel.find('.item.active .image-wrap')));
                                        controllerContainer.find('.desktop-only').remove();
                                    }
                                    else{
                                        // If Arrows aren't grouped the default is to append and measure .carousel-inner
                                        controllerContainer.find('.carousel-arrow').css('top', vertCenter(controllerContainer.find('.carousel-arrow'), carousel.find('.carousel-inner')));
                                    }
                                }
                            }).trigger('resize');

                            // Wait for first image to load then retrigger window resize so arrows are positioned correctly.
                            $(carousel).find('.active.item .slide-image').on('load', function(){
                                $(window).trigger('resize');
                                carousel.find('.carousel-controller-container, .carousel-arrow').show();
                                carousel.find('.overlay-global').removeClass('fadeOut').addClass('fadeIn');
                                setTimeout(function(){
                                    carousel.find('.item .caption').css({top: '0px'});    
                                }, 300);
                            });

                        } else if (arrowData.static === false){
                            carousel.closest('.carousel-controller-container').append(
                                arrow('left', false, true),
                                arrow('right', false, true)
                            );
                            if(!arrowData.container)
                                console.error("For non-fixed (static) arrow positiong you must add container target to data-arrows data-attribute in for carousel id: #" + carousel.attr('id'));
                            if(arrowData.container === '.overlay-global'){
                                carousel.parent().find('.overlay-global').append(template);
                            } else {
                                carousel.find('.carousel-main .item').each(function(i, el){
                                    $(el).find(arrowData.container).append(template);
                                });       
                            }                            
                        }
                        
                        $('.carousel-arrow').on('click', carousel, function(e){
                            e.preventDefault();
                        });
                    })();
                }

                /*
                
                Homepage carousel option: tricycle

                */
                var prevImg, nextImg, activeImg;
                if (carousel.hasClass('tricycle')){
                    var activeSlideNumber = (function(){
                            return carousel.find('.item.active').index('.carousel .item');
                        })(),
                        tricarouselArrows = $(carousel).parent().find('.carousel-arrow'),
                        prevCarousel, nextCarousel, 
                        multiSlideEvent = function(e){
                            $('.mCustomScrollbar').mCustomScrollbar('update');
                            var active = $(e.currentTarget).find('.item.active'),
                                next = $(e.currentTarget).find('.item.active').next('.item'),
                                prev = $(e.currentTarget).find('.item.active').prev('.item'),
                                activeImg = active.find('.slide-image');
                            
                            if (!next.length)
                                next = $(e.currentTarget).find('.item.active').siblings('.item').first();
                            if (!prev.length)
                                prev = $(e.currentTarget).find('.item.active').siblings('.item').last();
                            
                            var imgs = [];
                                imgs.push(
                                    prev.find('.slide-image'), 
                                    next.find('.slide-image'),
                                    activeImg
                                );
                            $(imgs).lazyloadsrcset();
                        };
                    $(carousel).wrap('<div class="tricycle-container"></div>');
                    prevCarousel = $(carousel).clone()
                        .removeAttr('data-ride data-arrows')
                            .carousel('prev').carousel({interval: false}).addClass('prev');
                    nextCarousel = $(carousel).clone()
                        .removeAttr('data-ride data-arrows')
                            .carousel('next').carousel({interval: false}).addClass('next');
                    
                    // Loop through extra carousels and remove extra elements.
                    $([prevCarousel, nextCarousel]).each(function(i, carousel){
                        uniqueId(carousel, 'tricycleCarousel-', i);
                        carousel.find('.overlay-global').remove();
                        $(carousel).addClass('tricycle-behind').find('.item')
                            .each(function(i, item){
                                $(item).find('.overlay, .caption, .carousel-arrow, .arrow-container--container').remove();
                            });
                        carousel.carousel({interval: false}).carousel('pause');
                    });

                    carousel.before(prevCarousel, nextCarousel);
                    
                    // Bind preloading and picturefilling of images to slide 'slid' event
                    $('.tricycle-behind').on('slid.bs.carousel', function(e){
                        multiSlideEvent(e);
                    });
                    $(carousel).on('slid.bs.carousel', function(e){
                        multiSlideEvent(e);
                    });
                    
                    // Bind click event to other prev and next carousels
                    $('.carousel-arrow').on('click', function(e){
                        var direction = $(e.currentTarget).hasClass('right') ? 'next' : 'prev',
                            self = $(e.currentTarget).attr('href');
                        $(self).parent().find('.tricycle-behind').carousel(direction).carousel({interval: false});
                    });
                    
                }


                /*
                
                Homepage carousel option: 3

                */

                if (carousel.hasClass('caption-aside') || carousel.hasClass('caption-bottom')){
                    $(carousel).on('slid.bs.carousel', function (e) {
                        $('.mCustomScrollbar').mCustomScrollbar('update');
                        var active = $(e.currentTarget).find('.item.active'),
                            next = $(e.currentTarget).find('.item.active').next('.item'),
                            prev = $(e.currentTarget).find('.item.active').prev('.item'),
                            nextImg, prevImg, activeImg = active.find('.slide-image');
                        
                        if (!next.length)
                            next = $(e.currentTarget).find('.item.active').siblings('.item').first();
                        if (!prev.length)
                            prev = $(e.currentTarget).find('.item.active').siblings('.item').last();

                        prevImg = prev.find('.slide-image');
                        nextImg = next.find('.slide-image');
                        $([prevImg, activeImg, nextImg]).lazyloadsrcset();
                        $(window).trigger('resize');
                    });
                }

                // Every slide event triggers the overlay to be shown below carousel
                if (carousel.data('captionbelow') === true){
                    
                    if (!carousel.find('.below-carousel').length)
                        carousel.find('.carousel-inner').after('<div class="caption below-carousel mobile-only"></div>');

                    captionBelow = carousel.find('.below-carousel').removeClass('fadeOut');
           
                    $(carousel).on('slid.bs.carousel', function(e){
                        var captionContent = carousel.find('.item.active').find('.headline').clone();
                        
                        // Set the content in the caption-blow container 
                        // and also bind a data-attribute the matches the slide number in which the content came from to find it later.
                        
                        captionContent
                            .filter('.mCustomScrollbar').mCustomScrollbar("destroy")
                            .find('.mCSB_scrollTools').remove().end()
                            .removeClass('mCustomScrollbar _mCS_5 _mCS_1 mCS_no_scrollbar');
                        captionContent
                            .removeClass('right left overlay hidden-md hidden-sm hidden-xs');
                            
                        captionBelow
                            .empty()
                            .html(captionContent);
                                               
                        captionBelow.attr('data-slide-number', carousel.find('.item.active').index());
                    });
                }

                // Handle about content
                if (carousel.find('.item .caption').length > 0){
                    var globalOverlayExpanded = false,
                        svg;
                    if (carousel.find('.caption.below-carousel').length){
                        captionBelow = carousel.find('.below-carousel');
                        uniqueId(globalOverlay, 'carousel-caption-below-', index);
                    }
                    if (carousel.find('.overlay-global').length){
                        globalOverlay = carousel.find('.overlay-global');
                        uniqueId(globalOverlay, 'carousel-global-overlay-', index);

                        $(window).resize(function(){
                            if (globalOverlay.find('.overlay--body-text').isOverflowHeight() && !globalOverlay.hasClass('overlay--toggle-added')){
                                // more to scroll; add icon
                                svg = function(globalOverlayExpanded){
                                    if (globalOverlayExpanded === false){
                                        return [
                                            '<svg version="1.1" id="overlay-expanded-plus" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 13 13" enable-background="new 0 0 13 13" xml:space="preserve"><polygon points="13,5.5 7.5,5.5 7.5,0 5.5,0 5.5,5.5 0,5.5 0,7.5 5.5,7.5 5.5,13 7.5,13 7.5,7.5 13,7.5 "/></svg>'
                                        ].join('\n');
                                    } else {
                                        return [
                                            '<svg version="1.1" id="overlay-expanded-minus" xmlns="http://www.w3.org/2000/svg"',
                                            'xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px"',
                                            'height="4px" viewBox="0 0 13 2" enable-background="new 0 0 13 2" xml:space="preserve">',
                                            '<g><rect x="0" y="0" width="24" height="4"/></g></svg>'
                                        ].join('\n');
                                    }
                                };
                                var link = '<a href class="overlay-global--toggle"><span class="overlay-global--toggle-icon">' + svg(globalOverlayExpanded) + '</span></a>';
                                globalOverlay.find('.overlay--body-text').after(link);
                                link = globalOverlay.find('.overlay-global--toggle');
                                globalOverlay.on('click', '.overlay-global--toggle', function(e){
                                    e.preventDefault();
                                    
                                    if (globalOverlayExpanded === true)
                                        globalOverlayExpanded = false;
                                    else
                                        globalOverlayExpanded = true;

                                    $(link).closest('.overlay-global').attr('data-overlay-expanded', globalOverlayExpanded);

                                    $(link).find('.overlay-global--toggle-icon').html(svg(globalOverlayExpanded));
                                });
                                globalOverlay.addClass('overlay--toggle-added');
                            }
                        }).trigger('resize');
                    }
                    
                    carousel.find('.caption').each(function(i, el){
                        var item = $(el).closest('.item'),
                            svg = [
                                '<svg version="1.1" id="about-this-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',
                                     'width="25px" height="25px" viewBox="-167.3 447.8 25 25" enable-background="new -167.3 447.8 25 25" xml:space="preserve">',
                                '<path d="M-154.8,447.8c-6.9,0-12.5,5.6-12.5,12.5s5.6,12.5,12.5,12.5s12.5-5.6,12.5-12.5S-147.9,447.8-154.8,447.8z M-153.6,466.3',
                                    'h-2.2v-8.4h2.2V466.3z M-153.6,455.8h-2.2v-1.7h2.2V455.8z"/>',
                                '</svg>'
                            ].join('\n'), 
                            link = '<a href="#" class="about-this">'+ svg +' <span class="about-this-text">About This Image</span></a>';
                        item.attr('data-about-caption', "false")
                            .find('.image-wrap').append(link);

                        // If caption appears on the left side...
                        if ($(el).hasClass('left')){
                            $(item)
                                .find('.about-this, .arrow-container--container, .image-wrap')
                                    .removeClass('left').addClass('right').end()
                                .find('.overlay, .caption').removeClass('right').addClass('left');
                        }
                        
                    });
                    $('.item').on('click', '.about-this', function(e){
                        e.preventDefault();
                        var captionContent = $(e.currentTarget).closest('.item').find('.caption').children().clone();
                        
                        // Set the content in the caption-blow container 
                        // and also bind a data-attribute the matches the slide number in which the content came from to find it later.
                        captionContent
                            .filter('.mCustomScrollbar').mCustomScrollbar("destroy")
                            .find('.mCSB_scrollTools').remove().end()
                            .removeClass('mCustomScrollbar _mCS_5 _mCS_1 mCS_no_scrollbar');
                            
                        captionBelow
                            .empty()
                            .html(captionContent);
                                               
                        captionBelow.attr('data-slide-number', $(e.currentTarget).closest('.item').index());
                        $(globalOverlay).removeClass('fadeIn').addClass('fadeOut');
                        $(captionBelow).removeClass('fadeOut').addClass('fadeIn');
                        $(e.currentTarget).closest('.item').find('.caption').removeClass('fadeOut').addClass('fadeIn');
                        $(e.currentTarget).closest('.item').find('.about-this, .overlay').removeClass('fadeIn').addClass('fadeOut');
                        $(e.currentTarget).closest('.item').attr('data-about-caption', true);
                    });
                    $('.caption, .below-carousel').on('click', '.close', function(e){
                        e.preventDefault();
                        var parentSlide = carousel.find('.active.item'),
                            slideNumber = parentSlide.index();

                        if ($(e.currentTarget).parent('.below-carousel').length){
                            slideNumber = $(e.currentTarget).parent('.caption').data('slide-number');
                            parentSlide = carousel.find('.item').eq(slideNumber);
                            parentSlide.find('.caption.fadeIn .close').trigger('click');
                        }
                        $(globalOverlay).removeClass('fadeOut').addClass('fadeIn');
                        $(captionBelow).removeClass('fadeIn').addClass('fadeOut');
                        $(e.currentTarget).closest('.item').find('.caption').removeClass('fadeIn').addClass('fadeOut');
                        $(e.currentTarget).closest('.item').find('.about-this, .overlay').removeClass('fadeOut').addClass('fadeIn');
                        $(e.currentTarget).closest('.item').attr('data-about-caption', false);
                    });

                    $(carousel).on('slide.bs.carousel', function (e) {
                        if (carousel.find('.item.active .caption.fadeIn').length){
                            carousel.find('.item.active .caption.fadeIn .close').trigger('click');
                        }
                    });
                }

                /*

                Default action on sidebar video gallery

                */
                if (isVideo() && inSidebar()){
                    var
                        init = function (carousel){
                            var paginationTemplate = [
                                '<a class="left carousel-control" href="#'+ carousel.attr('id') +'" role="button" data-slide="prev">',
                                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10.9px" height="18px" viewBox="0 0 10.9 18" enable-background="new 0 0 10.9 18" xml:space="preserve">',
                                        '<g><polygon fill="#010101" points="9.5,0 10.9,1.5 2.9,9 10.9,16.6 9.5,18 0,9 "/></g>',
                                    '</svg>',
                                '</a>',
                                '<a class="right carousel-control" href="#'+ carousel.attr('id') +'" role="button" data-slide="next">',
                                    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10.9px" height="18px" viewBox="0 0 10.9 18" enable-background="new 0 0 10.9 18" xml:space="preserve">',
                                        '<g><polygon fill="#010101" points="1.4,18 0,16.6 8,9 0,1.5 1.4,0 10.9,9"/></g>',
                                    '</svg>',
                                '</a>'
                            ].join('\n');
                            carousel
                                .removeClass('slide')
                                .parent()
                                .prepend('<div class="carousel-primary"></div><div class="carousel-secondary"></div>')
                                .find('.carousel-main').addClass('hidden')
                                .end()
                                .find('.carousel-secondary')
                                    .wrap('<div class="carousel-pagination"></div>')
                                    .after(paginationTemplate);

                            return carousel;
                        },
                        slideThumbs = (function (slides){
                            var thumbs = [];
                            var slide = $(slides).filter('.active');
                                if (slides.filter('.active').index() === 0){        
                                    thumbs.push(slides[slides.length - 1]);
                                } else {
                                    thumbs.push($(slide).prev('.item')[0]);
                                }
                                thumbs.push(slides.filter('.active')[0]);
                                if ($(slide).index() == slides.length - 1){ 
                                    thumbs.push(slides[0]);
                                } else {
                                    thumbs.push($(slide).next('.item')[0]);
                                }
                            var primary = thumbs[1],
                                secondary = [thumbs[0], thumbs[2]];
                            return {
                                primary: primary, 
                                secondary: secondary,
                                thumbs: thumbs   
                            };
                        }),
                        template = function (clone) {
                            var count = clone.length,
                                thisTemplate = [];

                            // Primary
                            if (count == 1){
                                $(clone).find('.play-container img').attr('srcset', $(clone).find('.play-container img').attr('data-srcset'));
                                thisTemplate = [
                                    '<div class="carousel-featured-item">',
                                        $(clone).find('.thumb').html(),
                                    '</div>'
                                ].join('\n');

                            // Secondary
                            } else { 
                                thisTemplate = '<div class="carousel-featured-thumbs">';
                                clone.each(function(i, thumb){
                                    $(thumb).find('.play-container img').attr('srcset', $(thumb).find('.play-container img').attr('data-thumbsrcset'));
                                    var item = {
                                        link : $(thumb).find('a'),
                                        content : $(thumb).find('.content'),
                                        header : $(thumb).find('header'),
                                        image : $(thumb).find('.play-container'),
                                        duration : $(thumb).find('.video-duration'),
                                        copy : $(thumb).filter('.video-duration')
                                    };
                                    thisTemplate += [
                                        '<div class="carousel-featured-thumb">',
                                            '<a href="'+ $(item.link).attr('href') +'" data-content--duration="'+ $(item.link).attr('data-content--duration') +'" data-toggle="'+ $(item.link).attr('data-toggle') +'" data-player--video="'+ $(item.link).attr('data-player--video') +'" data-player--image="'+ $(item.link).attr('data-player--image') +'">',
                                                '<div class="play-container">',
                                                    $(item.image).html(),
                                                '</div>',
                                            '</a>',
                                            '<div data-content>',
                                                '<div class="video content">',
                                                    '<header>',
                                                        $(item.header).html(),
                                                    '</header>',
                                                    '<p><span class="video-duration">'+ $(item.link).attr('data-content--duration') +'</span></p>',
                                                '</div>',
                                            '</div>',
                                        '</div>'
                                    ].join('\n');
                                });
                                thisTemplate += '</div>';
                            }
                            return thisTemplate;
                        },
                        rotate = function (e, slideThumbs){
                            var feature = $(e.currentTarget).parent().find('.carousel-primary'),
                                featureThumbs = $(e.currentTarget).parent().find('.carousel-secondary');
                            
                                feature.html(template($(slideThumbs.primary)));
                                featureThumbs.html(template($(slideThumbs.secondary)));
                                featureThumbs.find('img').lazyloadsrcset();    
                                featureThumbs.contentDuration();
                                
                            return slideThumbs;
                        };
                    
                    init($('#'+mainCarouselID));
                    
                    $('#'+mainCarouselID)
                        .on('slid.bs.carousel',function(e){
                            rotate(e, slideThumbs(slides));
                            $(this).loadSlides();
                        })
                        .trigger('slid.bs.carousel');
                }
            }
        });
    };
}());
/*  jslint node: true, browser: true, devel: true, strict:false, debug:true,

    Load Modal Bootstrap Carousel
    Dependencies: lazyloadsrcsetm jquery-loadCarousel

    by: Joe Burdick

*/
/*jshint -W087 */
$.fn.loadModalCarousel = function(options){
  'use strict';
    var
      settings = $.extend({ speed: false }, options),
      slides = [], image, caption,
      modalSlidesHTML = "",
      modalId = $(this).attr('href').replace('#', ''),
      $modalGallery = $('#' + modalId),
      $modalGalleryCarousel,
      inContent = function (){ return $(this).parent('.content-body').length > 0; },
      inPhotoset = function (el){ return $(el).parents('.photoset').length > 0; },
      hasTitle = function (el){ return $(el).attr('data-modaltitle').length > 0; },
      determineSlideContent = function (slide){
        if ($(slide).find('a').attr('href') == "#modal-gallery"){
          var s = $(slide).clone(true),
              a = $(s).find('a[href="#modal-gallery"]');
              a.attr('href', "#");
          return s;
        } else {
          return slide;
        }  
      };

    /*

    Gather relevant slides

    */

    if (inPhotoset(this)){
      $(this).closest('.photoset').find('.item').each(function(i, slide){
        var slideContent = determineSlideContent(slide);
        slides.push(slideContent);
      });
    }

    if (!inContent()){
      // Find all slides in carousel
      $(this).addClass('modal-trigger').parent('.thumb').addClass('active').end().parents('.carousel-inner').find('.thumb').each(function(i, slide){
        var slideContent = determineSlideContent(slide);
        slides.push(slideContent);
      });
    }

    /*

    Create template for slides

    */
    var slideTemplate = function(slide){
      // Build out slide HTML
      if ($(slide).hasClass('active')){
        return "<div class='item active'>"+ $(slide).html() +"</div>";
      } else {
        return "<div class='item'>"+ $(slide).html() +"</div>";
      }
    };

    var carouselTemplate = function(){
      return "<div class='carousel hasAutoplay hasPager photo-carousel' data-autoplay='false'><div class='carousel-inner'></div></div>";
    };
    
    $modalGallery.find('.modal-body').empty().html(carouselTemplate());
    $modalGalleryCarousel = $modalGallery.find('.carousel-inner');

    $(slides).each(function(i, slide){
      $(slide).each(function(i, el){
        modalSlidesHTML += slideTemplate(el);
      });
    });

    if (hasTitle(this)){
      var title = $(this).attr('data-modaltitle');
      $modalGallery.find('.modal-title').text(title);
    }

    $modalGalleryCarousel.html(modalSlidesHTML);
    $modalGallery.find('.carousel').loadCarousel().end()
      .on('hide.bs.modal', function(){
        if (inContent()){
          $('.modal-trigger').removeClass('modal-trigger');
        } else {
          $('.modal-trigger').removeClass('modal-trigger').parent('.thumb').removeClass('active');
        }
      });

    return this;
};

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
		var settings = $.extend({}, $.fn.loadVideo.defaults, options);
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
		var settings = $.extend({}, $.fn.loadAudio.defaults, options);
				
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




/*jslint node: true, browser: true, devel: true, strict:false, debug:true*/
/*jshint -W087 */
/*

    Load Photoset
    Dependencies: jquery

    by: Joe Burdick

*/



$.fn.loadPhotoset = function(options){
  'use strict';

  var getCount = function(el){
    return $(el).children('.item').length;
  };

  var getTitle = function(el){
    return $(el).find('.item.active a[data-modaltitle]').data('modaltitle');
  };

  var templateMarkup = function(el){
    return ['<div class="photoset-caption">',
            '<h4 class="photoset-title">'+ getTitle(el) +'</h4>',
            '<span class="photoset-count">' + getCount(el) + ' Photos</span>',
            '</div>'].join('\n');
  };

  var loadTemplate = function(el){
    el.append(templateMarkup(el));
  };

  $(this).each(function(i, el){
    loadTemplate($(el));
  });

  $('.photoset-container').each(function(i, el){
    var photosets = $(el).find('.photoset');

    for(var p=0; p<photosets.length; p+=4){
      photosets.slice(p, p+4).wrapAll('<div class="row"></div>');
    }
  });


  return this;
};

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
	var settings = $.extend({}, $.fn.contentDuration.defaults, options);
	return this.each(function(i, el){
    	var duration = $(el).data('content--duration');
    	if ($(el).parent().find('.content .video-duration').length > 0)
    		return;
    	else 
    		$(el).parent().find('.content').children('p').last().append('<span class="'+ settings.durationClass +'">'+ duration +'</span>');	
	});
};




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
			$.ajax({
				
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
});
/*jslint node: true, browser: true, devel: true, strict:false, debug:true */
/*global $:false, Modernizr:false, picturefill: false, jwplayer: false */

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


    /*if ($('.calendar').length > 0){
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
    }*/
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
            } else {
                console.log("Target undefined.");
            }
        }
    }
}

function hash(){
    $(window).on('hashchange', urlhash()).trigger('hashchange');
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

//$(document).ready(function() {
    function init() {
    fallbacks();
    interfaces();
};
//);
$(window).load(function(){
    $(window).trigger('scroll');
    scrollbars();    
});

    return {
        init : init
    };
};
