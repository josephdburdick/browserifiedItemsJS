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
