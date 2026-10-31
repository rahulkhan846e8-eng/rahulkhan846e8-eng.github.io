/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * Strict Frequency Capping:
 * - EXACTLY 1 AD PER USER across the entire site.
 * - After 10 minutes (cooldown), only 1 ad can show again.
 * - Multi-layer persistence: Memory variable + Cookie + localStorage + sessionStorage.
 * - Guaranteed once-only trigger: Even if popup is blocked, cooldown is recorded immediately so user is NEVER spammed.
 * - Episode Download Button Sponsor Ad is 100% preserved separately.
 */

// In-memory guard to guarantee never more than 1 ad during page session
if (typeof window.__shinobi_last_ad_time === "undefined") {
  window.__shinobi_last_ad_time = 0;
}

window.SHINOBI_ADS_CONFIG = {
  enabled: true,
  countdownSeconds: 0,

  // Direct Link (High-CPM Adsterra Smartlink)
  adsterraDirectLink: "https://araplhn.org/4/d5d532ee1d0dbff08355fad531688de0",

  // Cooldown period: 45 minutes before 1 ad can show again
  cooldownMs: 10 * 60 * 1000, // 10 minutes (600,000 ms)

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
   * Helper to read a cookie value
   */
  _getCookie: function(name) {
    try {
      const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'));
      return match ? match[2] : null;
    } catch (_) {
      return null;
    }
  },

  /**
   * Helper to write a cookie value
   */
  _setCookie: function(name, value, maxAgeSeconds) {
    try {
      document.cookie = name + "=" + value + "; path=/; max-age=" + maxAgeSeconds + "; SameSite=Lax";
    } catch (_) {}
  },

  /**
   * Check if user is eligible for an ad.
   * Returns true ONLY if 0 ads shown or > 10 minutes since last ad.
   */
  canShowAd: function() {
    const now = Date.now();

    // 1. Check in-memory guard
    if (window.__shinobi_last_ad_time && (now - window.__shinobi_last_ad_time < this.cooldownMs)) {
      return false;
    }

    // 2. Check cookie
    const cookieTime = parseInt(this._getCookie("al_ad_time") || "0", 10);
    if (cookieTime && (now - cookieTime < this.cooldownMs)) {
      window.__shinobi_last_ad_time = Math.max(window.__shinobi_last_ad_time || 0, cookieTime);
      return false;
    }

    // 3. Check localStorage (with try-catch for Incognito / Safari ITP)
    try {
      const localTime = parseInt(localStorage.getItem("al_ad_time") || "0", 10);
      if (localTime && (now - localTime < this.cooldownMs)) {
        window.__shinobi_last_ad_time = Math.max(window.__shinobi_last_ad_time || 0, localTime);
        return false;
      }
    } catch (_) {}

    // 4. Check sessionStorage
    try {
      const sessionTime = parseInt(sessionStorage.getItem("al_ad_time") || "0", 10);
      if (sessionTime && (now - sessionTime < this.cooldownMs)) {
        window.__shinobi_last_ad_time = Math.max(window.__shinobi_last_ad_time || 0, sessionTime);
        return false;
      }
    } catch (_) {}

    return true;
  },

  /**
   * Record that an ad attempt occurred so NO MORE ADS can show for 10 minutes
   */
  recordAdShown: function() {
    const now = Date.now();
    const maxAgeSeconds = Math.ceil(this.cooldownMs / 1000);

    // 1. In-memory
    window.__shinobi_last_ad_time = now;

    // 2. Cookie (persists across tabs & reloads even in Incognito)
    this._setCookie("al_ad_time", now.toString(), maxAgeSeconds);

    // 3. localStorage
    try {
      localStorage.setItem("al_ad_time", now.toString());
    } catch (_) {}

    // 4. sessionStorage
    try {
      sessionStorage.setItem("al_ad_time", now.toString());
    } catch (_) {}
  },

  /**
   * Smart Popunder Trigger
   * Shows EXACTLY 1 ad, then locks for 10 minutes.
   * @param {boolean} force - if true, bypasses cooldown (used ONLY if explicitly requested)
   */
  triggerPopunder: function(force = false) {
    if (!this.enabled || !this.adsterraDirectLink) {
      return false;
    }

    if (!force) {
      if (!this.canShowAd()) {
        return false;
      }
    }

    // CRUCIAL: Record immediately BEFORE or ON the attempt so that EVEN IF
    // the browser's popup blocker intercepts or blocks it, the user is NEVER spammed on subsequent clicks!
    if (!force) {
      this.recordAdShown();
    }

    try {
      const pop = window.open(this.adsterraDirectLink, "_blank", "noopener,noreferrer");
      if (pop) {
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
