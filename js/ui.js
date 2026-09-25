export const FALLBACK_POSTER = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22450%22%20viewBox%3D%220%200%20300%20450%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23091540%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2248%25%22%20fill%3D%22%233a86ff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22800%22%20text-anchor%3D%22middle%22%3ESHINOBI%20HUB%3C/text%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2256%25%22%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2213%22%20text-anchor%3D%22middle%22%3ECover%20Image%3C/text%3E%3C/svg%3E";
export const FALLBACK_THUMB = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22320%22%20height%3D%22180%22%20viewBox%3D%220%200%20320%20180%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23091540%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2252%25%22%20fill%3D%22%233a86ff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20text-anchor%3D%22middle%22%3ESHINOBI%20HUB%3C/text%3E%3C/svg%3E";

if (typeof window !== "undefined") {
  window.FALLBACK_POSTER = FALLBACK_POSTER;
  window.FALLBACK_THUMB = FALLBACK_THUMB;
}

/**
 * KING STORE UI RENDERER
 */

import { StorageService, DEFAULT_AVATARS } from './storage.js';
import { ANIME_DATABASE, GENRE_LIST, getAnimeById } from './data.js';

export class UIRenderer {
  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------
  static showToast(message, type = "default") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        ${type === 'success' ? 
          '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>' :
          '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'}
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "toastFadeOut 0.3s forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // Hero Spotlight Slider
  // --------------------------------------------------------------------------
  static renderHeroSlider(featuredAnimeList, containerId = "hero-slider") {
    const container = document.getElementById(containerId);
    if (!container || !featuredAnimeList || featuredAnimeList.length === 0) return;

    container.innerHTML = featuredAnimeList.map((anime, idx) => `
      <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}" data-anime-id="${anime.id}">
        <div class="hero-bg hero-bg-desktop">
          <img src="${anime.banner || anime.poster}" alt="${anime.title}" />
          <div class="hero-gradient"></div>
        </div>
        <div class="hero-bg hero-bg-mobile">
          <img src="${anime.poster}" alt="${anime.title}" />
          <div class="hero-gradient hero-gradient-mobile"></div>
        </div>
        <div class="hero-content">
          <div class="hero-info-box">
            <div class="hero-badges">
              <span class="badge badge-king">FEATURED</span>
              <span class="badge badge-rating">★ ${anime.rating || '8.5'}</span>
              <span class="badge badge-hd">${anime.type || 'TV Series'}</span>
            </div>
            <h1 class="hero-title">${anime.title}</h1>
            <p class="hero-japanese-title">${anime.japaneseTitle || ''}</p>
            <p class="hero-synopsis">${anime.synopsis || ''}</p>
            <div class="hero-actions desktop-only">
              <button class="btn btn-primary detail-view-btn" data-anime-id="${anime.id}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                START STREAMING S1 E1
              </button>
              <button class="btn btn-secondary watchlist-toggle-btn" data-anime-id="${anime.id}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${StorageService.isInWatchlist(anime.id) ? 'var(--cr-accent-gold)' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>${StorageService.isInWatchlist(anime.id) ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
              </button>
              <button class="btn btn-outline detail-view-btn" data-anime-id="${anime.id}">
                MORE DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    // Render Indicator Dots
    const indicatorContainer = document.getElementById("hero-indicators");
    if (indicatorContainer) {
      indicatorContainer.innerHTML = featuredAnimeList.map((_, idx) => `
        <div class="hero-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>
      `).join("");
    }
  }

  // --------------------------------------------------------------------------
  // Anime Card
  // --------------------------------------------------------------------------
  static renderAnimeCard(anime) {
    const epBadge = anime.type === "Movie" ? "MOVIE" : (anime.currentEpBadge || `S1-EP${anime.episodes?.length || 12}`);
    const year = anime.year || 2024;

    return `
      <div class="anime-card" data-anime-id="${anime.id}">
        <div class="anime-card-poster">
          <img src="${anime.poster}" alt="${anime.title}" loading="lazy" onerror="this.onerror=null; this.src=window.FALLBACK_POSTER;" />
          <div class="card-ep-badge">${epBadge}</div>
          <div class="anime-card-overlay-btn" title="View Episodes">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div class="anime-card-body">
          <h4 class="anime-card-title" title="${anime.title}">${anime.title}</h4>
          <div class="anime-card-year">${year}</div>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Continue Watching Shelf
  // --------------------------------------------------------------------------
  static renderContinueWatching(containerId = "continue-shelf-track") {
    const container = document.getElementById(containerId);
    const wrapper = document.getElementById("continue-shelf-section");
    if (!container || !wrapper) return;

    const history = StorageService.getWatchHistory();
    if (!history || history.length === 0) {
      wrapper.style.display = "none";
      return;
    }

    wrapper.style.display = "block";
    container.innerHTML = history.slice(0, 10).map(item => {
      const anime = getAnimeById(item.animeId);
      if (!anime) return "";
      const isMovie = anime.type === "Movie";
      const ep = anime.episodes?.find(e => e.number === item.episodeNumber) || { number: item.episodeNumber, title: `Episode ${item.episodeNumber}` };
      const progressLabel = item.percent > 0 ? `${item.percent}% watched` : "Watching";
      const progressWidth = item.percent > 0 ? item.percent : 100;
      const progressColor = item.percent > 0 ? "" : "background: var(--cr-accent-blue, #2563eb);";
      return `
        <div class="continue-card play-episode-btn" data-anime-id="${anime.id}" data-ep="${item.episodeNumber}">
          <div class="continue-thumb">
            <img src="${ep?.thumbnail || anime.banner || anime.poster}" alt="${anime.title}" onerror="this.onerror=null; this.src=window.FALLBACK_THUMB;" />
            <div class="continue-play-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="continue-progress-bar">
              <div class="continue-progress-fill" style="width: ${progressWidth}%; ${progressColor}"></div>
            </div>
          </div>
          <div class="continue-body">
            <h4 class="continue-title">${anime.title}</h4>
            <div class="continue-sub">
              <span>${isMovie ? 'Full Movie' : `Episode ${item.episodeNumber}`}</span>
              <span>${progressLabel}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // --------------------------------------------------------------------------
  // Shelf Carousels
  // --------------------------------------------------------------------------
  static renderShelf(containerId, animeList) {
    const container = document.getElementById(containerId);
    if (!container || !animeList) return;
    container.innerHTML = animeList.map(anime => this.renderAnimeCard(anime)).join("");
  }

  // --------------------------------------------------------------------------
  // Anime Detail View & Episode Playlist
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Anime Detail View & Episode Playlist
  // --------------------------------------------------------------------------
  static renderEpisodesListHtml(anime, season, mode = "download", lang = "hindi") {
    if (!season) return "";

    if (season.isComingSoon || !season.episodes || season.episodes.length === 0) {
      return `
        <div class="season-coming-soon-card">
          <div class="coming-soon-icon">⏳</div>
          <h3 class="coming-soon-title">${season.title} is Coming Soon</h3>
          <p class="coming-soon-desc">
            Our team is actively monitoring official release schedules and preparing full 1080p Multi-Audio episodes for <strong>${anime.title}</strong>. Check back soon!
          </p>
          <span class="badge badge-gold-pill">Status: In Production / Announced</span>
        </div>
      `;
    }

    const sNum = season.number || 1;
    const isMovie = anime.type === "Movie";
    const isOriginal = lang === "original";

    return season.episodes.map(ep => `
      <div class="episode-row-item play-episode-btn" data-anime-id="${anime.id}" data-ep="${ep.number}" data-season="${sNum}" data-mode="download" data-lang="${lang}">
        <div class="ep-row-thumb">
          <img src="${ep.thumbnail || anime.poster}" alt="${ep.title}" loading="lazy" onerror="this.onerror=null; this.src=window.FALLBACK_THUMB;" />
          <span class="ep-row-runtime">${ep.runtime || (isMovie ? '1h 45m' : '24m')}</span>
          <div class="ep-row-play-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
          </div>
        </div>
        <div class="ep-row-content">
          <div class="ep-row-title-line">
            <span class="ep-badge-gold">${isMovie ? 'Full Feature' : `S${sNum}-E${ep.number}`}</span>
            <span class="ep-row-title">${isMovie ? (ep.title && !ep.title.includes('Episode') ? ep.title : `${anime.title} (Main Movie)`) : ep.title}</span>
            <span class="ep-lang-pill ${isOriginal ? 'lang-original' : 'lang-hindi'}">${isOriginal ? '🇯🇵 Original Dub' : '🇮🇳 Hindi Dub'}</span>
          </div>
        </div>
        <div class="ep-row-action">
          <button class="btn-watch-row btn-download-action">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
            <span>${isMovie ? 'Download Movie' : 'Download'}</span>
          </button>
        </div>
      </div>
    `).join("");
  }

  static renderAnimeDetail(anime) {
    const detailContainer = document.getElementById("detail-view");
    if (!detailContainer || !anime) return;

    const inWatchlist = StorageService.isInWatchlist(anime.id);
    const isMovie = anime.type === "Movie";
    const seasons = (anime.seasons && anime.seasons.length > 0) 
      ? anime.seasons 
      : [{ number: 1, title: 'Season 1', airDate: anime.season || '2024', episodes: anime.episodes || [] }];

    let currentSeason = seasons[0];
    let currentMode = "download"; // Default option requested by user
    // Determine available languages for this anime
    const determineLanguages = (a) => {
      if (Array.isArray(a.languages) && a.languages.length > 0) {
        return a.languages.map(l => l.toLowerCase());
      }
      const set = new Set();
      const allEpisodes = (a.seasons || []).flatMap(s => s.episodes || []).concat(a.episodes || []);
      for (const ep of allEpisodes) {
        if (ep.downloadLinks?.hindi || ep.downloadUrl) set.add("hindi");
        if (ep.downloadLinks?.original) set.add("original");
      }
      return set.size > 0 ? Array.from(set) : ["hindi", "original"];
    };

    const availableLangs = determineLanguages(anime);
    const hasHindi = availableLangs.includes("hindi");
    const hasOriginal = availableLangs.includes("original");

    // Default language is hindi if available, otherwise original
    let currentLanguage = hasHindi ? "hindi" : (hasOriginal ? "original" : "hindi");

    const hasDownload = !currentSeason.isComingSoon && anime.hasDownload !== false;
    const hasWatch = !currentSeason.isComingSoon && anime.hasWatch !== false;

    detailContainer.innerHTML = `
      <div class="detail-hero" style="background-image: url('${anime.banner || anime.poster}');">
        <div class="page-container">
          <div class="detail-hero-content">
            <div class="detail-poster-wrapper">
              <img src="${anime.poster}" alt="${anime.title}" onerror="this.onerror=null; this.src=window.FALLBACK_POSTER;" />
            </div>
            <div class="detail-main-info">
              <h1 class="detail-title">${anime.title}</h1>
              <p class="detail-sub-title">${anime.japaneseTitle || ''}</p>
              <div class="detail-meta-row">
                <span class="badge badge-rating">★ ${anime.rating || '8.5'}</span>
                <span class="detail-meta-dot"></span>
                <span>${anime.season || anime.year || '2024'}</span>
                <span class="detail-meta-dot"></span>
                <span>${anime.studio || 'Animation Studio'}</span>
              </div>
              <div class="detail-genres">
                ${(anime.genres || []).map(g => `<span class="genre-tag">${g}</span>`).join("")}
              </div>
              <p class="detail-synopsis">${anime.synopsis || ''}</p>
              <div class="detail-actions">
                <button class="btn btn-primary play-episode-btn" data-anime-id="${anime.id}" data-ep="1" data-season="1" data-lang="${currentLanguage}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                  ${isMovie ? 'DOWNLOAD FULL MOVIE' : 'DOWNLOAD EPISODE 1'}
                </button>
                <button class="btn btn-secondary watchlist-toggle-btn" data-anime-id="${anime.id}">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="${inWatchlist ? 'var(--cr-accent-gold)' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>${inWatchlist ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-container">
        <!-- Interactive Season Header Bar -->
        <div class="season-header-bar" style="margin-top: 32px;">
          ${isMovie ? `
            <div class="movie-pill-box" style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); padding: 8px 20px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12);">
              <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">🎬 Full Feature Film</span>
            </div>
          ` : `
            <div class="season-dropdown-wrapper" id="season-dropdown-wrapper">
              <button class="season-pill-box" id="season-select-btn" type="button" title="Switch Anime Season">
                <span class="season-name" id="current-season-label">${currentSeason.title}</span>
                <span class="season-arrow" id="season-arrow-icon">▼</span>
              </button>
              <div class="season-dropdown-menu" id="season-dropdown-menu">
                ${seasons.map((s, idx) => `
                  <div class="season-menu-option ${idx === 0 ? 'active' : ''} ${s.isComingSoon ? 'coming-soon' : ''}" data-season-idx="${idx}">
                    <div class="season-option-left">
                      <span class="season-option-title">${s.title}</span>
                      <span class="season-option-meta">${s.isComingSoon ? 'Coming Soon...' : `${s.airDate || ''} • ${s.episodes?.length || 0} Episodes`}</span>
                    </div>
                    ${s.isComingSoon ? '<span class="badge-coming-soon">Coming Soon...</span>' : ''}
                    ${idx === 0 ? '<span class="season-check-icon">✓</span>' : ''}
                  </div>
                `).join("")}
              </div>
            </div>
          `}

          <!-- Multi-Language Audio Selector (Conditional based on available languages) -->
          <div class="language-toggle-group" id="language-toggle-group" title="Select Audio Language">
            ${hasHindi && hasOriginal ? `
              <button class="lang-toggle-btn ${currentLanguage === 'hindi' ? 'active' : ''}" data-lang="hindi" type="button">
                <span class="lang-flag">🇮🇳</span>
                <span class="lang-text">Hindi</span>
              </button>
              <button class="lang-toggle-btn ${currentLanguage === 'original' ? 'active' : ''}" data-lang="original" type="button">
                <span class="lang-flag">🇯🇵</span>
                <span class="lang-text">Original Dub</span>
              </button>
            ` : (hasHindi ? `
              <button class="lang-toggle-btn active single-lang" data-lang="hindi" type="button" style="cursor: default;">
                <span class="lang-flag">🇮🇳</span>
                <span class="lang-text">Hindi Dub</span>
              </button>
            ` : `
              <button class="lang-toggle-btn active single-lang" data-lang="original" type="button" style="cursor: default;">
                <span class="lang-flag">🇯🇵</span>
                <span class="lang-text">Original Dub</span>
              </button>
            `)}
          </div>

          <!-- Clean Direct Download Mode Indicator (Watch Mode Removed) -->
          <div class="episode-mode-toggle-group" id="episode-mode-toggle-group">
            <button class="mode-toggle-btn active ${!hasDownload ? 'disabled-option' : ''}" data-mode="download" type="button" id="mode-toggle-download" title="Direct Download Mode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
              </svg>
              <span>Download</span>
              <span class="mode-tiny-tag mode-download-coming-soon" style="display: ${hasDownload ? 'none' : 'inline-block'};">coming soon</span>
            </button>
          </div>
        </div>

        <!-- Episodes Playlist Container -->
        <div class="episodes-playlist-stack" id="episodes-playlist-stack">
          ${this.renderEpisodesListHtml(anime, currentSeason, currentMode, currentLanguage)}
        </div>
      </div>
    `;

    // Elements
    const selectBtn = document.getElementById("season-select-btn");
    const dropdownWrapper = document.getElementById("season-dropdown-wrapper");
    const dropdownMenu = document.getElementById("season-dropdown-menu");
    const seasonLabel = document.getElementById("current-season-label");
    const episodesStack = document.getElementById("episodes-playlist-stack");
    const downloadToggleBtn = document.getElementById("mode-toggle-download");
    const downloadComingSoonTag = document.querySelector(".mode-download-coming-soon");
    const langToggleGroup = document.getElementById("language-toggle-group");

    // Helper to refresh episode playlist
    const refreshPlaylist = () => {
      if (episodesStack) {
        episodesStack.innerHTML = UIRenderer.renderEpisodesListHtml(anime, currentSeason, currentMode, currentLanguage);
      }
    };

    // Multi-Language Toggle Listener
    langToggleGroup?.querySelectorAll(".lang-toggle-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = btn.dataset.lang || "hindi";
        if (selectedLang === currentLanguage) return;
        currentLanguage = selectedLang;

        langToggleGroup.querySelectorAll(".lang-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Update hero download button data-lang
        const heroPlayBtn = detailContainer.querySelector(".play-episode-btn");
        if (heroPlayBtn) heroPlayBtn.dataset.lang = currentLanguage;

        refreshPlaylist();
      });
    });

    // Download Mode Click
    downloadToggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      currentMode = "download";
      downloadToggleBtn.classList.add("active");
      refreshPlaylist();
    });

    // Season Dropdown Toggle
    selectBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownWrapper?.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#season-dropdown-wrapper")) {
        dropdownWrapper?.classList.remove("open");
      }
    });

    // Season Selection
    dropdownMenu?.querySelectorAll(".season-menu-option").forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(opt.dataset.seasonIdx, 10);
        const selectedSeason = seasons[idx];
        if (!selectedSeason) return;

        currentSeason = selectedSeason;

        dropdownMenu.querySelectorAll(".season-menu-option").forEach(o => {
          o.classList.remove("active");
          o.querySelector(".season-check-icon")?.remove();
        });
        opt.classList.add("active");
        if (!opt.querySelector(".season-check-icon")) {
          const check = document.createElement("span");
          check.className = "season-check-icon";
          check.textContent = "✓";
          opt.appendChild(check);
        }

        if (seasonLabel) seasonLabel.textContent = selectedSeason.title;

        // Update Coming Soon indicators on mode buttons if season is unreleased
        const isSeasonComingSoon = selectedSeason.isComingSoon === true;
        if (downloadComingSoonTag) {
          downloadComingSoonTag.style.display = isSeasonComingSoon ? 'inline-block' : 'none';
        }

        refreshPlaylist();
        dropdownWrapper?.classList.remove("open");
      });
    });
  }

  // --------------------------------------------------------------------------
  // Dedicated Episode Download Page & Stream View
  // --------------------------------------------------------------------------
  static renderTelegramStreamView(anime, epNum = 1, seasonNum = 1, mode = "download", lang = "hindi") {
    const container = document.getElementById("stream-view");
    if (!container || !anime) return;

    // Determine available languages for this anime
    const determineLanguages = (a) => {
      if (Array.isArray(a.languages) && a.languages.length > 0) {
        return a.languages.map(l => l.toLowerCase());
      }
      const set = new Set();
      const allEpisodes = (a.seasons || []).flatMap(s => s.episodes || []).concat(a.episodes || []);
      for (const e of allEpisodes) {
        if (e.downloadLinks?.hindi || e.downloadUrl) set.add("hindi");
        if (e.downloadLinks?.original) set.add("original");
      }
      return set.size > 0 ? Array.from(set) : ["hindi", "original"];
    };

    const availableLangs = determineLanguages(anime);
    const hasHindi = availableLangs.includes("hindi");
    const hasOriginal = availableLangs.includes("original");

    let currentLang = lang || (hasHindi ? "hindi" : (hasOriginal ? "original" : "hindi"));
    if (!availableLangs.includes(currentLang)) {
      currentLang = hasHindi ? "hindi" : (hasOriginal ? "original" : "hindi");
    }

    const sNum = parseInt(seasonNum, 10) || 1;
    const seasons = anime.seasons || [];
    const currentSeason = seasons.find(s => s.number === sNum) || seasons[0];
    const eps = currentSeason?.episodes || anime.episodes || [];
    const currentEpIndex = eps.findIndex(e => e.number === parseInt(epNum, 10));
    const ep = currentEpIndex !== -1 ? eps[currentEpIndex] : { number: epNum, title: `Episode ${epNum}` };

    const prevEp = currentEpIndex > 0 ? eps[currentEpIndex - 1] : null;
    const nextEp = currentEpIndex >= 0 && currentEpIndex < eps.length - 1 ? eps[currentEpIndex + 1] : null;

    // Telegram is ONLY enabled if explicitly tagged as added from Telegram
    const hasTelegram = Boolean(ep.hasTelegram || ep.telegramFileId || anime.hasTelegram);
    const deepLinkKey = sNum > 1 ? `${anime.id}_s${sNum}_ep${ep.number}` : `${anime.id}_ep${ep.number}`;

    // Direct download link (Single High Quality option supporting language tracks)
    const dlLinks = ep.downloadLinks || {};
    const getActiveDlUrl = (l) => (dlLinks && dlLinks[l]) ? dlLinks[l] : (dlLinks["1080p"] || dlLinks["720p"] || dlLinks["480p"] || ep.downloadUrl || "");
    const directDlUrl = getActiveDlUrl(currentLang);

    container.innerHTML = `
      <div class="download-page-wrapper">
        <div class="download-page-bg" style="background-image: url('${anime.banner || anime.poster}');"></div>
        <div class="download-page-overlay"></div>

        <div class="download-card-container">
          <div class="download-hub-card">
            <!-- Header Pill -->
            <div class="download-header-pill">
              <a href="#anime/${anime.id}" class="dl-back-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                <span>${anime.title}</span>
              </a>
              <span class="dl-ep-tag">${anime.type === "Movie" ? "🎬 Full Feature Film" : `Season ${sNum} &bull; Episode ${ep.number}`}</span>
            </div>

            <!-- Anime & Episode Preview -->
            <div class="download-anime-preview">
              <div class="download-thumb-box">
                <img src="${ep.thumbnail || anime.poster}" alt="${ep.title}" onerror="this.onerror=null; this.src=window.FALLBACK_THUMB;" />
                <span class="dl-thumb-runtime">${ep.runtime || (anime.type === "Movie" ? '1h 45m' : '24m')}</span>
              </div>
              <div class="download-anime-meta">
                <h2 class="download-anime-title">${anime.title}</h2>
                <h3 class="download-ep-title">${anime.type === "Movie" ? `${anime.title} (Full Movie)` : ep.title}</h3>
                <div class="download-tags-row">
                  <span class="badge badge-rating">★ ${anime.rating || '8.8'}</span>
                  <span class="badge badge-gold-pill">High Quality FHD</span>
                </div>
              </div>
            </div>

            <!-- Technical File Details -->
            <div class="download-info-grid">
              <div class="dl-info-item">
                <span class="dl-info-label">Audio</span>
                <span class="dl-info-value" id="dl-info-audio">${currentLang === 'original' ? 'Original Japanese Dub + English Sub' : 'Hindi Dub + English Sub'}</span>
              </div>
              <div class="dl-info-item">
                <span class="dl-info-label">Format</span>
                <span class="dl-info-value">MKV / MP4 (H.264/AAC)</span>
              </div>
              <div class="dl-info-item">
                <span class="dl-info-label">Quality</span>
                <span class="dl-info-value">High Quality (1080p FHD)</span>
              </div>
              <div class="dl-info-item">
                <span class="dl-info-label">Status</span>
                <span class="dl-info-value" style="color: #4ade80;">Fast Direct Server</span>
              </div>
            </div>

            <!-- Direct Download Servers Stack -->
            <div class="download-servers-section">
              <!-- Audio Track Selector on Download Card -->
              <div class="dl-lang-selector-box">
                <span class="dl-lang-label">🎧 Audio Track:</span>
                <div class="language-toggle-group" id="stream-lang-toggle">
                  ${hasHindi && hasOriginal ? `
                    <button class="lang-toggle-btn ${currentLang === 'hindi' ? 'active' : ''}" data-lang="hindi" type="button">
                      <span class="lang-flag">🇮🇳</span>
                      <span class="lang-text">Hindi Dub</span>
                    </button>
                    <button class="lang-toggle-btn ${currentLang === 'original' ? 'active' : ''}" data-lang="original" type="button">
                      <span class="lang-flag">🇯🇵</span>
                      <span class="lang-text">Original Dub</span>
                    </button>
                  ` : (hasHindi ? `
                    <button class="lang-toggle-btn active single-lang" data-lang="hindi" type="button" style="cursor: default;">
                      <span class="lang-flag">🇮🇳</span>
                      <span class="lang-text">Hindi Dub</span>
                    </button>
                  ` : `
                    <button class="lang-toggle-btn active single-lang" data-lang="original" type="button" style="cursor: default;">
                      <span class="lang-flag">🇯🇵</span>
                      <span class="lang-text">Original Dub</span>
                    </button>
                  `)}
                </div>
              </div>

              <div class="download-section-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                </svg>
                <span>Direct Download:</span>
              </div>

              <div class="download-buttons-stack">
                <!-- Single High Quality & Direct Download Option -->
                <a href="${directDlUrl || 'javascript:void(0)'}" ${directDlUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} class="btn-download-server direct-dl-btn single-hq-download" data-quality="High Quality" data-has-link="${Boolean(directDlUrl)}">
                  <div class="server-btn-left">
                    <span class="server-badge res-1080" style="background: linear-gradient(135deg, #3a86ff, #00b4d8); font-weight: 800; font-size: 0.85rem; padding: 5px 12px;">HQ</span>
                    <div class="server-details">
                      <span class="server-name" id="dl-server-title" style="font-size: 1.05rem; font-weight: 700; color: #fff;">High Quality &amp; Direct Download (${currentLang === 'original' ? 'Original Dub' : 'Hindi Dub'})</span>
                      <span class="server-meta" id="dl-server-meta" style="color: #94a3b8; font-size: 0.84rem;">Fast Direct Server &bull; Full HD (1080p / 720p) &bull; ${currentLang === 'original' ? 'Original Japanese Audio + English Sub' : 'Hindi Dub Audio + English Sub'}</span>
                    </div>
                  </div>
                  <div class="server-btn-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                    <span>Direct Download</span>
                  </div>
                </a>

                <!-- TELEGRAM OPTION: ONLY RENDERED IF ANIME WAS ACTUALLY ADDED VIA TELEGRAM -->
                ${hasTelegram ? `
                  <a href="https://t.me/Auto_737_upload_bot?start=${deepLinkKey}" target="_blank" rel="noopener noreferrer" class="btn-download-server telegram-server">
                    <div class="server-btn-left">
                      <img src="assets/telegram.webp" class="tg-server-icon" alt="" />
                      <div class="server-details">
                        <span class="server-name">Download via Telegram Bot</span>
                        <span class="server-meta">Instant file delivery in Telegram app</span>
                      </div>
                    </div>
                    <div class="server-btn-action">
                      <span>Open Bot</span>
                    </div>
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- Episode Navigation Footer -->
            <div class="download-nav-footer">
              ${anime.type === "Movie" ? `
                <a href="#anime/${anime.id}" class="btn-ep-nav-all" style="flex: 1; text-align: center;">&larr; Back to Movie Details</a>
              ` : `
                ${prevEp ? `<a href="#stream/${anime.id}/${prevEp.number}?s=${sNum}&mode=download&lang=${currentLang}" class="btn-ep-nav">&larr; Ep ${prevEp.number}</a>` : `<span></span>`}
                <a href="#anime/${anime.id}" class="btn-ep-nav-all">All Episodes (${currentSeason.title})</a>
                ${nextEp ? `<a href="#stream/${anime.id}/${nextEp.number}?s=${sNum}&mode=download&lang=${currentLang}" class="btn-ep-nav">Ep ${nextEp.number} &rarr;</a>` : `<span></span>`}
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // Language Switcher on Download Card
    const streamLangToggle = container.querySelector("#stream-lang-toggle");
    streamLangToggle?.querySelectorAll(".lang-toggle-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedLang = btn.dataset.lang || "hindi";
        if (selectedLang === currentLang) return;
        currentLang = selectedLang;

        streamLangToggle.querySelectorAll(".lang-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const audioEl = container.querySelector("#dl-info-audio");
        const titleEl = container.querySelector("#dl-server-title");
        const metaEl = container.querySelector("#dl-server-meta");

        if (audioEl) {
          audioEl.textContent = currentLang === 'original' ? 'Original Japanese Dub + English Sub' : 'Hindi Dub + English Sub';
        }
        if (titleEl) {
          titleEl.textContent = `High Quality & Direct Download (${currentLang === 'original' ? 'Original Dub' : 'Hindi Dub'})`;
        }
        if (metaEl) {
          metaEl.textContent = `Fast Direct Server • Full HD (1080p / 720p) • ${currentLang === 'original' ? 'Original Japanese Audio + English Sub' : 'Hindi Dub Audio + English Sub'}`;
        }

        // Dynamically switch download URL to active language track
        const activeUrl = getActiveDlUrl(currentLang);
        const dlBtn = container.querySelector(".direct-dl-btn");
        if (dlBtn) {
          dlBtn.href = activeUrl || "javascript:void(0)";
          dlBtn.dataset.hasLink = Boolean(activeUrl);
          if (activeUrl) {
            dlBtn.setAttribute("target", "_blank");
            dlBtn.setAttribute("rel", "noopener noreferrer");
          } else {
            dlBtn.removeAttribute("target");
            dlBtn.removeAttribute("rel");
          }
        }
      });
    });

    // Direct Download Click Listener (Handles pending links smoothly)
    container.querySelectorAll(".direct-dl-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const hasLink = btn.dataset.hasLink === "true";
        if (!hasLink) {
          e.preventDefault();
          UIRenderer.showToast("Fast Direct Server ready! Link will start download once active.", "default");
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Browse View
  // --------------------------------------------------------------------------
  static renderBrowseCatalog(animeList) {
    const grid = document.getElementById("browse-grid");
    const countEl = document.getElementById("browse-count");
    if (!grid) return;

    if (countEl) countEl.textContent = `${animeList.length} Anime Titles`;

    if (!animeList || animeList.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <h3>No Anime Found</h3>
          <p>Try searching for a different anime or category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = animeList.map(anime => this.renderAnimeCard(anime)).join("");
  }

  // --------------------------------------------------------------------------
  // Watchlist View
  // --------------------------------------------------------------------------
  static renderWatchlistView() {
    const grid = document.getElementById("watchlist-grid");
    const countEl = document.getElementById("watchlist-count");
    if (!grid) return;

    const watchlistIds = StorageService.getWatchlist();
    const list = watchlistIds.map(id => getAnimeById(id)).filter(Boolean);

    if (countEl) countEl.textContent = `${list.length} Titles`;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <h3>Your Watchlist is Empty</h3>
          <p>Explore Shinobi HUB and click "Add to Watchlist" to save shows you love.</p>
          <a href="#browse" class="btn btn-primary">EXPLORE ALL</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(anime => this.renderAnimeCard(anime)).join("");
  }

  // --------------------------------------------------------------------------
  // Watch History View
  // --------------------------------------------------------------------------
  static renderHistoryView() {
    const grid = document.getElementById("history-grid");
    const countEl = document.getElementById("history-count");
    if (!grid) return;

    const history = StorageService.getWatchHistory();
    if (countEl) countEl.textContent = `${history.length} Entries`;

    if (history.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-box" style="grid-column: 1 / -1;">
          <h3>No Watch History</h3>
          <p>Shows and episodes you stream will appear here so you can easily jump back in.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = history.map(item => {
      const anime = getAnimeById(item.animeId);
      if (!anime) return "";
      const ep = (anime.episodes || []).find(e => e.number === item.episodeNumber) || anime.episodes?.[0];
      return `
        <div class="continue-card play-episode-btn" data-anime-id="${anime.id}" data-ep="${item.episodeNumber}">
          <div class="continue-thumb">
            <img src="${ep?.thumbnail || anime.banner || anime.poster}" alt="${anime.title}" />
            <div class="continue-play-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="continue-progress-bar">
              <div class="continue-progress-fill" style="width: ${item.percent}%;"></div>
            </div>
          </div>
          <div class="continue-body">
            <h4 class="continue-title">${anime.title}</h4>
            <div class="continue-sub">
              <span>Episode ${item.episodeNumber}</span>
              <span>${item.percent}%</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}
