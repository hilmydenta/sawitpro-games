import { useEffect } from "react";

const REDIRECT_URL = "https://games.sawitpro.id";

const App = () => {
  useEffect(() => {
    window.location.replace(REDIRECT_URL);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-3">Kami sudah pindah</h1>
        <p className="text-muted-foreground mb-4">
          Sawit Games kini tersedia di alamat baru. Mengarahkan kamu ke{" "}
          <a href={REDIRECT_URL} className="text-primary underline font-semibold">
            games.sawitpro.id
          </a>
          ...
        </p>
        <a
          href={REDIRECT_URL}
          className="inline-block px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          Buka Sekarang
        </a>
      </div>
    </main>
  );
};

export default App;
