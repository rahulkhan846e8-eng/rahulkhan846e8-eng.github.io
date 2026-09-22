/**
 * KING STORE ANIME DATA ENGINE
 * Curated anime catalog covering all official categories
 */

export const GENRE_LIST = [
  "All",
  "Action & Adventure",
  "Comedy",
  "Romance",
  "Slice-of-Life",
  "Fantasy & Sci-Fi",
  "Horror & Mystery",
  "Isekai",
  "Mecha",
  "Mahou Shoujo (Magical Girl)",
  "Iyashikei",
  "Harem"
];

export const ANIME_DATABASE = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    japaneseTitle: "俺だけレベルアップな件 (Ore dake Level Up na Ken)",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    rating: 8.9,
    contentRating: "16+",
    status: "Airing",
    type: "TV",
    season: "Winter 2024",
    studio: "A-1 Pictures",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Action & Adventure", "Fantasy & Sci-Fi"],
    synopsis: "In a world where hunters battle deadly monsters to protect humanity, Sung Jinwoo, the weakest hunter in the world, receives a mysterious quest log that allows him to level up without limits.",
    introStart: 90,
    introEnd: 180,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "I'm Used to It",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
        synopsis: "Jinwoo and his raid party enter a perilous hidden sanctuary within a D-rank dungeon.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      },
      {
        id: 2,
        number: 2,
        title: "If I Had One More Chance",
        runtime: "23m",
        thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
        synopsis: "Faced with deadly statues, Jinwoo solves the ancient commandments to protect his allies.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      }
    ],
    cast: [
      { name: "Sung Jinwoo", role: "Shadow Monarch", va: "Taito Ban (JP) / Aleks Le (EN)", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80" },
      { name: "Cha Hae-In", role: "S-Rank Hunter", va: "Reina Ueda (JP)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "mushoku-tensei",
    title: "Mushoku Tensei: Jobless Reincarnation",
    japaneseTitle: "無職転生 ～異世界行ったら本気だす～",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    rating: 8.8,
    contentRating: "18+",
    status: "Airing",
    type: "TV",
    season: "Spring 2024",
    studio: "Studio Bind",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Isekai", "Fantasy & Sci-Fi", "Action & Adventure", "Harem"],
    synopsis: "When a 34-year-old underachiever is reincarnated into a wondrous sword-and-sorcery world as Rudeus Greyrat, he resolves to master magic and live his new life to the absolute fullest.",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "The Jobless Reincarnation",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        synopsis: "Rudeus begins learning incantation-less magic under the tutelage of Roxy Migurdia.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      }
    ],
    cast: [
      { name: "Rudeus Greyrat", role: "Mage Prodigy", va: "Yumi Uchiyama (JP)", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
      { name: "Roxy Migurdia", role: "Water Mage", va: "Konomi Kohara (JP)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "gundam-witch",
    title: "Mobile Suit Gundam: Witch from Mercury",
    japaneseTitle: "機動戦士ガンダム 水星の魔女",
    banner: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=600&q=80",
    rating: 8.7,
    contentRating: "13+",
    status: "Completed",
    type: "TV",
    season: "Fall 2022",
    studio: "Sunrise",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Mecha", "Fantasy & Sci-Fi", "Action & Adventure"],
    synopsis: "In an era when numerous corporations have entered space and built a massive economic system, a lone girl from the remote planet Mercury transfers to the Asticassia School of Technology piloting the Gundam Aerial.",
    introStart: 75,
    introEnd: 165,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "The Witch and the Bride",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
        synopsis: "Suletta Mercury engages in a high-stakes mobile suit duel to defend Miorine Rembran.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      }
    ],
    cast: [
      { name: "Suletta Mercury", role: "Pilot of Aerial", va: "Kana Ichinose (JP)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "madoka-magica",
    title: "Puella Magi Madoka Magica",
    japaneseTitle: "魔法少女まどか☆マギカ",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    rating: 8.9,
    contentRating: "16+",
    status: "Completed",
    type: "TV",
    season: "Winter 2011",
    studio: "Shaft",
    hasSub: true,
    hasDub: true,
    isTrending: false,
    isPopular: true,
    genres: ["Mahou Shoujo (Magical Girl)", "Horror & Mystery", "Fantasy & Sci-Fi"],
    synopsis: "Madoka Kaname is an ordinary 14-year-old girl whose life transforms when she meets Kyubey, a cat-like magical creature offering to grant any wish in exchange for becoming a magical girl.",
    introStart: 60,
    introEnd: 150,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "I First Met Her in a Dream",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
        synopsis: "Madoka encounters a transfer student named Homura Akemi who warns her about destiny.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ],
    cast: [
      { name: "Madoka Kaname", role: "Magical Girl", va: "Aoi Yuki (JP)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "yuru-camp",
    title: "Laid-Back Camp (Yuru Camp)",
    japaneseTitle: "ゆるキャン△",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    rating: 8.6,
    contentRating: "All",
    status: "Completed",
    type: "TV",
    season: "Winter 2018",
    studio: "C-Station",
    hasSub: true,
    hasDub: true,
    isTrending: false,
    isPopular: true,
    genres: ["Iyashikei", "Slice-of-Life", "Comedy"],
    synopsis: "Rin Shima loves camping by herself along the lakes that provide scenic views of Mt. Fuji. Her peaceful solo camping trips take a lively turn when she meets Nadeshiko Kagamihara.",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "Mt. Fuji and Curry Noodles",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        synopsis: "Rin helps stranded Nadeshiko share a warm bowl of noodles under the stars at Lake Motosu.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      }
    ],
    cast: [
      { name: "Rin Shima", role: "Solo Camper", va: "Nao Toyama (JP)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "kaguya-sama",
    title: "Kaguya-sama: Love Is War",
    japaneseTitle: "かぐや様は告らせたい",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    rating: 8.9,
    contentRating: "13+",
    status: "Completed",
    type: "TV",
    season: "Spring 2020",
    studio: "A-1 Pictures",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Romance", "Comedy", "Slice-of-Life"],
    synopsis: "Two elite high school student council geniuses are too proud to confess their feelings for each other, turning love into a strategic mental warfare where whoever confesses first loses!",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "I Want to Make You Invite Me",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
        synopsis: "Kaguya and Miyuki engage in a battle of wits over movie tickets.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      }
    ],
    cast: [
      { name: "Kaguya Shinomiya", role: "Vice President", va: "Aoi Koga (JP)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "quintuplets",
    title: "The Quintessential Quintuplets",
    japaneseTitle: "五等分の花嫁 (Gotoubun no Hanayome)",
    banner: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    rating: 8.4,
    contentRating: "13+",
    status: "Completed",
    type: "TV",
    season: "Winter 2019",
    studio: "Tezuka Productions",
    hasSub: true,
    hasDub: true,
    isTrending: false,
    isPopular: true,
    genres: ["Harem", "Romance", "Comedy", "Slice-of-Life"],
    synopsis: "A brilliant high school student is hired as a well-paid private tutor for five identical quintuplet sisters, each with distinct charming personalities and terrible grades.",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "The Quintessential Quintuplets",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
        synopsis: "Futaro Uesugi meets the Nakano sisters and tries to convince them to study.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      }
    ],
    cast: [
      { name: "Miku Nakano", role: "Third Sister", va: "Miku Ito (JP)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン (Sousou no Frieren)",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    rating: 9.3,
    contentRating: "13+",
    status: "Completed",
    type: "TV",
    season: "Fall 2023",
    studio: "Madhouse",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Fantasy & Sci-Fi", "Action & Adventure", "Slice-of-Life", "Iyashikei"],
    synopsis: "After defeating the Demon King, elven mage Frieren embarks on a poignant journey to understand human emotions and the preciousness of fleeting mortal moments.",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "The Journey's End",
        runtime: "26m",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
        synopsis: "The Hero's Party rejoices after their 10-year conquest of the Demon King.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
      }
    ],
    cast: [
      { name: "Frieren", role: "Mage", va: "Atsumi Tanezaki (JP)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japaneseTitle: "鬼滅の刃 (Hashira Training Arc)",
    banner: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=600&q=80",
    rating: 9.1,
    contentRating: "16+",
    status: "Completed",
    type: "TV",
    season: "Spring 2024",
    studio: "ufotable",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Action & Adventure", "Fantasy & Sci-Fi", "Horror & Mystery"],
    synopsis: "Tanjiro Kamado embarks on a relentless path as a demon slayer after his family is slaughtered, training with the Hashira to defeat Kibutsuji Muzan.",
    introStart: 60,
    introEnd: 150,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "Cruelty",
        runtime: "25m",
        thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
        synopsis: "Tanjiro resolves to save Nezuko after returning home to a tragedy.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      }
    ],
    cast: [
      { name: "Tanjiro Kamado", role: "Demon Slayer", va: "Natsuki Hanae (JP)", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦 (Shibuya Incident)",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    rating: 9.0,
    contentRating: "16+",
    status: "Airing",
    type: "TV",
    season: "Fall 2023",
    studio: "MAPPA",
    hasSub: true,
    hasDub: true,
    isTrending: true,
    isPopular: true,
    genres: ["Action & Adventure", "Fantasy & Sci-Fi", "Horror & Mystery"],
    synopsis: "Yuji Itadori swallows the cursed finger of the demon Ryomen Sukuna and enters Tokyo Jujutsu High to exorcise catastrophic curses.",
    introStart: 75,
    introEnd: 165,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "Ryomen Sukuna",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
        synopsis: "Yuji swallows a special grade cursed object to defend his friends.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ],
    cast: [
      { name: "Satoru Gojo", role: "Special Grade Sorcerer", va: "Yuichi Nakamura (JP)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "death-note",
    title: "Death Note",
    japaneseTitle: "デスノート",
    banner: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    rating: 9.0,
    contentRating: "16+",
    status: "Completed",
    type: "TV",
    season: "Fall 2006",
    studio: "Madhouse",
    hasSub: true,
    hasDub: true,
    isTrending: false,
    isPopular: true,
    genres: ["Horror & Mystery"],
    synopsis: "An intelligent student goes on a secret crusade to eliminate criminals using a lethal notebook dropped by the Shinigami Ryuk.",
    introStart: 60,
    introEnd: 150,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "Rebirth",
        runtime: "23m",
        thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
        synopsis: "Light Yagami tests the supernatural power of the Death Note.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      }
    ],
    cast: [
      { name: "Light Yagami", role: "Kira", va: "Mamoru Miyano (JP)", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ]
  },
  {
    id: "spy-x-family",
    title: "SPY x FAMILY",
    japaneseTitle: "スパイファミリー",
    banner: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    rating: 8.6,
    contentRating: "13+",
    status: "Completed",
    type: "TV",
    season: "Spring 2022",
    studio: "WIT Studio / CloverWorks",
    hasSub: true,
    hasDub: true,
    isTrending: false,
    isPopular: true,
    genres: ["Comedy", "Action & Adventure", "Slice-of-Life", "Romance"],
    synopsis: "A spy creates a mock family with an assassin wife and telepathic daughter, each hiding their true identities.",
    introStart: 70,
    introEnd: 160,
    episodes: [
      {
        id: 1,
        number: 1,
        title: "Operation Strix",
        runtime: "24m",
        thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
        synopsis: "Agent Twilight adopts Anya for his top-secret espionage assignment.",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      }
    ],
    cast: [
      { name: "Anya Forger", role: "Telepath", va: "Atsumi Tanezaki (JP)", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" }
    ]
  }
];

/**
 * Filter anime by keyword, category, and format
 */
export async function searchAnime(query = "", genre = "All", type = "All", sortBy = "popularity") {
  let list = [...ANIME_DATABASE];

  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.japaneseTitle.toLowerCase().includes(q) ||
      item.genres.some(g => g.toLowerCase().includes(q))
    );
  }

  if (genre && genre !== "All") {
    list = list.filter(item => item.genres.includes(genre));
  }

  if (type && type !== "All") {
    list = list.filter(item => item.type.toLowerCase() === type.toLowerCase());
  }

  if (sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "newest") {
    list.sort((a, b) => b.id.localeCompare(a.id));
  } else {
    list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  }

  return list;
}

export function getAnimeById(id) {
  return ANIME_DATABASE.find(item => item.id === id);
}

export function getTrendingAnime() {
  return ANIME_DATABASE.filter(item => item.isTrending);
}

export function getPopularAnime() {
  return ANIME_DATABASE.filter(item => item.isPopular);
}

export function getActionAnime() {
  return ANIME_DATABASE.filter(item => item.genres.some(g => g.includes("Action") || g.includes("Isekai")));
}

export function getTopRatedAnime() {
  return [...ANIME_DATABASE].sort((a, b) => b.rating - a.rating).slice(0, 10);
}
