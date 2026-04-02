import { useScrollPosition } from "@/hooks/useScrollPosition";
import { trackEvent } from "@/lib/tracker";

interface StickyBottomCTAProps {
  onOpenTokoSawit?: () => void;
}

const StickyBottomCTA = ({ onOpenTokoSawit }: StickyBottomCTAProps) => {
  const scrollY = useScrollPosition();
  const visible = scrollY > 300;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ background: "linear-gradient(to bottom, transparent, rgba(10,20,14,1) 30%)" }}
    >
      <div className="flex items-center gap-3 px-4 pt-6 pb-4">
        <a
          href="#games"
          onClick={() => trackEvent("cta_click", { cta: "sticky_main" })}
          className="flex-1 text-center py-3 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          🎮 Mulai Main
        </a>
        <button
          onClick={() => {
            trackEvent("cta_click", { cta: "sticky_toko" });
            onOpenTokoSawit?.();
          }}
          className="flex-1 text-center py-3 rounded-lg text-sm font-bold bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
        >
          🛒 Toko Sawit
        </button>
      </div>
    </div>
  );
};

export default StickyBottomCTA;
