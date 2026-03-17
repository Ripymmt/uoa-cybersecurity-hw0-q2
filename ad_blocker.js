// ==UserScript==
// @name         YouTube Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block YouTube advertisements and auto-skip video ads
// @author       You
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @match        https://youtube-nocookie.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Common YouTube ad selectors
    const AD_SELECTORS = [
        // Video ads
        '.video-ads',
        '.ytp-ad-module',
        '.ytp-ad-overlay-container',
        '.ytp-ad-text-overlay',
        '.ytp-ad-player-overlay',
        '.ytp-ad-image-overlay',
        
        // Banner and display ads
        '#masthead-ad',
        '.ytd-display-ad-renderer',
        '.ytd-promoted-sparkles-web-renderer',
        '.ytd-ad-slot-renderer',
        '.ytd-banner-promo-renderer',
        '.ytd-video-masthead-ad-advertiser-info-renderer',
        
        // Sidebar and overlay ads
        '#player-ads',
        '.ytd-companion-slot-renderer',
        '.ytd-action-companion-ad-renderer',
        '.ytd-watch-next-secondary-results-renderer .ytd-compact-promoted-item-renderer',
        
        // Mobile ads
        '.mobile-topbar-header-ad-layout',
        '.slim-video-action-bar-actions .ytm-promoted-sparkles-web-renderer',
        
        // Shorts ads
        '.ytd-reel-video-renderer[is-ad]',
        '.ytd-ad-slot-renderer',
        
        // Overlay and popup ads
        '.ytp-ad-overlay-container',
        '.ytp-ad-text-overlay',
        '.ytp-suggested-action',
        '.ytp-ce-covering-overlay',
        '.ytp-cards-teaser',
        
        // Premium promotion
        '.ytd-mealbar-promo-renderer',
        '.ytd-statement-banner-renderer',
        '.ytd-popup-container'
    ];

    // Skip button selectors
    const SKIP_SELECTORS = [
        '.ytp-ad-skip-button',
        '.ytp-skip-ad-button',
        '.ytp-ad-skip-button-modern',
        '.videoAdUiSkipButton',
        '.skip-button'
    ];

    // Function to hide ad elements
    function hideAds() {
        AD_SELECTORS.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style.display !== 'none') {
                    element.style.display = 'none !important';
                    element.style.visibility = 'hidden !important';
                    element.style.opacity = '0 !important';
                    element.style.height = '0 !important';
                    element.style.width = '0 !important';
                    element.remove();
                }
            });
        });
    }

    // Function to skip video ads
    function skipAds() {
        SKIP_SELECTORS.forEach(selector => {
            const skipButton = document.querySelector(selector);
            if (skipButton && skipButton.offsetParent !== null) {
                skipButton.click();
                console.log('YouTube Ad Blocker: Skipped ad');
            }
        });
    }

    // Function to speed up ads (fallback if skip doesn't work)
    function speedUpAds() {
        const video = document.querySelector('video');
        if (video && document.querySelector('.ad-showing')) {
            video.playbackRate = 16;
            video.currentTime = video.duration - 0.1;
        }
    }

    // Main blocking function
    function blockAds() {
        hideAds();
        skipAds();
        speedUpAds();
    }

    // Initialize the ad blocker
    function init() {
        // Run immediately
        blockAds();
        
        // Set up observers and intervals
        const observer = new MutationObserver(blockAds);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
        
        // Backup interval check
        setInterval(blockAds, 500);
        
        // Additional check for page navigation
        let currentUrl = location.href;
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(blockAds, 1000);
            }
        }, 1000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Additional CSS injection to hide ads
    const style = document.createElement('style');
    style.textContent = `
        ${AD_SELECTORS.join(', ')} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
        }
    `;
    document.head.appendChild(style);

    console.log('YouTube Ad Blocker: Initialized');
})();
