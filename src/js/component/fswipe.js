var fswipe = {
    touchEndDistance: 0, // distance value for touch end
    init: function() {
        var self = this;
        $ = this.$;
        this.config.currentNode = 0;
        setTimeout(function() {
            self.initStyle();
            $.css(this.opt.wrapper, {'transform':  'translate3d(0, 0, 0)', 'transition': '0'});
            self.opt.swipe.init && self.opt.swipe.init();
        }, 50); 
    },
    initStyle: function() {
        var cf = this.config;
        var op = this.opt;
        cf.childrenNode = opt.wrapper.children;
        cf.childrenLength = opt.wrapper.children.length;
        cf.domWidth = op.wrapper.clientWidth;
        cf.domHeight = op.wrapper.clientHeight;
         // swipe height or width
        cf.offsetDelta = (op.isVertical) ? cf.domHeight : cf.domWidth;
        // threshold value for swipe
        this.swipeThreshold =  cf.offsetDelta / 9;
        // threshold value for bouncing
        this.bouncingThreshold = cf.offsetDelta / 5;
        // swipe controlling style
        var offsetStyle = (op.isVertical) ? 'top' : 'left';
        // initialization of style of each page
        for (var i = 0; i < cf.childrenLength; i++) {
            cf.childrenNode[i].style.cssText = 'position:absolute;height: ' + cf.domHeight 
                                             + 'px;width: ' + cf.domWidth + 'px;'
                                             + offsetStyle + ': ' + (cf.offsetDelta * i) + 'px;';
        }
    },
    //callback for touchmove event
    ontouchmove: function(ev, custVar) {
        ev.preventDefault();
        var baseLength = 0;
        var cf = this.config,
            index = 0;
        // calculating next swipe position based on current node, swiping offset value, direction and bouncing threshold
        // going backward (to left or to top, swipe length)
        console.log("node "  + cf.offsetDelta);
        if (cf.direction === -1) {
            baseLength = cf.currentNode * cf.offsetDelta + (-1) * cf.direction * this.bouncingThreshold;
        }
        // going forward (to right or to bottom, swipe length)
        else if (cf.direction === 1) {
            baseLength = -1 * (cf.currentNode * cf.offsetDelta + this.bouncingThreshold);
            // console.log(index);  
        }

        // first page 
        if (cf.currentNode === 0 && cf.currentDelta >= baseLength && cf.direction === -1) {
            cf.currentDelta = baseLength;
        }
        // last page
        else if (cf.currentNode === cf.childrenLength - 1 && cf.currentDelta <=  baseLength  && cf.direction === 1) {
            cf.currentDelta =  baseLength;
        }

        this.touchEndDistance = cf.currentDelta;
        var transform = (this.opt.isVertical) ? 'translate3d(0, ' + cf.currentDelta + 'px, 0)'
                                              : 'translate3d(' + cf.currentDelta + 'px, 0, 0)';
        $.css(this.opt.wrapper, {'transform': transform});
    },
    //callback for touchend event
    ontouchend: function(ev, custVar) {
        var cf = this.config;
        // finalized touch end moving distance
        var touchEndDistanceABS = Math.abs(this.touchEndDistance);

        // base length for slide back or forward, used for judgment
        var baseLength = cf.currentNode * cf.offsetDelta + cf.direction * this.swipeThreshold;

        if (cf.currentNode !== 0 && cf.direction === -1 && touchEndDistanceABS <= baseLength) {
            this.slide(-1);
         }
        else if (cf.currentNode !== cf.childrenLength - 1 && cf.direction === 1 && touchEndDistanceABS >= baseLength) {
            this.slide(1);
        }
        else {
            this.slide(0);
        }
    },
    slide: function(num) {
        var cf = this.config;
        var option = this.opt;
        cf.currentNode += num;
        cf.currentDelta = -1 * cf.currentNode * cf.offsetDelta;
        var transform = (option.isVertical) ? 'translate3d(0, ' + cf.currentDelta + 'px, 0)' 
                        : 'translate3d(' + cf.currentDelta + 'px, 0, 0)';
        // start sliding
        $.css(option.wrapper,
        {
            'transform': transform,
            'transition': '0.3s'
        });
        cf.touchEndDistance = 0;
        if (num !== 0 && option.swipe.onswipechange) {
            // slide finished callback
            option.swipe.onswipechange(cf.currentNode);
        }
    }
    // addClass: function(element, className) {

    // }
};