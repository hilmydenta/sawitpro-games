interface GameCardProps {
  title: string;
  description: string;
  image: string;
  url: string | null;
  comingSoon?: boolean;
}

const GameCard = ({ title, description, image, url, comingSoon }: GameCardProps) => {
  const handleClick = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      disabled={comingSoon}
      className={`w-full text-left rounded-lg overflow-hidden bg-card game-card-shadow transition-all duration-300 ${
        comingSoon ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
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
        {comingSoon && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="font-heading font-800 text-lg text-accent-foreground bg-accent px-4 py-1.5 rounded-full">
              Segera Hadir!
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
