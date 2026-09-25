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

  // ADSTERRA DIRECT LINK (Smartlink)
  // Step: Adsterra Dashboard -> Websites -> Add Website (shinobihub.run.place) -> Choose "Direct Link"
  // Once generated, paste your direct link URL here:
  adsterraDirectLink: "",

  // ADSTERRA BANNER AD (300x250 or Native Banner)
  // If you create a 300x250 Banner unit on Adsterra, paste the ad code snippet here (HTML/Script)
  bannerCode: "",

  // Automatically start the download in a new tab when the 20 seconds end (true = YES)
  autoStartDownloadOnUnlock: true,

  // Sponsor button text shown during the 20s countdown
  sponsorButtonText: "⚡ Visit Sponsor (Support Shinobi HUB)",

  // Helper note shown under the timer
  statusMessage: "Preparing high-speed 1080p download link..."
};
