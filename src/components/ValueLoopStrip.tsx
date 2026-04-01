import { useInView } from "@/hooks/useInView";

const steps = [
  { icon: "🎮", title: "Main Game", subtitle: "Tanam, Panen, atau Bubble" },
  { icon: "⭐", title: "Kumpulkan SawitPoin", subtitle: "Hingga 50 Poin/bulan" },
  { icon: "🛒", title: "Belanja di Toko Sawit", subtitle: "1 Poin = Rp 1.000" },
];

const ValueLoopStrip = () => {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="py-12 px-4"
      style={{ background: "linear-gradient(135deg, #1a3c2a 0%, #0f2118 100%)" }}
    >
      <div className="max-w-[780px] mx-auto">
        <p className="text-center text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary mb-8">
          Cara Kerja SawitPoin
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 mb-8">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-center gap-3 sm:gap-3">
              <div
                className={`flex flex-col items-center text-center p-4 rounded-xl border border-primary/20 bg-primary/5 min-w-[160px] transition-all duration-500 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="text-3xl mb-2">{step.icon}</span>
                <span className="font-heading font-bold text-sm text-foreground">{step.title}</span>
                <span className="text-xs text-primary mt-1">{step.subtitle}</span>
              </div>
              {i < steps.length - 1 && (
                <span className="text-primary text-xl hidden sm:block">→</span>
              )}
            </div>
          ))}
        </div>

        <div
          className={`rounded-lg px-4 py-3 text-center text-sm font-body font-medium border border-secondary/20 bg-secondary/10 text-secondary transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          💰 1 SawitPoin = Rp 1.000 · Maks 50 Poin/bulan · Langsung bisa dipakai di Toko Sawit
        </div>
      </div>
    </section>
  );
};

export default ValueLoopStrip;
