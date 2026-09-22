/**
 * KING STORE - MAIN APPLICATION CONTROLLER
 */

import { 
  ANIME_DATABASE, 
  GENRE_LIST, 
  getTrendingAnime, 
  getPopularAnime, 
  getActionAnime, 
  getTopRatedAnime, 
  getMovies,
  getNewReleases,
  getAnimeById, 
  searchAnime 
} from './data.js';
import { StorageService, DEFAULT_AVATARS } from './storage.js';
import { VideoPlayer } from './player.js';
import { UIRenderer } from './ui.js';

class App {
  constructor() {
    this.player = new VideoPlayer();
    this.currentHeroIndex = 0;
    this.heroInterval = null;
    this.featuredList = getTrendingAnime().slice(0, 6);
    this.selectedCategory = "All";

    this.init();
  }

  init() {
    this.initHeader();
    this.initHeroSlider();
    this.initShelves();
    this.initGlobalDelegation();
    this.initSearch();
    this.initModals();
    this.updateCounters();
    this.initRouting();

    // Listen to storage events
    window.addEventListener("cr:watchlist-changed", () => {
      this.updateCounters();
      UIRenderer.renderContinueWatching();
      if (window.location.hash.startsWith("#watchlist")) {
        UIRenderer.renderWatchlistView();
      }
    });

    window.addEventListener("cr:history-cleared", () => {
      UIRenderer.renderContinueWatching();
      if (window.location.hash.startsWith("#history")) {
        UIRenderer.renderHistoryView();
      }
    });

    window.addEventListener("cr:history-changed", () => {
      UIRenderer.renderContinueWatching();
      if (window.location.hash.startsWith("#history")) {
        UIRenderer.renderHistoryView();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Header & Navigation
  // --------------------------------------------------------------------------
  initHeader() {
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    });

    // Category dropdown click handlers
    document.querySelectorAll(".category-menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = item.dataset.category || "All";
        this.selectedCategory = cat;
        window.location.hash = `#browse?category=${encodeURIComponent(cat)}`;
      });
    });

    // Mobile & Desktop nav items
    document.querySelectorAll(".mobile-nav-item, .nav-link").forEach(link => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".mobile-nav-item, .nav-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  updateCounters() {
    const count = StorageService.getWatchlist().length;
    const badge = document.getElementById("watchlist-badge-count");
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    }
  }

  // --------------------------------------------------------------------------
  // Router & View Switching
  // --------------------------------------------------------------------------
  initRouting() {
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash || "#home";
    const [pathPart, queryPart] = hash.slice(1).split("?");
    const parts = pathPart.split("/");
    const root = parts[0];

    // Check query params
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      if (params.has("category")) {
        this.selectedCategory = decodeURIComponent(params.get("category"));
      } else {
        this.selectedCategory = "All";
      }
      if (params.has("type")) {
        this.selectedType = decodeURIComponent(params.get("type"));
      } else {
        this.selectedType = "All";
      }
      if (params.has("q")) {
        this.searchQuery = decodeURIComponent(params.get("q"));
      } else if (params.has("search")) {
        this.searchQuery = decodeURIComponent(params.get("search"));
      } else {
        this.searchQuery = "";
      }
      if (params.has("focus") && params.get("focus") === "search") {
        setTimeout(() => {
          document.getElementById("browse-search-input")?.focus();
        }, 120);
      }
    } else {
      this.searchQuery = "";
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(view => view.classList.remove("active"));

    // Route matching
    if (root === "home" || root === "") {
      document.getElementById("home-view")?.classList.add("active");
      UIRenderer.renderContinueWatching();
    } else if (root === "browse" || root === "library") {
      document.getElementById("browse-view")?.classList.add("active");
      this.initBrowseView();
    } else if (root === "anime") {
      const animeId = parts[1];
      const anime = getAnimeById(animeId);
      if (anime) {
        document.getElementById("detail-view")?.classList.add("active");
        UIRenderer.renderAnimeDetail(anime);
      } else {
        window.location.hash = "#home";
      }
    } else if (root === "stream" || root === "watch") {
      const animeId = parts[1];
      const epNum = parts[2] || 1;
      const params = queryPart ? new URLSearchParams(queryPart) : null;
      const seasonNum = params?.get("s") || params?.get("season") || 1;
      const mode = params?.get("mode") || (root === "watch" ? "watch" : "download");
      const anime = getAnimeById(animeId);
      if (anime) {
        document.getElementById("stream-view")?.classList.add("active");
        UIRenderer.renderTelegramStreamView(anime, epNum, seasonNum, mode);
      } else {
        window.location.hash = "#home";
      }
    } else if (root === "watchlist") {
      document.getElementById("watchlist-view")?.classList.add("active");
      UIRenderer.renderWatchlistView();
    } else if (root === "history") {
      document.getElementById("history-view")?.classList.add("active");
      UIRenderer.renderHistoryView();
    }
  }

  // --------------------------------------------------------------------------
  // Hero Slider
  // --------------------------------------------------------------------------
  initHeroSlider() {
    this.featuredList = getTrendingAnime().slice(0, 6);
    UIRenderer.renderHeroSlider(this.featuredList);

    // Indicator clicks
    const dots = document.querySelectorAll(".hero-dot");
    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const idx = parseInt(dot.dataset.index);
        this.setHeroSlide(idx);
        this.startHeroAutoPlay();
      });
    });

    // Previous & Next Arrow Navigation Buttons
    const prevBtn = document.getElementById("hero-prev-btn");
    const nextBtn = document.getElementById("hero-next-btn");

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prevIdx = (this.currentHeroIndex - 1 + this.featuredList.length) % this.featuredList.length;
      this.setHeroSlide(prevIdx);
      this.startHeroAutoPlay();
    });

    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nextIdx = (this.currentHeroIndex + 1) % this.featuredList.length;
      this.setHeroSlide(nextIdx);
      this.startHeroAutoPlay();
    });

    // Auto rotate
    this.startHeroAutoPlay();
  }

  startHeroAutoPlay() {
    if (this.heroInterval) clearInterval(this.heroInterval);
    this.heroInterval = setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.featuredList.length;
      this.setHeroSlide(this.currentHeroIndex);
    }, 6000);
  }

  setHeroSlide(index) {
    this.currentHeroIndex = index;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  }

  // --------------------------------------------------------------------------
  // Shelves Initialization & Scroll Navigation
  // --------------------------------------------------------------------------
  initShelves() {
    UIRenderer.renderContinueWatching();

    UIRenderer.renderShelf("trending-shelf-track", getTrendingAnime());
    UIRenderer.renderShelf("popular-shelf-track", getPopularAnime());
    UIRenderer.renderShelf("action-shelf-track", getActionAnime());
    UIRenderer.renderShelf("top-shelf-track", getTopRatedAnime());
    UIRenderer.renderShelf("movies-shelf-track", getMovies());
    UIRenderer.renderShelf("new-releases-shelf-track", getNewReleases());

    // Shelf Left / Right navigation buttons
    document.querySelectorAll(".shelf-nav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wrapper = btn.closest(".shelf-carousel-wrapper");
        const track = wrapper?.querySelector(".shelf-track");
        if (!track) return;
        const scrollAmount = track.clientWidth * 0.75;
        if (btn.classList.contains("prev")) {
          track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Browse View & Filters
  // --------------------------------------------------------------------------
  initBrowseView() {
    let currentSearch = this.searchQuery || "";
    let currentGenre = this.selectedCategory || "All";
    let currentType = this.selectedType || "All";
    let currentSort = "popularity";

    const filterTypeSelect = document.getElementById("filter-type");
    if (filterTypeSelect && currentType) {
      filterTypeSelect.value = currentType;
    }

    const browseSearchInput = document.getElementById("browse-search-input");
    const browseClearBtn = document.getElementById("browse-search-clear-btn");

    const applyFilters = () => {
      const filtered = searchAnime(currentSearch, currentGenre, currentType, currentSort);
      UIRenderer.renderBrowseCatalog(filtered);
    };

    if (browseSearchInput) {
      browseSearchInput.value = currentSearch;
      if (browseClearBtn) browseClearBtn.classList.toggle("visible", currentSearch.length > 0);

      browseSearchInput.oninput = () => {
        currentSearch = browseSearchInput.value.trim();
        this.searchQuery = currentSearch;
        if (browseClearBtn) browseClearBtn.classList.toggle("visible", currentSearch.length > 0);
        applyFilters();
      };

      if (browseClearBtn) {
        browseClearBtn.onclick = () => {
          browseSearchInput.value = "";
          currentSearch = "";
          this.searchQuery = "";
          browseClearBtn.classList.remove("visible");
          applyFilters();
        };
      }
    }

    const genreContainer = document.getElementById("genre-pills-container");
    if (genreContainer) {
      genreContainer.innerHTML = GENRE_LIST.map(g => `
        <button class="filter-pill ${g === currentGenre ? 'active' : ''}" data-genre="${g}">${g}</button>
      `).join("");

      genreContainer.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          genreContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          currentGenre = pill.dataset.genre;
          this.selectedCategory = currentGenre;
          applyFilters();
        });
      });
    }

    const typeSelect = document.getElementById("filter-type");
    const sortSelect = document.getElementById("filter-sort");

    typeSelect?.addEventListener("change", (e) => {
      currentType = e.target.value;
      applyFilters();
    });

    sortSelect?.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFilters();
    });

    // Initial render
    applyFilters();
  }

  // --------------------------------------------------------------------------
  // Global Event Delegation
  // --------------------------------------------------------------------------
  initGlobalDelegation() {
    document.body.addEventListener("click", (e) => {
      // 1. Anime Card clicked -> ALWAYS navigate to anime episode details page
      const animeCard = e.target.closest(".anime-card");
      if (animeCard && !e.target.closest(".watchlist-toggle-btn")) {
        e.preventDefault();
        e.stopPropagation();
        const animeId = animeCard.dataset.animeId;
        if (animeId) {
          window.location.hash = `#anime/${animeId}`;
          return;
        }
      }

      // 2. Detail button or Hero Slide clicked -> navigate to anime details page
      const detailBtn = e.target.closest(".detail-view-btn");
      if (detailBtn) {
        e.preventDefault();
        e.stopPropagation();
        const animeId = detailBtn.dataset.animeId;
        if (animeId) {
          window.location.hash = `#anime/${animeId}`;
          return;
        }
      }

      const heroSlide = e.target.closest(".hero-slide");
      if (heroSlide && !e.target.closest(".watchlist-toggle-btn") && !e.target.closest(".hero-controls") && !e.target.closest(".hero-nav-arrow")) {
        e.preventDefault();
        e.stopPropagation();
        const animeId = heroSlide.dataset.animeId;
        if (animeId) {
          window.location.hash = `#anime/${animeId}`;
          return;
        }
      }

      // 3. Play/Download Episode clicked (from episode rows, detail watch button, or continue-watching card)
      const playBtn = e.target.closest(".play-episode-btn");
      if (playBtn) {
        e.preventDefault();
        e.stopPropagation();
        const animeId = playBtn.dataset.animeId;
        const ep = playBtn.dataset.ep || 1;
        const season = playBtn.dataset.season || 1;
        const mode = playBtn.dataset.mode || "download";
        // Record this click in Continue Watching history
        StorageService.recordEpisodeClick(animeId, ep, season);
        window.location.hash = `#stream/${animeId}/${ep}?s=${season}&mode=${mode}`;
        return;
      }

      // 4. Watchlist Toggle clicked
      const watchlistBtn = e.target.closest(".watchlist-toggle-btn");
      if (watchlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const animeId = watchlistBtn.dataset.animeId;
        const added = StorageService.toggleWatchlist(animeId);
        
        // Update button UI if on detail page
        const span = watchlistBtn.querySelector("span");
        const svg = watchlistBtn.querySelector("svg");
        if (span) span.textContent = added ? "IN WATCHLIST" : "ADD TO WATCHLIST";
        if (svg) svg.setAttribute("fill", added ? "var(--cr-accent-gold)" : "none");

        UIRenderer.showToast(added ? "Added to your Watchlist" : "Removed from Watchlist", "success");
        return;
      }

      // 5. Clear History Button
      if (e.target.id === "clear-history-btn") {
        StorageService.clearHistory();
        UIRenderer.renderHistoryView();
        UIRenderer.renderContinueWatching();
        UIRenderer.showToast("Watch history cleared", "default");
        return;
      }
    });
  }

  // --------------------------------------------------------------------------
  // Header Live Search
  // --------------------------------------------------------------------------
  initSearch() {
    const searchContainer = document.getElementById("header-search-container");
    const searchInput = document.getElementById("header-search-input");
    const dropdown = document.getElementById("search-results-dropdown");
    const clearBtn = document.getElementById("search-clear-btn");
    const mobileToggleBtn = document.getElementById("mobile-search-toggle");

    if (!searchInput || !dropdown) return;

    // Mobile Search Toggle
    mobileToggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      searchContainer?.classList.toggle("mobile-open");
      if (searchContainer?.classList.contains("mobile-open")) {
        searchInput.focus();
      }
    });

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim();
      clearBtn?.classList.toggle("visible", q.length > 0);

      if (!q) {
        dropdown.classList.remove("active");
        return;
      }

      const results = searchAnime(q);
      if (results.length > 0) {
        dropdown.innerHTML = results.slice(0, 8).map(anime => `
          <div class="search-result-row" data-anime-id="${anime.id}">
            <img src="${anime.poster}" class="search-result-img" alt="${anime.title}" />
            <div class="search-result-info">
              <div class="search-result-title">${anime.title}</div>
              <div class="search-result-meta">
                <span class="badge badge-rating">★ ${anime.rating}</span>
                <span class="badge badge-gold-pill" style="font-size: 0.65rem;">${anime.audioBadge || 'Multi-Audio'}</span>
                <span>${(anime.genres || []).slice(0, 2).join(", ")}</span>
              </div>
            </div>
          </div>
        `).join("");
        dropdown.classList.add("active");
      } else {
        dropdown.innerHTML = `
          <div style="padding: 18px; text-align: center; color: var(--cr-text-muted); font-size: 0.88rem;">
            No anime found for "${q}"
          </div>
        `;
        dropdown.classList.add("active");
      }
    });

    // Re-open dropdown on focus if text exists
    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) {
        dropdown.classList.add("active");
      }
    });

    // Click search result
    dropdown.addEventListener("click", (e) => {
      const row = e.target.closest(".search-result-row");
      if (row) {
        const animeId = row.dataset.animeId;
        window.location.hash = `#anime/${animeId}`;
        dropdown.classList.remove("active");
        searchContainer?.classList.remove("mobile-open");
        searchInput.value = "";
        clearBtn?.classList.remove("visible");
      }
    });

    clearBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      searchInput.value = "";
      dropdown.classList.remove("active");
      clearBtn.classList.remove("visible");
      searchInput.focus();
    });

    // Enter to navigate to browse with query
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && searchInput.value.trim()) {
        const q = searchInput.value.trim();
        dropdown.classList.remove("active");
        searchContainer?.classList.remove("mobile-open");
        window.location.hash = `#browse?q=${encodeURIComponent(q)}`;
      }
    });

    // Close dropdown on click outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".header-search") && !e.target.closest("#mobile-search-toggle")) {
        dropdown.classList.remove("active");
        searchContainer?.classList.remove("mobile-open");
      }
    });
  }

  // --------------------------------------------------------------------------
  // Modals (Shortcuts Cheat Sheet)
  // --------------------------------------------------------------------------
  initModals() {
    // Keyboard shortcuts cheat sheet modal
    const shortcutsModal = document.getElementById("shortcuts-modal");
    const openShortcutsBtn = document.getElementById("player-shortcuts-btn");
    const closeShortcutsBtn = document.getElementById("close-shortcuts-modal");

    openShortcutsBtn?.addEventListener("click", () => shortcutsModal?.classList.add("active"));
    closeShortcutsBtn?.addEventListener("click", () => shortcutsModal?.classList.remove("active"));

    shortcutsModal?.addEventListener("click", (e) => {
      if (e.target === shortcutsModal) shortcutsModal.classList.remove("active");
    });
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.kingApp = new App();
});
