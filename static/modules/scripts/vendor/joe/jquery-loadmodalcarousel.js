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
