import { apps } from "@/data/apps";
import { useInView } from "@/hooks/useInView";

const AppEcosystem = () => {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-16 px-4" style={{ background: "#0d2018" }}>
      <div className="max-w-[780px] mx-auto">
        <p className="text-center text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          Ekosistem SawitPRO
        </p>
        <h2 className="text-center font-heading font-bold text-[30px] text-foreground mb-10">
          Games akan segera tersedia di semua aplikasi SawitPRO
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {apps.map((app, i) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 flex-1 min-w-[190px] max-w-[220px] p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl">{app.icon}</span>
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
