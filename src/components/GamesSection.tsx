import { games } from "@/data/games";
import GameCard from "@/components/GameCard";
import { useInView } from "@/hooks/useInView";

interface GamesSectionProps {
  onSelectGame: (url: string) => void;
}

const GamesSection = ({ onSelectGame }: GamesSectionProps) => {
  const { ref, isInView } = useInView();

  return (
    <section id="games" ref={ref} className="py-16 px-4" style={{ background: "#0a1a10" }}>
      <div className="max-w-[780px] mx-auto">
        <p className="text-center text-[11px] font-body font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          Kawan Sawit — Game Suite
        </p>
        <h2 className="text-center font-heading font-bold text-[34px] text-foreground mb-3">
          Pilih Gamenya, Kumpulkan Poin
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10 max-w-lg mx-auto">
          Setiap game berisi tips GAP yang bisa langsung kamu terapkan di kebun.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          {games.map((game, i) => (
            <GameCard key={game.id} {...game} index={i} isInView={isInView} onSelect={onSelectGame} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
