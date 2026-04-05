export interface GameData {
  id: string;
  title: string;
  icon: string;
  badge: string;
  poin: string;
  tagline: string;
  description: string;
  url: string;
  themeColor: string;
  accentColor: string;
  comingSoon?: boolean;
}

export const games: GameData[] = [
  {
    id: "tanam_sawit",
    title: "Tanam Sawit",
    icon: "🌱",
    badge: "FARMING SIM",
    poin: "+15 Poin",
    tagline: "Tanam & rawat kebun virtualmu",
    description: "Simulasi menanam kelapa sawit dari bibit hingga panen. Pelajari teknik GAP sambil bermain.",
    url: "https://tanam-sawit-game.replit.app/tanam-sawit-web/",
    themeColor: "#2D6A4F",
    accentColor: "#52B788",
  },
  {
    id: "panen_sawit",
    title: "Panen Sawit",
    icon: "🍊",
    badge: "TIME ATTACK",
    poin: "+20 Poin",
    tagline: "Adu cepat panen brondolan",
    description: "Kumpulkan tandan buah segar sebanyak mungkin sebelum waktu habis. Makin mahir, makin banyak Poin!",
    url: "https://69b8bcc2fc02d3717fd55a71.demo.playabl.ai",
    themeColor: "#B5451B",
    accentColor: "#F4A261",
  },
  {
    id: "sawit-bubble",
    title: "Sawit Bubble",
    icon: "🫧",
    badge: "PUZZLE",
    poin: "+10 Poin",
    tagline: "Tembak & cocokkan gelembung sawit",
    description: "Bubble shooter dengan tema perkebunan sawit. Selesaikan 120 level dan kuasai pengetahuan GAP.",
    url: "https://sawitPRO-bubble-games.replit.app/",
    themeColor: "#1B4F72",
    accentColor: "#56CCF2",
  },
  {
    id: "dunia-sawit",
    title: "Dunia Sawit",
    icon: "🌍",
    badge: "ADVENTURE",
    poin: "+25 Poin",
    tagline: "Jelajahi dunia kelapa sawit",
    description: "Petualangan interaktif menjelajahi ekosistem perkebunan sawit. Pelajari rantai pasok dari hulu ke hilir.",
    url: "",
    themeColor: "#6B4226",
    accentColor: "#D4A574",
    comingSoon: true,
  },
];
