///////////////////////////////////////////////
// Display loading animation while page loads
///////////////////////////////////////////////

// Wait for window load
$(window).load(function () {
    // Animate loader off screen
    $("#preloader").fadeOut("slow");
});



///////////////////////////////////////////////////////////////////////////
// Smooth scrolling 
// Note: requires Easing plugin: http://gsgd.co.uk/sandbox/jquery/easing/
///////////////////////////////////////////////////////////////////////////

$(function () {
    $('.sm-scroll').click(function () {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1500, 'easeInOutExpo');
                return false;
            }
        }
    });
});


//////////////////////////////////////////////////////
// Hide header/menu on scroll down, show on scroll up
//////////////////////////////////////////////////////

$(function () {

    var didScroll;
    var lastScrollTop = 0;
    var delta = 2;
    var navbarHeight = $('.show-hide-on-scroll').outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 50);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        // If they scrolled down and are past the header, add class .fly-up.
        // This is necessary so you never see what is "behind" the header.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            $('.show-hide-on-scroll').addClass('fly-up');
        } else {
            // Scroll Up
            if (st + $(window).height() < $(document).height()) {
                $('.show-hide-on-scroll').removeClass('fly-up');
            }
        }

        lastScrollTop = st;
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Header Filled (cbpAnimatedHeader): http://tympanus.net/codrops/2013/06/06/on-scroll-animated-header/
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var cbpAnimatedHeader = (function () {

    var docElem = document.documentElement,
          header = document.querySelector('#header'),
          didScroll = false,
          changeHeaderOn = 1;

    function init() {
        window.addEventListener('scroll', function (event) {
            if (!didScroll) {
                didScroll = true;
                setTimeout(scrollPage, 150);
            }
        }, false);
    }

    function scrollPage() {
        var sy = scrollY();
        if ($(this).scrollTop() > 150) {
            $('#header.fixed-top, #header.show-hide-on-scroll').addClass("header-filled");
        }
        else {
            $('#header.fixed-top, #header.show-hide-on-scroll').removeClass("header-filled");
        }
        didScroll = false;
    }

    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }

    init();

})();


///////////////////////
// Bootstrap menu/nav
///////////////////////

$(function () {

    // Keeping dropdown submenu inside screen. 
    // More info: http://stackoverflow.com/questions/17985334/jquery-solution-for-keeping-dropdown-submenu-inside-screen
    $('.dropdown-toggle').parent().hover(function () {
        var menu = $('> .dropdown-menu', this);
        var menupos = $(menu).offset();

        if (menupos.left + menu.width() > $(window).width()) {
            var newpos = -$(menu).width();
            menu.css({ left: newpos });
        }
    });

    // Close mobile menu when click menu link (if onepage navbar)
    $(document).ready(function () {
        $("#onepage-navbar .op-nav-close").click(function (event) {
            $(".navbar-collapse.in").collapse('hide');
        });
    });

});


///////////////////////////////////////////////////////////
// Bootstrap submenu 
// More info: (http://vsn4ik.github.io/bootstrap-submenu)
///////////////////////////////////////////////////////////

'use strict';

(function (factory) {
    if (typeof define == 'function' && define.amd) {
        // AMD. Register as an anonymous module
        define(['jquery'], factory);
    }
    else if (typeof exports == 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    }
    else {
        // Browser globals
        factory(jQuery);
    }
})(function ($) {
    // Or ':not(.disabled):has(a)' or ':not(.disabled):parent';
    var desc = ':not(.disabled, .divider, .dropdown-header)';

    function Submenupicker(element) {
        this.$element = $(element);
        this.$main = this.$element.closest('.dropdown, .dropup, .btn-group');
        this.$menu = this.$element.parent();
        this.$drop = this.$menu.parent().parent();
        this.$menus = this.$menu.siblings('.dropdown-submenu');

        var $children = this.$menu.find('> .dropdown-menu > ' + desc);

        this.$submenus = $children.filter('.dropdown-submenu');
        this.$items = $children.not('.dropdown-submenu');

        this.init();
    }

    Submenupicker.prototype = {
        init: function () {
            this.$element.on({
                'click.bs.dropdown': $.proxy(this.click, this),
                keydown: $.proxy(this.keydown, this)
            });

            this.$menu.on('hide.bs.submenu', $.proxy(this.hide, this));
            this.$items.on('keydown', $.proxy(this.item_keydown, this));

            // Bootstrap fix
            this.$menu.nextAll(desc + ':first:not(.dropdown-submenu)').children('a').on('keydown', $.proxy(this.next_keydown, this));
        },
        click: function (event) {
            event.stopPropagation();

            this.toggle();
        },
        toggle: function () {
            if (this.$menu.hasClass('open')) {
                this.close();
            }
            else {
                this.$menu.addClass('open');
                this.$menus.trigger('hide.bs.submenu');
            }
        },
        hide: function (event) {
            // Stop event bubbling
            event.stopPropagation();

            this.close();
        },
        close: function () {
            this.$menu.removeClass('open');
            this.$submenus.trigger('hide.bs.submenu');
        },
        keydown: function (event) {
            // 13: Return, 27: Esc, 32: Spacebar
            // 38: Arrow up, 40: Arrow down

            // Off vertical scrolling
            if ($.inArray(event.keyCode, [32, 38, 40]) != -1) {
                event.preventDefault();
            }

            if ($.inArray(event.keyCode, [13, 32]) != -1) {
                this.toggle();
            }
            else if ($.inArray(event.keyCode, [27, 38, 40]) != -1) {
                event.stopPropagation();

                if (event.keyCode == 27) {
                    if (this.$menu.hasClass('open')) {
                        this.close();
                    }
                    else {
                        this.$menus.trigger('hide.bs.submenu');
                        this.$drop.removeClass('open').children('a').trigger('focus');
                    }
                }
                else {
                    var $items = this.$main.find('li:not(.disabled):visible > a');

                    var index = $items.index(event.target);

                    if (event.keyCode == 38 && index !== 0) {
                        index--;
                    }
                    else if (event.keyCode == 40 && index !== $items.length - 1) {
                        index++;
                    }
                    else {
                        return;
                    }

                    $items.eq(index).trigger('focus');
                }
            }
        },
        item_keydown: function (event) {
            // 27: Esc

            if (event.keyCode != 27) {
                return;
            }

            event.stopPropagation();

            this.close();
            this.$element.trigger('focus');
        },
        next_keydown: function (event) {
            // 38: Arrow up

            if (event.keyCode != 38) {
                return;
            }

            // Off vertical scrolling
            event.preventDefault();

            event.stopPropagation();

            // Use this.$drop instead this.$main (optimally)
            var $items = this.$drop.find('li:not(.disabled):visible > a');

            var index = $items.index(event.target);

            $items.eq(index - 1).trigger('focus');
        }
    };

    // For AMD/Node/CommonJS used elements (optional)
    // http://learn.jquery.com/jquery-ui/environments/amd/
    return $.fn.submenupicker = function (elements) {
        var $elements = this instanceof $ ? this : $(elements);

        return $elements.each(function () {
            var data = $.data(this, 'bs.submenu');

            if (!data) {
                data = new Submenupicker(this);

                $.data(this, 'bs.submenu', data);
            }
        });
    };

});


// Bootstrap Sub-Menus trigger
$('.dropdown-submenu > a').submenupicker();


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fullscreen overlay menu 
// More info: http://www.jqueryscript.net/menu/Responsive-Fullscreen-Navigation-Menu-with-jQuery-CSS3.html
////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function () {
    // menu button
    $(".fullscreen-menu .menu-button").click(function () {
        // menu open fade effect
        $(".fullscreen-menu .menu-nav").fadeToggle(300);

        // button animate
        $(".hamburger .top-menu").toggleClass("top-animate");
        $(".hamburger .mid-menu").toggleClass("mid-animate");
        $(".hamburger .bottom-menu").toggleClass("bottom-animate");

        // no page scroll if menu is open
        $("body").toggleClass("no-scroll");

        // Header no move if menu is open (if class "show-hide-on-scroll" is enabled)
        $(".show-hide-on-scroll").toggleClass("no-move");

        // toggle class if menu is open
        $('.fullscreen-menu').toggleClass('open');
    });

    // remove menu link on click
    $(".menu-nav li a").click(function () {
        $(".menu-button").click();
    });
});


/////////////////////////
// Header search toggle
/////////////////////////

$(function () {

    $('.header-search-trigger').on('click', function () {
        $('.header-search').fadeIn(400, function () {
            $(this).toggleClass('search-toggle');
        });
    });

    $('.header-search-close').on('click', function () {
        $('.header-search').fadeOut(400, function () {
            $(this).removeClass('search-toggle');
        });
    });

});


////////////////////////////////////////////////////////////////////
// OWL Carousel (more info: http://www.owlcarousel.owlgraphic.com)
////////////////////////////////////////////////////////////////////

// Global carousels
$('.owl-carousel').each(function () {
    var $carousel = $(this);
    $carousel.owlCarousel({

        items: $carousel.data("items"),
        loop: $carousel.data("loop"),
        margin: $carousel.data("margin"),
        center: $carousel.data("center"),
        startPosition: $carousel.data("start-position"),
        animateIn: $carousel.data("animate-in"),
        animateOut: $carousel.data("animate-out"),
        mouseDrag: $carousel.data("mouse-drag"),
        autoHeight: $carousel.data("autoheight"),
        autoplay: $carousel.data("autoplay"),
        autoplayTimeout: $carousel.data("autoplay-timeout"),
        autoplayHoverPause: $carousel.data("autoplay-hover-pause"),
        autoplaySpeed: $carousel.data("autoplay-speed"),
        nav: $carousel.data("nav"),
        navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
        navSpeed: $carousel.data("nav-speed"),
        dots: $carousel.data("dots"),
        dotsSpeed: $carousel.data("dots-speed"),
        video: true,
        responsive: {
            0: {
                items: $carousel.data("items-mobile-portrait"),
            },
            768: {
                items: $carousel.data("items-mobile-landscape"),
            },
            992: {
                items: $carousel.data("items-tablet"),
            },
            1200: {
                items: $carousel.data("items"),
            }
        }

    });
});


//////////////////////////////////////////////////////////////////////////////////////
// Isotope (more info: http://isotope.metafizzy.co)
// Note: "imagesloaded" blugin is required: https://github.com/desandro/imagesloaded
//////////////////////////////////////////////////////////////////////////////////////

$(function () {

    // init Isotope
    var $container = $('.isotope-grid');
    $container.imagesLoaded(function () {
        $container.isotope({
            itemSelector: '.isotope-item-wrap',
            transitionDuration: '0.5s',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
    });

    // Filter
    $('.isotope-filter-links a').click(function () {
        var selector = $(this).attr('data-filter');
        $container.isotope({
            filter: selector
        });
        return false;
    });

    // Filter item active
    var filterItemActive = $('.isotope-filter-links a');

    filterItemActive.on('click', function () {
        var $this = $(this);
        if (!$this.hasClass('active')) {
            filterItemActive.removeClass('active');
            $this.addClass('active');
        }
    });

});


/////////////////////////////////////////////////////////////////////////////////////////
// Magnific Popup - lightbox (more info: http://dimsemenov.com/plugins/magnific-popup/)
/////////////////////////////////////////////////////////////////////////////////////////

$(function () {

    // lightbox without gallery
    $('.lightbox').each(function () { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: '.lightbox-item', // the selector for gallery item
            type: 'image',
            mainClass: 'mfp-fade', // Class that is added to popup wrapper and background

            gallery: {
                enabled: false, // set to true to enable gallery
            },

            image: {
                titleSrc: 'mfp-title' // Attribute of the target element that contains caption for the slide.
            }

        });
    });

    // lightbox with gallery
    $('.lightbox-gallery').each(function () { // the containers for all your galleries
        $(this).magnificPopup({

            delegate: '.lightbox-item', // the selector for gallery item
            type: 'image',
            mainClass: 'mfp-fade', // Class that is added to popup wrapper and background

            gallery: {
                enabled: true, // set to true to enable gallery
                navigateByImgClick: true,
                arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button
                tPrev: 'Previous', // title for left button
                tNext: 'Next', // title for right button
                tCounter: '' // markup of counter
            },

            image: {
                titleSrc: 'mfp-title' // Attribute of the target element that contains caption for the slide.
            }

        });
    });

});


///////////////////////////////////////////////////////////////////////////////////////////////////////
// Counter-Up: (more info: https://github.com/bfintal/Counter-Up)
// Note: requires jQuery waypoints.js plugin (more info: https://github.com/imakewebthings/waypoints)
///////////////////////////////////////////////////////////////////////////////////////////////////////

$(function () {
    $('.counter').counterUp({
        delay: 10,
        time: 2000
    });
});


///////////////////////////////////////////////////////////////////////////////////////
// YTPlayer (Background Youtube video): https://github.com/pupunzi/jquery.mb.YTPlayer
///////////////////////////////////////////////////////////////////////////////////////

$(function () {
    if (!jQuery.browser.mobile)
        $(".youtube-bg").mb_YTPlayer();
});


//////////////////////
// Bootstrap tooltip
//////////////////////

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})


//////////////////////
// Bootstrap popover
//////////////////////

$(function () {
    $('[data-toggle="popover"]').popover({
        html: true
    })
})


////////////////////////////////////////////////////////////////////
// Bootstrap ScrollSpy (Highlight the top nav as scrolling occurs)
////////////////////////////////////////////////////////////////////

$(function () {
    $('body').scrollspy({
        target: '#onepage-navbar'
    })
})









/////////////////////////////
// Choose random quote div
/////////////////////////////

var random = Math.floor(Math.random() * $('.randomQuote').length);
$('.randomQuote').hide().eq(random).show();









$(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})
  (window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-74067532-1', 'auto');
ga('send', 'pageview');
