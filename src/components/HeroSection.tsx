import { useEffect, useState } from "react";

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

const HeroSection = () => {
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24 px-4"
      style={{
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,106,79,0.35) 0%, transparent 70%), #0a1a10",
      }}
    >
      <LeafParticles />

      <div className="relative z-10 max-w-[720px] mx-auto text-center">
        {/* Pill badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/25 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary animate-pulse-glow" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-sm font-body font-medium text-primary">LIVE · Games Petani Kelapa Sawit</span>
        </div>

        {/* H1 */}
        <h1
          className="animate-fade-up font-heading font-black leading-tight mb-5"
          style={{ fontSize: "clamp(36px, 7vw, 72px)", animationDelay: "100ms" }}
        >
          Main, Panen,{" "}
          <em className="text-primary italic">&amp; Menang</em>
          <br />
          <span className="text-secondary">Bersama Sawit!</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
          style={{ animationDelay: "200ms" }}
        >
          Kumpulkan <strong className="text-primary">SawitPoin</strong> dari setiap permainan dan tukarkan langsung
          dengan kebutuhan kebun di <strong className="text-secondary">Toko Sawit</strong>. Main sambil belajar
          Good Agricultural Practices!
        </p>

        {/* CTA buttons */}
        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-3 mb-10" style={{ animationDelay: "300ms" }}>
          <a
            href="#games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            🎮 Mulai Main Sekarang
          </a>
          <a
            href="https://toko.sawitpro.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-bold border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors"
          >
            🛒 Lihat Toko Sawit
          </a>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up flex items-center justify-center gap-8 sm:gap-12" style={{ animationDelay: "400ms" }}>
          {[
            { num: "3", label: "Games Seru" },
            { num: "120+", label: "Level Tersedia" },
            { num: "50", label: "Maks Poin/Bulan" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading font-black text-3xl text-primary">{s.num}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-12">
        <div
          className="w-px h-10 animate-scroll-line origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(82,183,136,0.6), transparent)" }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
