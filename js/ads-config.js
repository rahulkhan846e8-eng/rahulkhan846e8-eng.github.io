/**
 * Shinobi HUB - Advertising & Rewarded Download Configuration
 * 
 * This file controls the 20-second ad countdown and Adsterra ad placement.
 * Ads ONLY appear when a user clicks the "Direct Download" button on an episode.
 * The rest of the site (home, browse, anime details) remains 100% clean and ad-free.
 */

window.SHINOBI_ADS_CONFIG = {
  // Enable or disable the download countdown ad modal (true = ON, false = OFF)
  enabled: true,

  // Countdown timer in seconds before the high-speed download link unlocks
  countdownSeconds: 20,

  // Active Ad Format: 'banner_300x250' (cleanest & highest revenue)
  activeAdFormat: 'banner_300x250',

  // 1. ADSTERRA 300x250 BANNER (Active inside 20s download modal)
  adsterra300x250: {
    key: "dd68086309184ab140f2253b3bf43300",
    scriptUrl: "https://www.highrevenueformat.com/dd68086309184ab140f2253b3bf43300/invoke.js",
    width: 300,
    height: 250
  },

  // 2. ADSTERRA NATIVE BANNER
  adsterraNative: {
    scriptUrl: "https://pl31501567.profitableratecpmnetwork.com/9c0867e2cfc77dac6c823302ba8ee04c/invoke.js",
    containerId: "container-9c0867e2cfc77dac6c823302ba8ee04c"
  },

  // 3. ADSTERRA 728x90 BANNER (Desktop Leaderboard)
  adsterra728x90: {
    key: "5e813742f7427c72c0bcecf1d8022762",
    scriptUrl: "https://www.highrevenueformat.com/5e813742f7427c72c0bcecf1d8022762/invoke.js",
    width: 728,
    height: 90
  },

  // 4. ADSTERRA 160x600 BANNER (Skyscraper)
  adsterra160x600: {
    key: "cd081f8ab45a593c7125c4b0f09404f7",
    scriptUrl: "https://www.highrevenueformat.com/cd081f8ab45a593c7125c4b0f09404f7/invoke.js",
    width: 160,
    height: 600
  },

  // Optional direct link / sponsor URL (if you create a Direct Link in Adsterra later)
  adsterraDirectLink: "",

  // Automatically start download when 20s finishes (true = YES)
  autoStartDownloadOnUnlock: true,

  // Sponsor button text shown during the 20s countdown
  sponsorButtonText: "⚡ Visit Sponsor (Support Shinobi HUB)",

  // Helper note shown under the timer
  statusMessage: "Preparing high-speed 1080p download link..."
};
