/**
 * Shinobi HUB - Advertising & Sponsor Configuration
 * 
 * Non-intrusive Adsterra placements:
 * 1. Social Bar floating script (clean, non-blocking)
 * 2. Responsive In-Content & Home Banners (728x90 desktop / 300x250 mobile)
 * 3. Episode Stream / Watch Page Banners
 * 4. Fast, rewarded Direct Download sponsor modal (8s countdown)
 */

window.SHINOBI_ADS_CONFIG = {
  // Enable or disable the download countdown ad modal (true = ON, false = OFF)
  enabled: true,

  // Countdown timer in seconds before the direct download link unlocks (8s is smooth and fast)
  countdownSeconds: 8,

  // 1. ADSTERRA 300x250 BANNER (Medium Rectangle - Clean & High CPM)
  adsterra300x250: {
    key: "dd68086309184ab140f2253b3bf43300",
    scriptUrl: "https://www.highrevenueformat.com/dd68086309184ab140f2253b3bf43300/invoke.js",
    width: 300,
    height: 250
  },

  // 2. ADSTERRA 728x90 BANNER (Desktop Leaderboard)
  adsterra728x90: {
    key: "5e813742f7427c72c0bcecf1d8022762",
    scriptUrl: "https://www.highrevenueformat.com/5e813742f7427c72c0bcecf1d8022762/invoke.js",
    width: 728,
    height: 90
  },

  // 3. ADSTERRA 320x50 BANNER (Mobile Leaderboard)
  adsterra320x50: {
    key: "6d392592cfd2e8b5a283a91bbe204b04",
    scriptUrl: "https://www.highrevenueformat.com/6d392592cfd2e8b5a283a91bbe204b04/invoke.js",
    width: 320,
    height: 50
  },

  // 4. ADSTERRA 468x60 BANNER (Classic Banner)
  adsterra468x60: {
    key: "f7e71cec141d5f3a85eccf90c3d8169d",
    scriptUrl: "https://www.highrevenueformat.com/f7e71cec141d5f3a85eccf90c3d8169d/invoke.js",
    width: 468,
    height: 60
  },

  // 5. ADSTERRA 160x600 BANNER (Skyscraper)
  adsterra160x600: {
    key: "cd081f8ab45a593c7125c4b0f09404f7",
    scriptUrl: "https://www.highrevenueformat.com/cd081f8ab45a593c7125c4b0f09404f7/invoke.js",
    width: 160,
    height: 600
  },

  // 6. ADSTERRA 160x300 BANNER
  adsterra160x300: {
    key: "1d03e619544e1297b1f4f1b6c11b98cc",
    scriptUrl: "https://www.highrevenueformat.com/1d03e619544e1297b1f4f1b6c11b98cc/invoke.js",
    width: 160,
    height: 300
  },

  // 7. ADSTERRA NATIVE BANNER
  adsterraNative: {
    scriptUrl: "https://pl31501567.profitableratecpmnetwork.com/9c0867e2cfc77dac6c823302ba8ee04c/invoke.js",
    containerId: "container-9c0867e2cfc77dac6c823302ba8ee04c"
  },

  // 8. ADSTERRA DIRECT LINK (Smartlink / Sponsor URL)
  adsterraDirectLink: "https://www.profitableratecpmnetwork.com/fqukc6i9a?key=4fb7f36bd6a168fc785d21b77559ffbe",

  // Automatically start download when countdown finishes (true = YES)
  autoStartDownloadOnUnlock: true,

  // Sponsor button text shown during the countdown
  sponsorButtonText: "⚡ Visit Sponsor (Support Shinobi HUB)",

  // Helper note shown under the timer
  statusMessage: "Preparing high-speed 1080p download link..."
};
