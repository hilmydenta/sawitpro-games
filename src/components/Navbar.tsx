interface NavbarProps {
  onOpenTokoSawit?: () => void;
}

const Navbar = ({ onOpenTokoSawit }: NavbarProps) => {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(10,26,16,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottomColor: "rgba(82,183,136,0.15)",
      }}
    >
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <img src="/images/sawitpro-logo.png" alt="SawitPRO" className="h-7 w-auto" />
          <span className="font-heading font-bold text-lg text-foreground">Sawit Games</span>
          <span className="text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTokoSawit}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
          >
            🛒 Toko Sawit
          </button>
          <a
            href="https://sawitpro.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
