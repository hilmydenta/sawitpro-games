import { useEffect, useState } from "react";
import type { GameData } from "@/data/games";

interface GameCardProps extends GameData {
  index: number;
  isInView: boolean;
  onSelect: (url: string) => void;
}

const GameCard = ({ title, icon, badge, poin, tagline, description, url, themeColor, accentColor, comingSoon, index, isInView, onSelect }: GameCardProps) => {
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
      className={`group relative flex-1 min-w-[280px] max-w-[340px] rounded-xl border overflow-hidden transition-all duration-500 ${
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
      <div className="p-5">
        {/* Top row: icon + badges */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-[44px] leading-none">{icon}</span>
          <span
            className="text-xs font-body font-bold px-2 py-1 rounded-full"
            style={{ background: `${accentColor}22`, color: accentColor }}
          >
            {poin}
          </span>
        </div>

        {/* Badge */}
        <span
          className="inline-block text-[11px] font-body font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
          style={{ background: `${themeColor}44`, color: accentColor }}
        >
          {badge}
        </span>

        {/* Title */}
        <h3 className="font-heading font-bold text-[22px] text-foreground mb-1">{title}</h3>

        {/* Tagline */}
        <p className="text-[13px] font-bold font-body mb-3" style={{ color: accentColor }}>
          {tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>

        {/* CTA */}
        <button
          className="w-full py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: accentColor, color: "#0a1a10" }}
          disabled={comingSoon}
          tabIndex={-1}
        >
          {comingSoon ? "Segera Hadir" : "Mainkan Sekarang →"}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
