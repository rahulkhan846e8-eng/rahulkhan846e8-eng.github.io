/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * High-monetization Adsterra setup:
 * 1. Smart Popunder Engine (opens Direct Link on authentic user clicks with cooldown)
 * 2. High CPM Horizontal Banners (320x50 mobile & responsive)
 * 3. Fast Rewarded Direct Download sponsor modal (8s countdown)
 * 4. Social Bar Notification Script
 */

window.SHINOBI_ADS_CONFIG = {
  enabled: true,
  countdownSeconds: 8,

  // 1. ADSTERRA 320x50 HORIZONTAL BANNER (Active High-CPM Banner)
  adsterra320x50: {
    key: "6d392592cfd2e8b5a283a91bbe204b04",
    scriptUrl: "https://www.highrevenueformat.com/6d392592cfd2e8b5a283a91bbe204b04/invoke.js",
    width: 320,
    height: 50
  },

  // 2. ADSTERRA 728x90 BANNER (Desktop Leaderboard)
  adsterra728x90: {
    key: "5e813742f7427c72c0bcecf1d8022762",
    scriptUrl: "https://www.highrevenueformat.com/5e813742f7427c72c0bcecf1d8022762/invoke.js",
    width: 728,
    height: 90
  },

  // 3. ADSTERRA DIRECT LINK (High-CPM Popunder / Smartlink)
  adsterraDirectLink: "https://www.profitableratecpmnetwork.com/fqukc6i9a?key=4fb7f36bd6a168fc785d21b77559ffbe",

  autoStartDownloadOnUnlock: true,
  statusMessage: "Preparing high-speed 1080p download link...",

  /**
   * Render an Adsterra Banner inside any DOM element using Adsterra's native async container API.
   * Avoids nested iframes and prevents Safari WebKit ITP blocking.
   */
  renderBanner: function(containerId, options = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const key = options.key || "6d392592cfd2e8b5a283a91bbe204b04";
    const width = options.width || 320;
    const height = options.height || 50;

    // Clear previous banner if any
    container.innerHTML = "";

    // Generate unique container ID for Adsterra async lookup
    const uniqueId = "atContainer-" + key + "-" + Math.random().toString(36).substring(2, 8);
    const box = document.createElement("div");
    box.id = uniqueId;
    box.style.width = width + "px";
    box.style.height = height + "px";
    box.style.maxWidth = "100%";
    box.style.margin = "0 auto";
    box.style.display = "flex";
    box.style.justifyContent = "center";
    box.style.alignItems = "center";
    box.style.overflow = "hidden";
    container.appendChild(box);

    // Register with Adsterra async containers
    window.atAsyncContainers = window.atAsyncContainers || {};
    window.atAsyncContainers[key] = uniqueId;

    // Configure atOptions
    window.atOptions = {
      'key': key,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };

    // Load invoke.js
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highrevenueformat.com/" + key + "/invoke.js";
    container.appendChild(script);
  },

  /**
   * Smart Popunder Trigger
   * Opens the Adsterra Direct Link in a new tab upon genuine user gestures.
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
