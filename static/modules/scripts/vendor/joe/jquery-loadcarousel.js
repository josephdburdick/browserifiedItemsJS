/*
    jslint node: true, browser: true, devel: true, strict:false, debug:true 

    Load Bootstrap Carousel
    Dependencies: lazyloadsrcset

    by: Joe Burdick
    
*/
/*jshint -W087 */

/* Slide Link Functions */
var ysm = ysm || {};
ysm.slideLink = (function () {
    var ITEM = 'slide-link-carousel--item',
        NODE = '<div class="item"><div class="row"></div></div>',
        /*
            $items: slide link items
            $container: .carousel-inner
            units: number of thumbs
        */
        render = function (params) {
            var $node,
                inc = 0;

            params.items.each(function (index) {
                if (inc === 0) {
                    $node = $(NODE);
                    if (index === 0 ) {
                        $node.addClass('active');
                    }
                }
                $(this).attr('class', ITEM);
                if (params.property !== '') {
                    $(this).addClass(params.property);
                }
                // append to slide link item
                $(this).appendTo($node.find('.row'));
                if (inc < params.units - 1) {
                    inc += 1;
                } else {
                    inc = 0;
                }
                // append to item container
                if (inc === 0 || index === params.items.length - 1) {
                    params.container.append($node);
                }
            });
        },
        update = function () {
            var $items = $('.slide-link-carousel--item'),
                $inner = $('.carousel-inner');

            Devices.onBreakPointUpdate(function(e, params) {
                // clear old ones
                $items.detach();
                $inner.empty();

                var units,
                    property = '';

                switch (params.breakpoint) {
                    case Devices.ScreenLG:
                        units = 5;
                        property = 'screen-lg';
                        break;
                    case Devices.ScreenMD:
                        units = 4;
                        property = 'screen-md';
                        break;
                    case Devices.ScreenSM:
                        units = 5;
                        property = 'screen-sm';
                        break;
                    case Devices.ScreenXS:
                        units = 3;
                        property = 'screen-xs';
                        break;
                    case Devices.ScreenXSS:
                        units = 2;
                        property = 'screen-xss';
                        break;
                }

                /* TODO for demo only */
                // console.log('inner width :' + $inner.innerWidth() + ', breakpoint : ' + params.breakpoint + ', css : ' + property);

                units = isNaN(units) ? 5 : units;

                render({
                    items: $items, 
                    container: $inner, 
                    units: units,
                    property: property
                });
            });
        };

        return {
            update : update
        };
}());
/* End Slide Link Functions */

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
            if ($(this).find('.carousel-inner .item').length > 1 || $(this).hasClass('slide-link')){
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

                // slide link module update
                if ($(this).hasClass('slide-link')) {
                    ysm.slideLink.update();
                }

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