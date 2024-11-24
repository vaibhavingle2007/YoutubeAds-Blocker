(function() {
    // Aggressive Ad Removal Strategy
    function removeAds() {
        try {
            // Comprehensive ad element removal
            const adSelectors = [
                '.ad-showing',
                '.ytp-ad-overlay', 
                '.ytp-ad-skip-button', 
                '[class*="ad-"]', 
                '[id*="ad-"]',
                '[src*="googlesyndication"]', 
                '[src*="doubleclick"]'
            ];

            const adElements = document.querySelectorAll(adSelectors.join(', '));
            
            adElements.forEach(el => {
                el.remove();
            });

            // Advanced video ad skipping
            const video = document.querySelector('video');
            if (video) {
                // Skip ads by jumping to end of ad
                if (video.duration === 0 || video.currentTime === 0) {
                    video.currentTime = video.duration;
                }
            }

            // Hide ad markers and containers
            const adMarkers = document.querySelectorAll(
                '.ytp-ad-marker, .ytp-ad-progress, ' +
                '[class*="ad-marker"], [class*="ad-progress"]'
            );
            
            adMarkers.forEach(marker => {
                marker.style.display = 'none';
            });
        } catch (error) {
            console.error('Ad removal error:', error);
        }
    }

    // Mutation Observer for continuous ad removal
    const observer = new MutationObserver((mutations) => {
        removeAds();
    });

    // Configure observation
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Initial and periodic ad removal
    removeAds();
    setInterval(removeAds, 1000);

    // Override potential ad-related functions
    if (window.ytInitialPlayerResponse) {
        try {
            window.ytInitialPlayerResponse.adPlacements = [];
            window.ytInitialPlayerResponse.playerAds = [];
        } catch {}
    }
})();