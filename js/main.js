/* Smooth Scrolling
* ------------------------------------------------------ */
   var clSmoothScroll = function() {
        
    $('.smoothscroll').on('click', function (e) {
        var target = this.hash,
        $target    = $(target);
        
            e.preventDefault();
            e.stopPropagation();

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+94
        }, cfg.scrollDuration, 'swing').promise().done(function () {
            window.location.hash = target;
        });
    });

};