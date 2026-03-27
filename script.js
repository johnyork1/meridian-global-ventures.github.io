/* ============================================
   Meridian Global Ventures — Scripts
   ============================================ */

(function () {
    'use strict';

    // Navbar scroll behavior
    var nav = document.getElementById('nav');
    var lastScroll = 0;

    function onScroll() {
        var y = window.scrollY;
        if (y > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile nav toggle
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
        });

        // Close menu on link click
        var navAnchors = links.querySelectorAll('a');
        for (var i = 0; i < navAnchors.length; i++) {
            navAnchors[i].addEventListener('click', function () {
                links.classList.remove('open');
            });
        }
    }

    // Intersection Observer for fade-up animations
    if ('IntersectionObserver' in window) {
        var fadeEls = document.querySelectorAll('.fade-up');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show everything
        var fallbackEls = document.querySelectorAll('.fade-up');
        fallbackEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // Smooth scroll for anchor links (fallback for older browsers)
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();