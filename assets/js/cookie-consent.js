(function () {
    'use strict';

    var STORAGE_KEY = 'tracepano_cookie_consent';

    function getStoredConsent() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredConsent(value) {
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) {
            // Ignore storage errors in strict privacy browsers
        }
    }

    function getPrivacyPolicyHref() {
        return window.location.pathname.indexOf('/articles/') !== -1
            ? '../privacy-policy.html'
            : 'privacy-policy.html';
    }

    function removeBanner() {
        var existing = document.getElementById('cookie-consent-banner');
        if (existing) {
            existing.remove();
        }
    }

    function applyConsent(choice) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }

        if (choice === 'accepted') {
            gtag('consent', 'update', {
                analytics_storage: 'granted'
            });
            window.dataLayer.push({ event: 'cookie_consent_accepted' });
            if (Array.isArray(window._paq)) {
                window._paq.push(['setCookieConsentGiven']);
            }
        } else {
            gtag('consent', 'update', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
            if (Array.isArray(window._paq)) {
                window._paq.push(['disableCookies']);
            }
        }
    }

    function renderBanner() {
        removeBanner();

        var banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'position-fixed bottom-0 start-0 end-0 bg-dark text-light border-top border-info py-3 shadow-lg';
        banner.style.zIndex = '1080';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');

        banner.innerHTML =
            '<div class="container d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">' +
                '<p class="mb-0 small">' +
                    'We use analytics cookies (Google Analytics &amp; Matomo) to measure traffic and improve Tracepano. ' +
                    '<a href="' + getPrivacyPolicyHref() + '" class="text-info text-decoration-underline">Privacy Policy</a>' +
                '</p>' +
                '<div class="d-flex gap-2 flex-shrink-0">' +
                    '<button type="button" id="cookie-reject-btn" class="btn btn-outline-light btn-sm px-3">Reject</button>' +
                    '<button type="button" id="cookie-accept-btn" class="btn btn-primary btn-sm px-3">Accept</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        document.getElementById('cookie-reject-btn').addEventListener('click', function () {
            setStoredConsent('rejected');
            applyConsent('rejected');
            removeBanner();
        });

        document.getElementById('cookie-accept-btn').addEventListener('click', function () {
            setStoredConsent('accepted');
            applyConsent('accepted');
            removeBanner();
        });
    }

    window.openCookieBanner = function () {
        renderBanner();
    };

    function init() {
        var stored = getStoredConsent();
        if (stored === 'rejected') {
            if (Array.isArray(window._paq)) {
                window._paq.push(['disableCookies']);
            }
            return;
        }
        if (stored === 'accepted') {
            return;
        }
        renderBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
