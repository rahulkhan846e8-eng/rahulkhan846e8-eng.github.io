/**
 * KING STORE - MAIN APPLICATION CONTROLLER
 */

import { 
  GENRE_LIST, 
  getNewlyAddedAnime, 
  getPopularAnime, 
  getActionAnime, 
  getTopRatedAnime, 
  getMovies, 
  getAnimeSummary as getAnimeById, 
  getFullAnimeDetails,
  searchAnime 
} from './catalog.js';
import { StorageService, DEFAULT_AVATARS } from './storage.js';
import { VideoPlayer } from './player.js';
import { UIRenderer } from './ui.js?v=20261003_v3';

class App {
  constructor() {
    this.player = new VideoPlayer();
    this.currentHeroIndex = 0;
    this.heroInterval = null;
    this.featuredList = getPopularAnime().slice(0, 6);
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
      const hash = window.location.hash || "#home";
      const root = hash.slice(1).split("?")[0].split("/")[0];
      if (root !== "anime" && root !== "stream" && root !== "watch") {
        sessionStorage.setItem("shinobi_last_browse_scroll", window.scrollY.toString());
      }
      if (window.scrollY > 20) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    }, { passive: true });

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

    // Legal & Policy Direct Page Redirects
    const legalRedirects = {
      dmca: "dmca.html",
      disclaimer: "disclaimer.html",
      privacy: "privacy-policy.html",
      terms: "terms-and-conditions.html",
      about: "about-us.html",
      contact: "contact-us.html",
      legal: "dmca.html"
    };
    if (legalRedirects[root]) {
      window.location.href = legalRedirects[root];
      return;
    }

    // Check if we are restoring previous browse scroll position
    const shouldRestoreScroll = sessionStorage.getItem("shinobi_restore_scroll") === "1";
    sessionStorage.removeItem("shinobi_restore_scroll");
    const savedScrollY = parseInt(sessionStorage.getItem("shinobi_last_browse_scroll") || "0", 10);

    // Scroll to top only if not restoring previous scroll position
    if (!shouldRestoreScroll || savedScrollY <= 0) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(view => view.classList.remove("active"));

    // Track last browse page for back navigation
    if (root !== "anime" && root !== "stream" && root !== "watch") {
      sessionStorage.setItem("shinobi_last_browse_page", window.location.hash || "#home");
    }

    // Route matching
    if (root === "home" || root === "") {
      document.getElementById("home-view")?.classList.add("active");
      UIRenderer.renderContinueWatching();
    } else if (root === "browse" || root === "library") {
      document.getElementById("browse-view")?.classList.add("active");
      this.initBrowseView();
    } else if (root === "anime") {
      const animeId = parts[1];
      const params = queryPart ? new URLSearchParams(queryPart) : null;
      const savedSeason = sessionStorage.getItem(`shinobi_last_season_${animeId}`);
      const savedEp = sessionStorage.getItem(`shinobi_last_ep_${animeId}`);

      const initialSeasonNum = params?.has("s") 
        ? parseInt(params.get("s"), 10) 
        : (params?.has("season") ? parseInt(params.get("season"), 10) : (savedSeason ? parseInt(savedSeason, 10) : 1));

      const targetEpNum = params?.has("ep") 
        ? parseInt(params.get("ep"), 10) 
        : (params?.has("episode") ? parseInt(params.get("episode"), 10) : (savedEp ? parseInt(savedEp, 10) : 0));

      const animeSummary = getAnimeById(animeId);
      if (animeSummary) {
        document.getElementById("detail-view")?.classList.add("active");
        UIRenderer.renderAnimeDetail(animeSummary, initialSeasonNum, targetEpNum);
        getFullAnimeDetails(animeId).then(fullAnime => {
          if (fullAnime && fullAnime.seasons && window.location.hash.startsWith(`#anime/${animeId}`)) {
            UIRenderer.renderAnimeDetail(fullAnime, initialSeasonNum, targetEpNum);
          }
        });
      } else {
        window.location.hash = "#home";
      }
    } else if (root === "stream" || root === "watch") {
      const animeId = parts[1];
      const epNum = parts[2] || 1;
      const params = queryPart ? new URLSearchParams(queryPart) : null;
      const seasonNum = params?.get("s") || params?.get("season") || 1;
      const mode = params?.get("mode") || (root === "watch" ? "watch" : "download");
      const lang = params?.get("lang") || "hindi";

      document.getElementById("stream-view")?.classList.add("active");
      getFullAnimeDetails(animeId).then(anime => {
        if (anime && (window.location.hash.startsWith("#stream") || window.location.hash.startsWith("#watch"))) {
          UIRenderer.renderTelegramStreamView(anime, epNum, seasonNum, mode, lang);
        } else if (!anime) {
          window.location.hash = "#home";
        }
      });
    } else if (root === "watchlist") {
      document.getElementById("watchlist-view")?.classList.add("active");
      UIRenderer.renderWatchlistView();
    } else if (root === "history") {
      document.getElementById("history-view")?.classList.add("active");
      UIRenderer.renderHistoryView();
    }

    // Restore scroll position on browse / library / home views if returning from anime details
    if (shouldRestoreScroll && savedScrollY > 0 && (root === "browse" || root === "library" || root === "home" || root === "watchlist" || root === "history")) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({ top: savedScrollY, behavior: "instant" });
        }, 40);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Hero Slider
  // --------------------------------------------------------------------------
  initHeroSlider() {
    this.featuredList = getPopularAnime().slice(0, 6);
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
    try {
      UIRenderer.renderContinueWatching();
    } catch (e) {
      console.warn("Continue watching render error:", e);
    }

    try {
      UIRenderer.renderShelf("newly-added-shelf-track", getNewlyAddedAnime());
    } catch (e) {
      console.error("Newly added shelf render error:", e);
    }

    try {
      UIRenderer.renderShelf("popular-shelf-track", getPopularAnime());
    } catch (e) {
      console.error("Popular shelf render error:", e);
    }

    try {
      UIRenderer.renderShelf("action-shelf-track", getActionAnime());
    } catch (e) {
      console.error("Action shelf render error:", e);
    }

    try {
      UIRenderer.renderShelf("top-shelf-track", getTopRatedAnime());
    } catch (e) {
      console.error("Top shelf render error:", e);
    }

    try {
      UIRenderer.renderShelf("movies-shelf-track", getMovies());
    } catch (e) {
      console.error("Movies shelf render error:", e);
    }

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
  // Browse View & Auto-Organizer Filters
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

    const sortSelect = document.getElementById("filter-sort");
    if (sortSelect) {
      sortSelect.value = currentSort;
    }

    const browseSearchInput = document.getElementById("browse-search-input");
    const browseClearBtn = document.getElementById("browse-search-clear-btn");
    const filterToggleBtn = document.getElementById("browse-filter-toggle");
    const filterDrawer = document.getElementById("browse-filter-drawer");
    const drawerCloseBtn = document.getElementById("drawer-close-btn");
    const activeDot = document.getElementById("browse-filter-active-dot");
    const activeFilterBar = document.getElementById("browse-active-filter-bar");
    const activeTagName = document.getElementById("browse-active-tag-name");
    const clearActiveTagBtn = document.getElementById("browse-clear-active-tag");
    const resetFiltersBtn = document.getElementById("browse-reset-filters-btn");
    const genreContainer = document.getElementById("genre-pills-container");

    const updateActiveIndicator = () => {
      const hasFilter = (currentGenre && currentGenre !== "All") || (currentType && currentType !== "All");
      if (activeDot) activeDot.style.display = hasFilter ? "block" : "none";

      if (activeFilterBar) {
        if (currentGenre && currentGenre !== "All") {
          activeFilterBar.style.display = "flex";
          if (activeTagName) activeTagName.textContent = currentGenre;
        } else {
          activeFilterBar.style.display = "none";
        }
      }
    };

    const toggleDrawer = (forceState) => {
      if (!filterDrawer) return;
      const willOpen = forceState !== undefined ? forceState : !filterDrawer.classList.contains("open");
      filterDrawer.classList.toggle("open", willOpen);
      filterToggleBtn?.classList.toggle("active", willOpen);
      filterToggleBtn?.setAttribute("aria-expanded", willOpen ? "true" : "false");
    };

    if (filterToggleBtn) {
      filterToggleBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDrawer();
      };
    }

    if (drawerCloseBtn) {
      drawerCloseBtn.onclick = (e) => {
        e.preventDefault();
        toggleDrawer(false);
      };
    }

    // Close drawer when clicking outside search bar wrap
    const searchBarWrap = document.querySelector(".browse-search-bar-wrap");
    document.addEventListener("click", (e) => {
      if (searchBarWrap && !searchBarWrap.contains(e.target) && filterDrawer?.classList.contains("open")) {
        toggleDrawer(false);
      }
    });

    const applyFilters = () => {
      const filtered = searchAnime(currentSearch, currentGenre, currentType, currentSort);
      UIRenderer.renderBrowseCatalog(filtered);
      updateActiveIndicator();
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
        browseClearBtn.onclick = (e) => {
          e.preventDefault();
          browseSearchInput.value = "";
          currentSearch = "";
          this.searchQuery = "";
          browseClearBtn.classList.remove("visible");
          applyFilters();
          browseSearchInput.focus();
        };
      }
    }

    if (genreContainer) {
      genreContainer.innerHTML = GENRE_LIST.map(g => `
        <button type="button" class="filter-pill ${g === currentGenre ? 'active' : ''}" data-genre="${g}">${g}</button>
      `).join("");

      genreContainer.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
          e.preventDefault();
          const clickedGenre = pill.dataset.genre;
          if (clickedGenre === currentGenre && clickedGenre !== "All") {
            currentGenre = "All";
          } else {
            currentGenre = clickedGenre;
          }
          this.selectedCategory = currentGenre;

          genreContainer.querySelectorAll(".filter-pill").forEach(p => {
            p.classList.toggle("active", p.dataset.genre === currentGenre);
          });

          applyFilters();
        });
      });
    }

    if (clearActiveTagBtn) {
      clearActiveTagBtn.onclick = (e) => {
        e.preventDefault();
        currentGenre = "All";
        this.selectedCategory = "All";
        genreContainer?.querySelectorAll(".filter-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.genre === "All");
        });
        applyFilters();
      };
    }

    if (resetFiltersBtn) {
      resetFiltersBtn.onclick = (e) => {
        e.preventDefault();
        currentGenre = "All";
        currentType = "All";
        currentSort = "popularity";
        this.selectedCategory = "All";
        this.selectedType = "All";
        if (filterTypeSelect) filterTypeSelect.value = "All";
        if (sortSelect) sortSelect.value = "popularity";
        genreContainer?.querySelectorAll(".filter-pill").forEach(p => {
          p.classList.toggle("active", p.dataset.genre === "All");
        });
        applyFilters();
      };
    }

    filterTypeSelect?.addEventListener("change", (e) => {
      currentType = e.target.value;
      this.selectedType = currentType;
      applyFilters();
    });

    sortSelect?.addEventListener("change", (e) => {
      currentSort = e.target.value;
      applyFilters();
    });

    // Initial render & sync indicator
    applyFilters();
  }

  // --------------------------------------------------------------------------
  // Global Event Delegation
  // --------------------------------------------------------------------------
  initGlobalDelegation() {
    document.body.addEventListener("click", (e) => {
      // 0. Back button clicked on Anime Details page -> Return directly to browse/home where user left off
      const backBtn = e.target.closest("#anime-detail-back-btn, .btn-detail-back");
      if (backBtn) {
        e.preventDefault();
        e.stopPropagation();
        const lastPage = sessionStorage.getItem("shinobi_last_browse_page") || "#home";
        sessionStorage.setItem("shinobi_restore_scroll", "1");
        window.location.hash = lastPage;
        return;
      }

      // 0b. Back button or All Episodes clicked on Episode Download / Stream page -> Return to anime details without trapping history
      const dlBackLink = e.target.closest(".dl-back-link, .btn-ep-nav-all");
      if (dlBackLink) {
        e.preventDefault();
        e.stopPropagation();
        const targetHref = dlBackLink.getAttribute("href") || "#home";
        window.location.replace(targetHref);
        return;
      }

      // 0c. Nav links clicked in site header -> Clear saved browse scroll so page opens cleanly at top
      const navLink = e.target.closest(".site-header .nav-link, .mobile-nav-link, .nav-logo");
      if (navLink) {
        sessionStorage.removeItem("shinobi_last_browse_scroll");
        sessionStorage.removeItem("shinobi_restore_scroll");
      }

      // 1. Anime Card clicked -> ALWAYS navigate to anime episode details page
      const animeCard = e.target.closest(".anime-card");
      if (animeCard && !e.target.closest(".watchlist-toggle-btn")) {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem("shinobi_last_browse_scroll", window.scrollY.toString());
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
        sessionStorage.setItem("shinobi_last_browse_scroll", window.scrollY.toString());
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
        sessionStorage.setItem("shinobi_last_browse_scroll", window.scrollY.toString());
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
        const ep = parseInt(playBtn.dataset.ep || "1", 10);
        const season = parseInt(playBtn.dataset.season || "1", 10);
        const mode = playBtn.dataset.mode || "download";
        const lang = playBtn.dataset.lang || "hindi";
        // Record this click in Continue Watching history
        StorageService.recordEpisodeClick(animeId, ep, season);
        sessionStorage.setItem(`shinobi_last_season_${animeId}`, season);
        sessionStorage.setItem(`shinobi_last_ep_${animeId}`, ep);
        window.location.hash = `#stream/${animeId}/${ep}?s=${season}&mode=${mode}&lang=${lang}`;
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
        sessionStorage.setItem("shinobi_last_browse_scroll", window.scrollY.toString());
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

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && shortcutsModal?.classList.contains("active")) {
        shortcutsModal.classList.remove("active");
      }
    });
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.kingApp = new App();
});
