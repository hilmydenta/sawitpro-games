import { apps } from "@/data/apps";
import { trackEvent } from "@/lib/tracker";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

interface FooterProps {
  onOpenTokoSawit?: () => void;
}

const Footer = ({ onOpenTokoSawit }: FooterProps) => {
  return (
    <footer className="py-8 pb-20 px-4 border-t" style={{ background: "#060f08", borderTopColor: "rgba(82,183,136,0.1)" }}>
      <div className="max-w-[780px] mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/images/sawitpro-logo.png" alt="SawitPRO" className="h-8 w-auto" />
          <span className="font-heading font-bold text-lg text-foreground">Sawit Games</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Bagian dari ekosistem{" "}
          <a href="https://sawitpro.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
            SawitPRO
          </a>{" "}
          <span className="text-primary font-semibold">#TerusTumbuh</span>
        </p>

        {/* Social icons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="https://www.tiktok.com/@sawitpro.id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("social_click", { platform: "tiktok" })}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          <a
            href="https://www.instagram.com/sawitpro.id/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("social_click", { platform: "instagram" })}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm mb-6">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {app.name}
            </a>
          ))}
          <span className="text-muted-foreground/30">·</span>
          <button
            onClick={() => {
              trackEvent("toko_sawit_open", { source: "footer" });
              onOpenTokoSawit?.();
            }}
            className="text-secondary font-semibold hover:underline"
          >
            Toko Sawit
          </button>
        </div>

        {/* SiBrondol standard */}
        <div className="flex justify-center mb-4">
          <img src="/images/sibrondol-standard.png" alt="SiBrondol" className="w-16 h-auto opacity-70" />
        </div>

        <p className="text-xs text-muted-foreground/60">© 2025 SawitPRO · All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
