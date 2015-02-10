/* 
    jslint node: true, browser: true, devel: true, strict:true, debug:true

    Devices window resize event dispatcher
    author: hon-chih chen

*/

var Devices = (function(w, d) {
    var BREAK_POINT_CHANGE = 'deviceEvent:breakpointChange',
        win = w,
        doc = d,
        evtMgr = $({}),
        breakpoints = null,
        current = 0, // current break point
        ScreenLG = 1150,
        ScreenMD = 992,
        ScreenSM = 768,
        ScreenXS = 480,
        ScreenXSS = 320,

    init = function() {
        breakpoints = [
            ScreenLG,
            ScreenMD, 
            ScreenSM, 
            ScreenXS, 
            ScreenXSS
        ];
        initIO();
    },

    initIO = function () {
        $(win).resize(function () {
            updateBreakpoint();
        });
        updateBreakpoint();
        checkOrientation();
    },

    MobileLayout = function () {
        return ($(win).width() <= ScreenLG);
    },

    checkOrientation = function () {
        /*$(win).on("orientationchange",function() {
            if(window.orientation === 0) { //portrait
                
            } else { // Landscape
                
            }
            updateBreakpoint();
        });*/
    },

    setBreakPoint = function (val) {
        var params = {};
        if (current !== val || val >= ScreenLG) {
            current = val;
            evtMgr.trigger(BREAK_POINT_CHANGE, [{
                hasMobileLayout: MobileLayout(),
                breakpoint: current,
                width: $(win).width()
            }]);
        }
    },

    onBreakPointUpdate = function (callback) {
        evtMgr.on(BREAK_POINT_CHANGE, callback);
    },

    updateBreakpoint = function () {
        var w = $(win).width(),
            numPoints = breakpoints.length,
            next,
            point = -1, 
            i;
        if (w >= ScreenLG) { 
            // greater or equal to 1024
            point = ScreenLG;
        } else if (w <= breakpoints[numPoints-1]) {
            // equal or less than 320
            point = breakpoints[numPoints-1];
        } else {
            // falls down to smaller breakpoint
            for (i = 0; i < numPoints - 1; i+=1 ) {
                next = breakpoints[i+1];
                if (next !== undefined && w >= next && w < breakpoints[i]) {
                    if (next !== current) {
                        point = breakpoints[i];
                    }
                    break;
                }
            }
        }
        if (point !== -1 && point !== current) {
            setBreakPoint(point);
        }
    };

    return {
        BREAK_POINT_CHANGE : BREAK_POINT_CHANGE,
        onBreakPointUpdate : onBreakPointUpdate,
        init : init,
        evtMgr : evtMgr,
        ScreenLG : ScreenLG,
        ScreenMD : ScreenMD,
        ScreenSM : ScreenSM,
        ScreenXS : ScreenXS,
        ScreenXSS : ScreenXSS
    };

}(window, document));