/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * Clean monetization setup:
 * - Smart Frequency-Capped Popunder (Max 2 times per session, with 5-minute cooldown)
 * - Dedicated Episode Download Button Sponsor Ad (100% preserved)
 * - All banner and notification ads removed
 */

window.SHINOBI_ADS_CONFIG = {
  enabled: true,
  countdownSeconds: 0,

  // Direct Link (High-CPM Popunder / Smartlink)
  adsterraDirectLink: "https://araplhn.org/4/d5d532ee1d0dbff08355fad531688de0",

  // Frequency capping for general page clicks
  maxPopsPerSession: 2,
  cooldownMs: 5 * 60 * 1000, // 5 minutes minimum between pop 1 and pop 2

  autoStartDownloadOnUnlock: true,
  statusMessage: "Preparing high-speed 1080p download link...",

  /**
   * Safe no-op for banner rendering (banner ads removed from site)
   */
  renderBanner: function(containerId, options = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (container) container.innerHTML = "";
    return;
  },

  /**
   * Helper to retrieve current popunder session state
   */
  getPopState: function() {
    try {
      const now = Date.now();
      const SESSION_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours session window

      let count = parseInt(sessionStorage.getItem("animelooto_pop_count") || "0", 10);
      let lastTime = parseInt(sessionStorage.getItem("animelooto_pop_time") || "0", 10);

      // Check localStorage for cross-tab persistence
      const localCount = parseInt(localStorage.getItem("animelooto_pop_count") || "0", 10);
      const localTime = parseInt(localStorage.getItem("animelooto_pop_time") || "0", 10);

      if (localTime > 0 && (now - localTime < SESSION_TTL_MS)) {
        count = Math.max(count, localCount);
        lastTime = Math.max(lastTime, localTime);
      } else if (localTime > 0 && (now - localTime >= SESSION_TTL_MS)) {
        // Session expired, reset
        count = 0;
        lastTime = 0;
        localStorage.removeItem("animelooto_pop_count");
        localStorage.removeItem("animelooto_pop_time");
      }

      return { count, lastTime };
    } catch (_) {
      return { count: 0, lastTime: 0 };
    }
  },

  /**
   * Helper to record a successful popunder
   */
  recordPop: function() {
    try {
      const now = Date.now();
      const { count } = this.getPopState();
      const newCount = count + 1;

      sessionStorage.setItem("animelooto_pop_count", newCount.toString());
      sessionStorage.setItem("animelooto_pop_time", now.toString());

      localStorage.setItem("animelooto_pop_count", newCount.toString());
      localStorage.setItem("animelooto_pop_time", now.toString());
    } catch (_) {}
  },

  /**
   * Smart Popunder Trigger
   * Opens the Adsterra Direct Link only when frequency cap allows (max 2 per session, with cooldown).
   * @param {boolean} force - if true, bypasses the session count and cooldown (e.g. for intentional sponsor clicks)
   */
  triggerPopunder: function(force = false) {
    if (!this.enabled || !this.adsterraDirectLink) {
      return false;
    }

    if (!force) {
      const { count, lastTime } = this.getPopState();
      const now = Date.now();

      // STRICT LIMIT: Max 2 pops per session
      if (count >= this.maxPopsPerSession) {
        return false;
      }

      // COOLDOWN: Must wait at least cooldownMs between pop 1 and pop 2
      if (lastTime > 0 && (now - lastTime < this.cooldownMs)) {
        return false;
      }
    }

    try {
      const pop = window.open(this.adsterraDirectLink, "_blank", "noopener,noreferrer");
      if (pop) {
        if (!force) {
          this.recordPop();
        }
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
    // NEVER intercept download buttons! (They have their own dedicated sponsor ad logic)
    if (target && target.closest && (
      target.closest(".server-btn-download") ||
      target.closest(".btn-ep-download") ||
      target.closest(".dl-action-btn") ||
      target.closest("#dl-action-btn") ||
      target.closest("#stream-download-btn") ||
      target.closest("[data-download]")
    )) {
      return;
    }

    window.SHINOBI_ADS_CONFIG?.triggerPopunder(false);
  };

  document.addEventListener("click", handler, { capture: true, passive: true });
})();
