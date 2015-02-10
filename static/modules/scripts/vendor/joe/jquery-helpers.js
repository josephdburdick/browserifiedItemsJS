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
})(jQuery);

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
})(jQuery);
