import { useState, useEffect, useRef } from "react";
import { trackPageVisit, trackGameStart, trackGameEnd, trackEvent } from "@/lib/tracker";
import { games } from "@/data/games";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueLoopStrip from "@/components/ValueLoopStrip";
import GamesSection from "@/components/GamesSection";
import AppEcosystem from "@/components/AppEcosystem";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";

const Index = () => {
  const [activeGameUrl, setActiveGameUrl] = useState<string | null>(null);
  const [tokoSawitOpen, setTokoSawitOpen] = useState(false);
  const [tokoOpenTime, setTokoOpenTime] = useState<number>(0);
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

  const handleOpenTokoSawit = () => {
    setTokoOpenTime(Date.now());
    trackEvent("toko_sawit_open");
    setTokoSawitOpen(true);
  };

  const handleCloseTokoSawit = () => {
    const durationSeconds = Math.round((Date.now() - tokoOpenTime) / 1000);
    trackEvent("toko_sawit_close", { duration_seconds: durationSeconds });
    setTokoSawitOpen(false);
  };

  // Toko Sawit iframe overlay
  if (tokoSawitOpen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a1a10" }}>
        <div className="px-4 py-2 flex items-center gap-3" style={{ background: "rgba(10,26,16,0.95)" }}>
          <button
            onClick={handleCloseTokoSawit}
            className="text-primary font-body font-bold text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1.5 rounded-full transition-colors"
          >
            ✕ Kembali
          </button>
          <span className="text-sm text-muted-foreground">Toko Sawit</span>
        </div>
        <iframe
          src="https://toko.sawitpro.id"
          className="flex-1 w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation"
          allowFullScreen
        />
      </div>
    );
  }

  // Game iframe overlay
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
      <Navbar onOpenTokoSawit={handleOpenTokoSawit} />
      <HeroSection onOpenTokoSawit={handleOpenTokoSawit} />
      <ValueLoopStrip />
      <GamesSection onSelectGame={handleGameSelect} />
      <AppEcosystem />
      <Footer />
      <StickyBottomCTA onOpenTokoSawit={handleOpenTokoSawit} />
    </div>
  );
};

export default Index;
