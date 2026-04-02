import { useEffect } from "react";
import { apps } from "@/data/apps";
import { useInView } from "@/hooks/useInView";
import { trackEvent } from "@/lib/tracker";

const AppEcosystem = () => {
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (isInView) trackEvent("section_view", { section: "app_ecosystem" });
  }, [isInView]);

  return (
    <section ref={ref} className="py-10 px-4" style={{ background: "#0d2018" }}>
      <div className="max-w-[780px] mx-auto">
        <p className="text-center text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          Ekosistem SawitPRO
        </p>
        <h2 className="text-center font-heading font-bold text-[30px] text-foreground mb-6">
          Games akan segera tersedia di semua aplikasi SawitPRO
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {apps.map((app, i) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("app_card_click", { app_name: app.name })}
              className={`flex items-center gap-3 flex-1 min-w-[190px] max-w-[220px] p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg object-cover" loading="lazy" />
              <div>
                <div className="font-heading font-bold text-sm text-foreground">{app.name}</div>
                <div className="text-xs text-muted-foreground">{app.role}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppEcosystem;
