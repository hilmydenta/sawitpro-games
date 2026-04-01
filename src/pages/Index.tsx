import { useState, useEffect, useRef } from "react";
import { trackPageVisit, trackGameStart, trackGameEnd } from "@/lib/tracker";
import { games } from "@/data/games";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueLoopStrip from "@/components/ValueLoopStrip";
import GamesSection from "@/components/GamesSection";
import AppEcosystem from "@/components/AppEcosystem";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";

const Index = () => {
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);
  const activeGameNameRef = useRef<string | null>(null);

  useEffect(() => {
    trackPageVisit();
  }, []);

  const getGameName = (url: string): string => {
    const game = games.find((g) => g.url === url);
    return game ? game.id : "unknown";
  };

  const handleGameSelect = (url: string) => {
    const gameName = getGameName(url);
    activeGameNameRef.current = gameName;
    trackGameStart(gameName);
    setActiveGameUrl(url);
  };

  const handleGameClose = () => {
    trackGameEnd();
    activeGameNameRef.current = null;
    setActiveGameUrl(null);
  };

  if (activeGameUrl) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a1a10" }}>
        <div className="px-4 py-2 flex items-center gap-3" style={{ background: "rgba(10,26,16,0.95)" }}>
          <button
            onClick={handleGameClose}
            className="text-primary font-body font-bold text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1.5 rounded-full transition-colors"
          >
            ✕ Kembali
          </button>
        </div>
        <iframe
          src={activeGameUrl}
          className="flex-1 w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a1a10" }}>
      <Navbar />
      <HeroSection />
      <ValueLoopStrip />
      <GamesSection onSelectGame={handleGameSelect} />
      <AppEcosystem />
      <Footer />
      <StickyBottomCTA />
    </div>
  );
};

export default Index;
