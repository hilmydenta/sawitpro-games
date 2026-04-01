import { apps } from "@/data/apps";

const Footer = () => {
  return (
    <footer className="py-10 pb-24 px-4 border-t" style={{ background: "#060f08", borderTopColor: "rgba(82,183,136,0.1)" }}>
      <div className="max-w-[780px] mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">🌴</span>
          <span className="font-heading font-bold text-lg text-foreground">Kawan Sawit</span>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Bagian dari ekosistem{" "}
          <a href="https://sawitpro.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
            SawitPRO
          </a>{" "}
          — Platform Agritech Kelapa Sawit Indonesia
        </p>

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
          <a
            href="https://toko.sawitpro.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary font-semibold hover:underline"
          >
            Toko Sawit
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">© 2025 SawitPRO · All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
