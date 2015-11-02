var fanimate = {

	init: function() {

	},

	addAnimation: function() {
		var animationDoms = document.querySelectorAll('.currentPage [data-animation]'),
            animateName,
            animateDelay,
            animateDuration,
            cssText;
         console.log(animationDoms);   
        for (var i = 0; i < animationDoms.length; i++) {

            animateName = animationDoms[i].dataset.animation;
            animateDelay = (animationDoms[i].dataset.delay || 500) + 'ms' ;
            animateDuration = (animationDoms[i].dataset.duration || 1000) + 'ms';
            animateTimeFuction = animationDoms[i].dataset.timingFunction || 'ease';

            cssText = {
                '-webkit-animation-name': animateName,
                '-webkit-animation-duration': animateDelay,
                '-webkit-animation-delay': animateDuration,
                '-webkit-animation-timing-function': 'ease', 				// support those browsers that do not support Bézier curve animation
                '-webkit-animation-timing-function': animateTimeFuction,
                '-webkit-animation-fill-mode': 'both'
            };
            cssText = JSON.stringify(cssText).replace(/[{}"]/g, "").replace(/,/g, ";");
            animationDoms[i].style.cssText = cssText;
        };
	},

	delAnimation: function() {
		var animationDoms = document.querySelectorAll('.currentPage [data-animation]');
        for (var i = 0; i < animationDoms.length; i++) {
            animationDoms[i].style.cssText = " ";
        };
	},

	test: function() {
		console.log('test');
	}
	
}