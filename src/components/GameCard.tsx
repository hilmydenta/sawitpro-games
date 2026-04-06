import { useEffect, useState } from "react";
import type { GameData } from "@/data/games";

interface GameCardProps extends GameData {
  index: number;
  isInView: boolean;
  onSelect: (url: string) => void;
}

const GameCard = ({ title, icon, tagline, url, themeColor, accentColor, comingSoon, index, isInView, onSelect }: GameCardProps) => {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (index === 0 && isInView) {
      const timer = setTimeout(() => setShowPulse(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [index, isInView]);

  const handleClick = () => {
    if (!comingSoon) onSelect(url);
  };

  return (
    <div
      className={`group relative flex-1 min-w-[220px] max-w-[280px] rounded-xl border overflow-hidden transition-all duration-500 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${comingSoon ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${showPulse ? "animate-card-pulse" : ""}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        background: `linear-gradient(145deg, ${themeColor}33, ${themeColor}11)`,
        borderColor: `${themeColor}44`,
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (comingSoon) return;
        const el = e.currentTarget;
        el.style.background = `linear-gradient(145deg, ${themeColor}ee, ${themeColor}88)`;
        el.style.borderColor = accentColor;
        el.style.transform = "translateY(-6px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = `linear-gradient(145deg, ${themeColor}33, ${themeColor}11)`;
        el.style.borderColor = `${themeColor}44`;
        el.style.transform = "translateY(0)";
      }}
      role="button"
      tabIndex={comingSoon ? -1 : 0}
      onKeyDown={(e) => { if (e.key === "Enter" && !comingSoon) handleClick(); }}
    >
      <div className="p-4">
        {/* Icon + Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[28px] leading-none">{icon}</span>
          <h3 className="font-heading font-bold text-lg text-foreground">{title}</h3>
        </div>

        {/* Tagline */}
        <p className="text-[13px] font-bold font-body mb-3" style={{ color: accentColor }}>
          {tagline}
        </p>

        {/* CTA */}
        <button
          className="w-full py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: accentColor, color: "#0a1a10" }}
          disabled={comingSoon}
          tabIndex={-1}
        >
          {comingSoon ? "Segera Hadir" : `Main ${title}`}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
