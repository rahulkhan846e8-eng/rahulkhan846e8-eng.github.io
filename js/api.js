/**
 * KING STORE LIVE ANIME API SERVICE (Jikan v4 / MyAnimeList & AniList)
 * Fetches 25,000+ official anime with real posters, metadata, and episode lists
 */

const JIKAN_BASE = "https://api.jikan.moe/v4";
const CACHE_PREFIX = "king_api_cache_";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

// Genre ID mapping for MyAnimeList / Jikan v4
export const GENRE_MAP = {
  "Action & Adventure": [1, 2],
  "Comedy": [4],
  "Romance": [22],
  "Slice-of-Life": [36],
  "Fantasy & Sci-Fi": [10, 24],
  "Horror & Mystery": [14, 7],
  "Isekai": [62],
  "Mecha": [18],
  "Mahou Shoujo (Magical Girl)": [66],
  "Iyashikei": [63],
  "Harem": [35]
};

// Sample video streams for instant playback
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

class AnimeApiService {
  constructor() {
    this.memoryCache = new Map();
  }

  // --------------------------------------------------------------------------
  // Cache Management
  // --------------------------------------------------------------------------
  getFromCache(key) {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    try {
      const stored = localStorage.getItem(CACHE_PREFIX + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          this.memoryCache.set(key, parsed.data);
          return parsed.data;
        }
      }
    } catch {}
    return null;
  }

  setCache(key, data) {
    this.memoryCache.set(key, data);
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch {}
  }

  // --------------------------------------------------------------------------
  // Normalized Anime Data Transformer
  // --------------------------------------------------------------------------
  transformJikanAnime(item, fallbackIndex = 0) {
    if (!item) return null;
    const year = item.year || (item.aired?.from ? new Date(item.aired.from).getFullYear()) : 2024;
    const genres = (item.genres || []).map(g => g.name);
    
    // Audio badge generator (Multi-Audio, Hindi Dub, SUB/DUB)
    const audioTags = ["Multi-Audio", "Hindi Dub", "SUB / DUB", "Japanese / English"];
    const audioBadge = audioTags[fallbackIndex % audioTags.length];

    // Banner image resolution
    const poster = item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.jpg?.image_url;
    const banner = item.trailer?.images?.maximum_image_url || item.trailer?.images?.large_image_url || poster;

    const totalEps = item.episodes || 12;

    return {
      id: `mal-${item.mal_id}`,
      mal_id: item.mal_id,
      title: item.title_english || item.title || "Anime Title",
      originalTitle: item.title,
      japaneseTitle: item.title_japanese || item.title,
      poster: poster,
      banner: banner,
      rating: item.score || 8.5,
      year: year,
      type: item.type || "TV Series",
      status: item.status || "Finished",
      episodesCount: totalEps,
      currentEpBadge: `S1-EP${Math.min(totalEps, 12)}`,
      audioBadge: audioBadge,
      season: `${item.season ? item.season.toUpperCase() : ''} ${year}`.trim(),
      studio: item.studios?.[0]?.name || "Animation Studio",
      hasSub: true,
      hasDub: true,
      genres: genres.length > 0 ? genres : ["Action", "Adventure"],
      synopsis: item.synopsis || "No description available for this anime series.",
      episodes: this.generateDefaultEpisodes(item.mal_id, totalEps, poster)
    };
  }

  generateDefaultEpisodes(malId, count = 12, fallbackImg = "") {
    const total = Math.min(count || 12, 24);
    const eps = [];
    for (let i = 1; i <= total; i++) {
      eps.push({
        id: i,
        number: i,
        title: `Episode ${i}`,
        runtime: "24m",
        thumbnail: fallbackImg,
        synopsis: `Stream Episode ${i} in full HD with multiple audio tracks and subtitles.`,
        videoUrl: SAMPLE_VIDEOS[(i - 1) % SAMPLE_VIDEOS.length]
      });
    }
    return eps;
  }

  // --------------------------------------------------------------------------
  // API Fetchers
  // --------------------------------------------------------------------------
  async fetchTopTrending(limit = 15) {
    const cacheKey = `top_trending_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${JIKAN_BASE}/top/anime?filter=airing&limit=${limit}`);
      if (!res.ok) throw new Error("Jikan fetch failed");
      const json = await res.json();
      const list = (json.data || []).map((item, idx) => this.transformJikanAnime(item, idx)).filter(Boolean);
      this.setCache(cacheKey, list);
      return list;
    } catch (err) {
      console.warn("Jikan API top trending fetch failed, using fallback:", err);
      return [];
    }
  }

  async fetchPopularAnime(limit = 15) {
    const cacheKey = `popular_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${JIKAN_BASE}/top/anime?filter=bypopularity&limit=${limit}`);
      if (!res.ok) throw new Error("Jikan fetch failed");
      const json = await res.json();
      const list = (json.data || []).map((item, idx) => this.transformJikanAnime(item, idx + 2)).filter(Boolean);
      this.setCache(cacheKey, list);
      return list;
    } catch (err) {
      console.warn("Jikan API popular fetch failed, using fallback:", err);
      return [];
    }
  }

  async fetchAnimeByGenre(genreName, limit = 15) {
    const genreIds = GENRE_MAP[genreName] || [1];
    const cacheKey = `genre_${genreIds.join('_')}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${JIKAN_BASE}/anime?genres=${genreIds.join(',')}&order_by=score&sort=desc&limit=${limit}`);
      if (!res.ok) throw new Error("Jikan fetch failed");
      const json = await res.json();
      const list = (json.data || []).map((item, idx) => this.transformJikanAnime(item, idx + 1)).filter(Boolean);
      this.setCache(cacheKey, list);
      return list;
    } catch (err) {
      console.warn(`Jikan API genre fetch failed for ${genreName}:`, err);
      return [];
    }
  }

  async searchAnime(query = "", genre = "All", type = "All", sort = "popularity", limit = 24) {
    const cacheKey = `search_${query}_${genre}_${type}_${sort}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      let url = `${JIKAN_BASE}/anime?limit=${limit}&sfw=true`;
      if (query && query.trim()) {
        url += `&q=${encodeURIComponent(query.trim())}`;
      }
      if (genre && genre !== "All" && GENRE_MAP[genre]) {
        url += `&genres=${GENRE_MAP[genre].join(',')}`;
      }
      if (type && type !== "All") {
        url += `&type=${type.toLowerCase()}`;
      }
      if (sort === "rating") {
        url += `&order_by=score&sort=desc`;
      } else if (sort === "newest") {
        url += `&order_by=start_date&sort=desc`;
      } else {
        url += `&order_by=popularity&sort=asc`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Jikan search failed");
      const json = await res.json();
      const list = (json.data || []).map((item, idx) => this.transformJikanAnime(item, idx)).filter(Boolean);
      this.setCache(cacheKey, list);
      return list;
    } catch (err) {
      console.warn("Jikan API search failed:", err);
      return [];
    }
  }

  async fetchAnimeDetails(malId) {
    const cacheKey = `anime_detail_${malId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${JIKAN_BASE}/anime/${malId}/full`);
      if (!res.ok) throw new Error("Jikan details failed");
      const json = await res.json();
      const item = this.transformJikanAnime(json.data);

      // Fetch real episode list from Jikan
      const epRes = await fetch(`${JIKAN_BASE}/anime/${malId}/episodes`);
      if (epRes.ok) {
        const epJson = await epRes.json();
        if (epJson.data && epJson.data.length > 0) {
          item.episodes = epJson.data.map((ep, idx) => ({
            id: ep.mal_id || idx + 1,
            number: ep.mal_id || idx + 1,
            title: ep.title || ep.title_romanji || `Episode ${idx + 1}`,
            japaneseTitle: ep.title_japanese || "",
            runtime: "24m",
            thumbnail: item.poster,
            aired: ep.aired ? new Date(ep.aired).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
            synopsis: ep.synopsis || `Episode ${idx + 1} of ${item.title}. Available with multiple audio tracks.`,
            videoUrl: SAMPLE_VIDEOS[idx % SAMPLE_VIDEOS.length]
          }));
        }
      }

      this.setCache(cacheKey, item);
      return item;
    } catch (err) {
      console.warn("Jikan details fetch failed:", err);
      return null;
    }
  }
}

export const AnimeApi = new AnimeApiService();
