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

    // ============================================
    // Contact Form
    // ============================================

    // IMPORTANT: Update this URL after deploying the Supabase edge function.
    // Format: https://<project-ref>.supabase.co/functions/v1/contact-form
    var CONTACT_FORM_URL = 'https://crgudubunywtlkbejzvc.supabase.co/functions/v1/contact-form';

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        var nameInput = document.getElementById('cf-name');
        var emailInput = document.getElementById('cf-email');
        var messageInput = document.getElementById('cf-message');
        var submitBtn = document.getElementById('cf-submit');
        var submitText = submitBtn.querySelector('.form-submit-text');
        var submitLoading = submitBtn.querySelector('.form-submit-loading');
        var successDiv = document.getElementById('cf-success');
        var errorDiv = document.getElementById('cf-error-global');

        function showFieldError(id, msg) {
            var el = document.getElementById(id + '-error');
            if (el) el.textContent = msg;
            var input = document.getElementById(id);
            if (input) input.classList.add('invalid');
        }

        function clearFieldError(id) {
            var el = document.getElementById(id + '-error');
            if (el) el.textContent = '';
            var input = document.getElementById(id);
            if (input) input.classList.remove('invalid');
        }

        function clearAllErrors() {
            clearFieldError('cf-name');
            clearFieldError('cf-email');
            clearFieldError('cf-message');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function validateForm() {
            var valid = true;
            clearAllErrors();

            if (!nameInput.value.trim()) {
                showFieldError('cf-name', 'Name is required.');
                valid = false;
            }

            if (!emailInput.value.trim()) {
                showFieldError('cf-email', 'Email is required.');
                valid = false;
            } else if (!validateEmail(emailInput.value.trim())) {
                showFieldError('cf-email', 'Please enter a valid email address.');
                valid = false;
            }

            if (!messageInput.value.trim()) {
                showFieldError('cf-message', 'Message is required.');
                valid = false;
            }

            return valid;
        }

        // Clear errors on input
        [nameInput, emailInput, messageInput].forEach(function (input) {
            if (input) {
                input.addEventListener('input', function () {
                    clearFieldError(input.id);
                });
            }
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateForm()) return;

            // Disable submit
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline';

            var payload = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                company: document.getElementById('cf-company').value.trim() || undefined,
                message: messageInput.value.trim(),
                service_interest: document.getElementById('cf-service').value || undefined
            };

            fetch(CONTACT_FORM_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZ3VkdWJ1bnl3dGxrYmVqenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTQ1MzEsImV4cCI6MjA4Njg3MDUzMX0.g3OrE46yPVl8uLIlPB9eHc7SMeoEF55uzM0ImyaER1E',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyZ3VkdWJ1bnl3dGxrYmVqenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTQ1MzEsImV4cCI6MjA4Njg3MDUzMX0.g3OrE46yPVl8uLIlPB9eHc7SMeoEF55uzM0ImyaER1E'
                },
                body: JSON.stringify(payload)
            })
            .then(function (res) {
                return res.json().then(function (data) {
                    return { ok: res.ok, data: data };
                });
            })
            .then(function (result) {
                if (result.ok && result.data.success) {
                    // Hide form fields, show success
                    contactForm.querySelectorAll('.form-row, .form-group, .form-submit').forEach(function (el) {
                        el.style.display = 'none';
                    });
                    successDiv.style.display = 'block';
                } else {
                    errorDiv.textContent = result.data.error || 'Something went wrong. Please try again.';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitText.style.display = 'inline';
                    submitLoading.style.display = 'none';
                }
            })
            .catch(function () {
                errorDiv.textContent = 'Network error. Please check your connection and try again.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitText.style.display = 'inline';
                submitLoading.style.display = 'none';
            });
        });
    }

})();