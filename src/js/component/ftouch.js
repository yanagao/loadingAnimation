/**
 * Created by heyli on 2015/1/9.
 */

/**
 * basic utilities
 */

var ftouchUtils = (function(){

    var utils = {};
    try {

        // cross browser css prefix
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        // bind events
        utils.on = function(object, event, callback) {
            object.addEventListener(event, function(ev) {
                (callback)(ev);
            }, false);
        };

        // add css styles
        utils.css = function(object, styleList) {
            var cssText = '';
            for (cssStyle in styleList) {
                if (object) {
                    for (key in vendors) {
                        cssText += '-' + vendors[key] + '-' + cssStyle + ':' + styleList[cssStyle] + ';';
                    }
                    cssText += cssStyle + ':' + styleList[cssStyle] + ':';
                }
            }
            object.style.cssText = cssText;
        };
    }
    catch (e) {

    }

    return utils;
}());

/**
 * core function
 * @param object window object 
 * @param object utilities object
 *
 */
var ftouch = (function($win, $) {

    // options
    // wrapper:      dom       event binding dom
    // isVertical:   boolean   vertical slide or not
    // debug         boolean   debug mode or not
    var opt = {
        wrapper: $win.document.body,
        isVertical: false,
        debug: true
    };

    var config = {
        direction: 0,               // direction
        currentDelta: 0             // current moving delta value
    };

    // initialization option
    var init = function(option) {
        for (key in option) {
            opt[key] = option[key];
        }
    };

    // register plugin
    var register = function(object) {
        var pluginArr = object.split(',');
        for (var i = 0; i < pluginArr.length; i++) {
            if (typeof $win[pluginArr[i]] === 'object') {
                var obj = $win[pluginArr[i]];
                obj.opt = opt;
                obj.config = config;
                obj.$ = $;
                eventHandler(obj);
                obj.init();
            }
        }
    };

    // get moving direction
    var getDirection = function(distance) {
        // isVertical = true, 1 -> to bottom, -1 -> to top
        if (distance > 0) {
            config.direction = -1;
        }
        else if (distance < 0) {
            config.direction = 1;
        }
        else {
            config.direction = 0;
        }

        if (config.direction === -1) {
            return false;
        }
        return true;
    };

    // event handler function
    var eventHandler = function(obj) {
        // customized variables
        var custVar = {
            startPos: null,     // finger start point
            movePos: null,      // finger moving point (real time)
            startPosDelta: 0,   // finger starting point delta value    
            movePosDelta: 0,    // finger moving point delta value
            distance: 0         // moving distance 
        };
        $.on(opt.wrapper, 'touchstart', function(ev) {
            // TODO: should copy instead of directly assign
            custVar.startPos = ev.touches[0];
            obj.ontouchstart && obj.ontouchstart(ev, custVar);
            opt.ontouchstart && opt.ontouchstart();
        });

        $.on(opt.wrapper, 'touchmove', function(ev) {
            // TODO: should copy instead of directly assign
            custVar.movePos = ev.touches[0];
            // assign pageY or pageX value based on verical or horizontal slide
            custVar.movePosDelta = (opt.isVertical) ? custVar.movePos.pageY : custVar.movePos.pageX;
            custVar.startPosDelta = (opt.isVertical) ? custVar.startPos.pageY : custVar.startPos.pageX;
            custVar.distance = custVar.movePosDelta - custVar.startPosDelta;

            // get finger moving diraction
            getDirection(custVar.distance);

            // current moving delta value
            config.currentDelta += custVar.distance;
            
            // callback
            obj.ontouchmove && obj.ontouchmove(ev, custVar);


            // reassign finger starting point once calculation is done 
            // TODO: should copy instead of directly assign
            custVar.startPos = custVar.movePos;
        });

        $.on(opt.wrapper, 'touchend', function(ev) {
            obj.ontouchend && obj.ontouchend(ev, custVar);
            opt.ontouchend && opt.ontouchend();
        });
    };

    var ftouch = {
        opt: opt,
        init: init,
        register: register
    };

    return ftouch;
}(window, ftouchUtils));