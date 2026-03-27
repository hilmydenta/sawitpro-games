import { useState } from "react";
import logo from "@/assets/logo-sawitpro.png";
import mascot from "@/assets/sibrondol-pointing-up.png";
import gamePanen from "@/assets/game-panen-sawit.jpg";
import gameTanam from "@/assets/game-tanam-sawit.jpg";
import gameDunia from "@/assets/game-dunia-sawit.jpg";
import GameCard from "@/components/GameCard";

const games = [
  {
    title: "🌴 Panen Sawit",
    description: "Raih Skor Tertinggi!",
    image: gamePanen,
    url: "https://69b8bcc2fc02d3717fd55a71.demo.playabl.ai",
  },
  {
    title: "🌱 Tanam Sawit",
    description: "Rawat Pohonmu hingga Panen dan dapatkan SawitPoin",
    image: gameTanam,
    url: "https://tanam-sawit-game.replit.app/tanam-sawit-web/",
  },
  {
    title: "🌍 Dunia Sawit",
    description: "Jelajahi Dunia Sawit, selesaikan Aktivitas dan dapatkan SawitPoin",
    image: gameDunia,
    url: null,
    comingSoon: true,
  },
];

const Index = () => {
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);

  if (activeGameUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="bg-primary px-4 py-2 flex items-center gap-3">
          <button
            onClick={() => setActiveGameUrl(null)}
            className="text-primary-foreground font-heading font-bold text-sm bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1.5 rounded-full transition-colors"
          >
            ✕ Kembali
          </button>
        </div>
        <iframe
          src={activeGameUrl}
          className="flex-1 w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary py-4 px-4">
        <div className="container flex items-center gap-3">
          <img src={logo} alt="SawitPRO Logo" className="w-12 h-12 rounded-full" />
          <div>
            <h1 className="font-heading font-black text-xl text-primary-foreground leading-tight">
              SawitPRO Games
            </h1>
            <p className="text-sm text-primary-foreground/80">Main & Menang! 🎮</p>
          </div>
        </div>
      </header>

      {/* Mascot Banner */}
      <div className="container py-4 flex items-center gap-3">
        <img
          src={mascot}
          alt="SiBrondol Mascot"
          className="w-20 h-20 object-contain animate-bounce-gentle flex-shrink-0"
        />
        <div className="bg-card rounded-lg p-3 game-card-shadow relative">
          <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-card" />
          <p className="font-heading font-bold text-sm text-foreground">
            Hai! Aku SiBrondol 👋 Yuk mainkan game seru dari SawitPRO!
          </p>
        </div>
      </div>

      {/* Game Cards */}
      <main className="container pb-8 space-y-4">
        {games.map((game) => (
          <GameCard key={game.title} {...game} onSelect={setActiveGameUrl} />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-primary py-3 text-center">
        <p className="text-xs text-primary-foreground/70">© 2026 SawitPRO. Semua hak dilindungi.</p>
      </footer>
    </div>
  );
};

export default Index;
