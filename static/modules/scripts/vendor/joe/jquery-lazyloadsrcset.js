/*
    Lazy Load srcset

    by: Joe Burdick
    License: MIT
    
*/

$.fn.lazyloadsrcset = function(options){
    var settings = $.extend({ speed: 0 }, options),
    inModal = function (obj) { return $(obj).parents('.modal').length > 0; },
    inCarousel = function (obj) { return $(obj).parents('.carousel').length > 0; };
    inThumb = function(obj) { return $(obj).parents('.thumb, .carousel-featured-thumb').length > 0; };
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