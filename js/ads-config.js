/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * High-monetization Adsterra setup:
 * 1. Smart Popunder Engine (opens Direct Link on authentic user clicks with cooldown)
 * 2. High CPM Horizontal Banners (320x50 mobile & responsive)
 * 3. Instant Direct Download + Direct Link Ad Redirect (Zero waiting time, maximum CPM)
 * 4. Social Bar Notification Script
 */

window.SHINOBI_ADS_CONFIG = {
  enabled: true,
  countdownSeconds: 0,

  // 1. ADSTERRA 320x50 HORIZONTAL BANNER (Active High-CPM Banner)
  adsterra320x50: {
    key: "3fa2c9ceda6d78b72745b389d026f82a",
    scriptUrl: "https://bauval.org/22/3fa2c9ceda6d78b72745b389d026f82a",
    width: 320,
    height: 50
  },

  // 2. ADSTERRA 728x90 BANNER (Desktop Leaderboard)
  adsterra728x90: {
    key: "230a4302a9a1479b32cf01d92c71aed8",
    scriptUrl: "https://bauval.org/22/230a4302a9a1479b32cf01d92c71aed8",
    width: 728,
    height: 90
  },

  // ADSTERRA 468x60 BANNER
  adsterra468x60: {
    key: "3bd3f0b8aeaf2879eecd39b8fc5e57ba",
    scriptUrl: "https://bauval.org/22/3bd3f0b8aeaf2879eecd39b8fc5e57ba",
    width: 468,
    height: 60
  },

  // ADSTERRA 300x250 BANNER
  adsterra300x250: {
    key: "751a0094c171a6569031419d49fad003",
    scriptUrl: "https://bauval.org/22/751a0094c171a6569031419d49fad003",
    width: 300,
    height: 250
  },

  // ADSTERRA 160x600 BANNER
  adsterra160x600: {
    key: "d2143f83a24f886b4b3cfcf9a70d3570",
    scriptUrl: "https://bauval.org/22/d2143f83a24f886b4b3cfcf9a70d3570",
    width: 160,
    height: 600
  },

  // ADSTERRA 160x300 BANNER
  adsterra160x300: {
    key: "0ebd0e54d132a87b8b3bb653713be55a",
    scriptUrl: "https://bauval.org/22/0ebd0e54d132a87b8b3bb653713be55a",
    width: 160,
    height: 300
  },

  // ADSTERRA NATIVE WIDGET
  adsterraNative: {
    containerId: "container-09f6a91f108398c7d514431c423a1906",
    scriptUrl: "https://bauval.org/21/09f6a91f108398c7d514431c423a1906"
  },

  // 3. ADSTERRA DIRECT LINK (High-CPM Popunder / Smartlink)
  adsterraDirectLink: "https://araplhn.org/4/d5d532ee1d0dbff08355fad531688de0",

  autoStartDownloadOnUnlock: true,
  statusMessage: "Preparing high-speed 1080p download link...",

  /**
   * Render an Adsterra Banner inside any DOM element using Adsterra's native async container API.
   * Avoids nested iframes and prevents Safari WebKit ITP blocking.
   */
  renderBanner: function(containerId, options = {}) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const key = options.key || "3fa2c9ceda6d78b72745b389d026f82a";
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

    // Load ad script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = options.scriptUrl || ("https://bauval.org/22/" + key);
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

// ----------------------------------------------------------------------------
// Active Social Bar & Iframe Transparentizer & Compact Styler
// Eliminates iOS Safari WebKit white background block & keeps notification compact
// ----------------------------------------------------------------------------
(function() {
  const fixIframeElement = function(ifr) {
    try {
      ifr.setAttribute("allowtransparency", "true");
      ifr.style.setProperty("background", "transparent", "important");
      ifr.style.setProperty("background-color", "transparent", "important");
      ifr.style.setProperty("color-scheme", "dark", "important");

      const isSocialBar = (ifr.id && ifr.id.indexOf("container-") !== -1) ||
                          (ifr.className && ifr.className.indexOf("container-") !== -1) ||
                          (ifr.style && ifr.style.position === "fixed");

      if (isSocialBar) {
        if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          ifr.style.setProperty("display", "none", "important");
          ifr.style.setProperty("visibility", "hidden", "important");
          ifr.style.setProperty("opacity", "0", "important");
          ifr.style.setProperty("pointer-events", "none", "important");
          return;
        }

        ifr.style.setProperty("max-height", "86px", "important");
        ifr.style.setProperty("border", "none", "important");
        ifr.style.setProperty("outline", "none", "important");
        ifr.style.setProperty("box-shadow", "none", "important");

        const polishInside = function() {
          try {
            const doc = ifr.contentDocument || ifr.contentWindow?.document;
            if (doc && doc.documentElement) {
              doc.documentElement.style.setProperty("background", "transparent", "important");
              doc.documentElement.style.setProperty("background-color", "transparent", "important");
              doc.documentElement.style.setProperty("color-scheme", "dark", "important");
              if (doc.body) {
                doc.body.style.setProperty("background", "transparent", "important");
                doc.body.style.setProperty("background-color", "transparent", "important");
                doc.body.style.setProperty("color-scheme", "dark", "important");
              }
              if (!doc.getElementById("shinobi-sb-transparency-fix")) {
                const styleEl = doc.createElement("style");
                styleEl.id = "shinobi-sb-transparency-fix";
                styleEl.textContent = `
                  html, body {
                    background: transparent !important;
                    background-color: transparent !important;
                    color-scheme: dark !important;
                    overflow: hidden !important;
                  }
                  div[class*="__wrap"] {
                    background: transparent !important;
                    background-color: transparent !important;
                  }
                  div[class*="__content"] {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6) !important;
                    border-radius: 10px !important;
                  }
                `;
                (doc.head || doc.documentElement).appendChild(styleEl);
              }
            }
          } catch (_) {}
        };

        polishInside();
        ifr.addEventListener("load", polishInside);
      }
    } catch (_) {}
  };

  const scanAllIframes = function() {
    document.querySelectorAll("iframe").forEach(fixIframeElement);
  };

  const observer = new MutationObserver(function(mutations) {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === "IFRAME") {
            fixIframeElement(node);
          } else if (node.querySelectorAll) {
            node.querySelectorAll("iframe").forEach(fixIframeElement);
          }
        }
      }
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  // Periodic active enforcement during the first 10 seconds
  let checks = 0;
  const intervalId = setInterval(function() {
    scanAllIframes();
    checks++;
    if (checks > 40) clearInterval(intervalId);
  }, 250);
})();

