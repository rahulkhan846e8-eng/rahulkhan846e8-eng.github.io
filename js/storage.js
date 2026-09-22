/**
 * KING STORE LOCAL STORAGE & USER STATE ENGINE
 */

const STORAGE_KEYS = {
  WATCHLIST: "king_watchlist",
  HISTORY: "king_watch_history",
  USER_PROFILE: "king_user_profile",
  REVIEWS: "king_anime_reviews"
};

export const DEFAULT_AVATARS = [
  { id: "luffy", name: "Luffy", url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" },
  { id: "gojo", name: "Gojo", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { id: "nezuko", name: "Nezuko", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { id: "tanjiro", name: "Tanjiro", url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" },
  { id: "anya", name: "Anya", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" }
];

export class StorageService {
  // Watchlist (Queue)
  static getWatchlist() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static isInWatchlist(animeId) {
    const list = this.getWatchlist();
    return list.includes(animeId);
  }

  static toggleWatchlist(animeId) {
    let list = this.getWatchlist();
    const index = list.indexOf(animeId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.unshift(animeId);
      added = true;
    }
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("cr:watchlist-changed", { detail: { animeId, added, list } }));
    return added;
  }

  // Watch History & Progress Tracking
  static getWatchHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveProgress(animeId, episodeId, episodeNumber, currentTime, duration) {
    if (!duration || duration <= 0) return;
    const history = this.getWatchHistory();
    const percent = Math.min(100, Math.round((currentTime / duration) * 100));

    const existingIndex = history.findIndex(h => h.animeId === animeId);
    const item = {
      animeId,
      episodeId,
      episodeNumber,
      currentTime,
      duration,
      percent,
      updatedAt: Date.now()
    };

    if (existingIndex > -1) {
      history.splice(existingIndex, 1);
    }
    history.unshift(item);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 30)));
  }

  static getProgress(animeId, episodeId) {
    const history = this.getWatchHistory();
    return history.find(h => h.animeId === animeId && (episodeId ? h.episodeId === episodeId : true));
  }

  static clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    window.dispatchEvent(new CustomEvent("cr:history-cleared"));
  }

  // Record when a user actually clicks on an episode (for Continue Watching)
  static recordEpisodeClick(animeId, episodeNumber, seasonNumber = 1) {
    if (!animeId || !episodeNumber) return;
    const history = this.getWatchHistory();
    const epNum = parseInt(episodeNumber, 10);
    const sNum = parseInt(seasonNumber, 10) || 1;

    // Remove existing entry for this anime (we'll re-add at top)
    const filtered = history.filter(h => h.animeId !== animeId);

    const item = {
      animeId,
      seasonNumber: sNum,
      episodeId: epNum,
      episodeNumber: epNum,
      currentTime: 0,
      duration: 1440,
      percent: 0,
      updatedAt: Date.now()
    };

    filtered.unshift(item);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 30)));
    window.dispatchEvent(new CustomEvent("cr:history-changed"));
  }

  // User Profile
  static getUserProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : {
        name: "KingUser_01",
        avatar: DEFAULT_AVATARS[0].url,
        status: "King Store Member"
      };
    } catch {
      return {
        name: "KingUser_01",
        avatar: DEFAULT_AVATARS[0].url,
        status: "King Store Member"
      };
    }
  }

  static updateProfile(updates) {
    const profile = { ...this.getUserProfile(), ...updates };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("cr:profile-changed", { detail: profile }));
    return profile;
  }

  // Community Comments & Reviews
  static getReviews(animeId) {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "{}");
      if (all[animeId]) return all[animeId];
      
      return [
        {
          id: 1,
          userName: "GojoSensei_01",
          userAvatar: DEFAULT_AVATARS[1].url,
          rating: 5,
          date: "2 days ago",
          comment: "Absolute masterpiece! The animation quality and story are completely top-tier on King Store!"
        },
        {
          id: 2,
          userName: "SakuraBlossom",
          userAvatar: DEFAULT_AVATARS[2].url,
          rating: 5,
          date: "1 week ago",
          comment: "Binge watched the entire season in full HD. The player and audio are super smooth!"
        }
      ];
    } catch {
      return [];
    }
  }

  static addReview(animeId, rating, comment) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "{}");
    if (!all[animeId]) all[animeId] = this.getReviews(animeId);
    
    const profile = this.getUserProfile();
    const newRev = {
      id: Date.now(),
      userName: profile.name,
      userAvatar: profile.avatar,
      rating,
      date: "Just now",
      comment
    };

    all[animeId].unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    return newRev;
  }
}
