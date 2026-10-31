/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * Clean monetization setup:
 * - Direct Link / Popunder Engine on genuine user gestures
 * - All banner ads and notification-type ads removed
 */

window.SHINOBI_ADS_CONFIG = {
  enabled: true,
  countdownSeconds: 0,

  // Direct Link (High-CPM Popunder / Smartlink)
  adsterraDirectLink: "https://araplhn.org/4/d5d532ee1d0dbff08355fad531688de0",

  autoStartDownloadOnUnlock: true,
  statusMessage: "Preparing high-speed 1080p download link...",

  /**
   * Safe no-op for banner rendering (banner ads removed from site)
   */
  renderBanner: function(containerId, options = {}) {
    // Banner ads completely disabled
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (container) container.innerHTML = "";
    return;
  },

  /**
   * Smart Popunder Trigger
   * Opens the Adsterra Direct Link in a new tab upon genuine user gestures with cooldown.
   */
  triggerPopunder: function(force = false) {
    const now = Date.now();
    const COOLDOWN_MS = 40 * 1000; // 40s between pop ads
    const lastPop = parseInt(sessionStorage.getItem("shinobi_last_pop") || "0", 10);

    if (!force && (now - lastPop < COOLDOWN_MS)) {
      return false;
    }

    try {
      const pop = window.open(this.adsterraDirectLink, "_blank");
      if (pop) {
        sessionStorage.setItem("shinobi_last_pop", now.toString());
        try { pop.blur(); window.focus(); } catch (_) {}
        return true;
      }
    } catch (_) {}
    return false;
  }
};

// ----------------------------------------------------------------------------
// Auto-attach Popunder Engine to user gestures across mobile & desktop
// ----------------------------------------------------------------------------
(function() {
  const handler = function(e) {
    const target = e.target;
    // Don't intercept close or cancel buttons
    if (target && target.closest && (target.closest("#dl-ad-close") || target.closest("#dl-ad-cancel-bottom"))) {
      return;
    }
    window.SHINOBI_ADS_CONFIG?.triggerPopunder(false);
  };

  document.addEventListener("click", handler, { capture: true, passive: true });
})();
