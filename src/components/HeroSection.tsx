import { useEffect, useState, useRef } from "react";
import { trackEvent } from "@/lib/tracker";

const LEAF_COUNT = 18;

function LeafParticles() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setShow(mq.matches);
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: LEAF_COUNT }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 12;
        const duration = 7 + Math.random() * 6;
        const opacity = 0.06 + Math.random() * 0.12;
        return (
          <span
            key={i}
            className="absolute text-lg"
            style={{
              left: `${left}%`,
              top: "-40px",
              animation: `leafFall ${duration}s linear ${delay}s infinite`,
              ["--leaf-opacity" as string]: opacity,
            }}
          >
            🌿
          </span>
        );
      })}
    </div>
  );
}

interface HeroSectionProps {
  onOpenTokoSawit?: () => void;
}

const HeroSection = ({ onOpenTokoSawit }: HeroSectionProps) => {
  return (
    <section
      className="relative overflow-hidden py-10 sm:py-16 px-4"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,106,79,0.35) 0%, transparent 70%), #0a1a10",
      }}
    >
      <LeafParticles />

      <div className="relative z-10 max-w-[720px] mx-auto text-center">
        {/* Pill badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulse-glow" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-sm font-body font-medium text-primary">LIVE · Sawit Games</span>
        </div>

        {/* H1 - two rows */}
        <h1
          className="animate-fade-up font-heading font-black leading-tight mb-5"
          style={{ fontSize: "clamp(36px, 7vw, 72px)", animationDelay: "100ms" }}
        >
          Main, Panen <em className="text-primary italic">&amp; Menang</em>
          <br />
          <span className="text-secondary">di Sawit Games</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-6 leading-relaxed"
          style={{ animationDelay: "200ms" }}
        >
          Mainkan kumpulan Sawit Games dan raih skor tertinggi.{" "}
          <strong className="text-primary">Segera Hadir</strong> — Kumpulkan{" "}
          <strong className="text-primary">SawitPoin</strong> dari setiap permainan dan tukarkan langsung
          dengan kebutuhan kebun di <strong className="text-secondary">Toko Sawit</strong>!
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3 mb-4" style={{ animationDelay: "300ms" }}>
          <a
            href="#games"
            onClick={() => trackEvent("cta_click", { cta: "hero_main" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            🎮 Mulai Main Sekarang
          </a>
          <button
            onClick={() => {
              trackEvent("cta_click", { cta: "hero_toko" });
              onOpenTokoSawit?.();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-bold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
          >
            🛒 Lihat Toko Sawit
          </button>
        </div>

        {/* SiBrondol - centered, visible on all screens */}
        <div className="animate-fade-up flex justify-center" style={{ animationDelay: "400ms" }}>
          <img
            src="/images/sibrondol-pointing.png"
            alt="SiBrondol"
            className="w-[100px] sm:w-[140px] lg:w-[180px] pointer-events-none animate-float opacity-90"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-6">
        <div
          className="w-px h-10 animate-scroll-line origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(82,183,136,0.6), transparent)" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
