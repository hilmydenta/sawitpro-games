interface GameCardProps {
  title: string;
  description: string;
  image: string;
  url: string | null;
  comingSoon?: boolean;
  onSelect?: (url: string) => void;
}

const GameCard = ({ title, description, image, url, comingSoon, onSelect }: GameCardProps) => {
  const handleClick = () => {
    if (url && onSelect) onSelect(url);
  };

  return (
    <button
      onClick={handleClick}
      disabled={comingSoon && !url}
      className={`w-full text-left rounded-lg overflow-hidden bg-card game-card-shadow transition-all duration-300 ${
        comingSoon && !url ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      }`}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          width={768}
          height={512}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
          <span className="font-heading font-black text-2xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-center px-4">
            {title}
          </span>
        </div>
        {comingSoon && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="font-heading font-black text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Dalam Pengembangan
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-extrabold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 leading-snug">{description}</p>
      </div>
    </button>
  );
};

export default GameCard;
