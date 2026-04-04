import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const PASS_KEY = "sawitpro2024";
const COLORS = ["hsl(142, 76%, 36%)", "hsl(142, 60%, 50%)", "hsl(45, 93%, 47%)", "hsl(25, 95%, 53%)", "hsl(0, 72%, 51%)"];

interface VisitRow {
  started_at: string;
  ended_at: string | null;
  device_type: string | null;
  browser: string | null;
  is_returning: boolean | null;
  utm_source: string | null;
  time_to_first_interaction_ms: number | null;
}

interface GameRow {
  game_name: string;
  duration_seconds: number | null;
  ended_at: string | null;
}

interface ScrollRow {
  depth_percent: number;
}

const Analytics = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [scrollDepths, setScrollDepths] = useState<ScrollRow[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASS_KEY) setAuthenticated(true);
  };

  useEffect(() => {
    if (!authenticated) return;
    const fetchData = async () => {
      setLoading(true);
      const [v, g, s] = await Promise.all([
        supabase.from("page_visits").select("started_at, ended_at, device_type, browser, is_returning, utm_source, time_to_first_interaction_ms").order("started_at", { ascending: false }).limit(1000),
        supabase.from("game_sessions").select("game_name, duration_seconds, ended_at").order("started_at", { ascending: false }).limit(1000),
        supabase.from("scroll_depths").select("depth_percent").limit(1000),
      ]);
      setVisits((v.data || []) as VisitRow[]);
      setGames((g.data || []) as GameRow[]);
      setScrollDepths((s.data || []) as ScrollRow[]);
      setLoading(false);
    };
    fetchData();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a1a10" }}>
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-xl space-y-4 w-80">
          <h1 className="text-xl font-bold text-foreground text-center">Analytics Dashboard</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-muted text-foreground border border-border"
          />
          <button type="submit" className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-bold">Masuk</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a1a10" }}>
        <p className="text-foreground text-lg">Loading analytics...</p>
      </div>
    );
  }

  // Compute metrics
  const totalVisits = visits.length;
  const bounceCount = visits.filter((v) => !v.ended_at).length;
  const bounceRate = totalVisits > 0 ? ((bounceCount / totalVisits) * 100).toFixed(1) : "0";
  const returningCount = visits.filter((v) => v.is_returning).length;
  const newCount = totalVisits - returningCount;

  const totalGames = games.length;
  const completedGames = games.filter((g) => g.ended_at).length;
  const abandonedGames = totalGames - completedGames;
  const avgDuration = completedGames > 0
    ? Math.round(games.filter((g) => g.duration_seconds).reduce((s, g) => s + (g.duration_seconds || 0), 0) / completedGames)
    : 0;

  const ttfiValues = visits.filter((v) => v.time_to_first_interaction_ms).map((v) => v.time_to_first_interaction_ms!);
  const avgTtfi = ttfiValues.length > 0 ? Math.round(ttfiValues.reduce((a, b) => a + b, 0) / ttfiValues.length) : 0;

  // Device breakdown
  const deviceMap: Record<string, number> = {};
  visits.forEach((v) => { const d = v.device_type || "unknown"; deviceMap[d] = (deviceMap[d] || 0) + 1; });
  const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

  // Game popularity
  const gameMap: Record<string, number> = {};
  games.forEach((g) => { gameMap[g.game_name] = (gameMap[g.game_name] || 0) + 1; });
  const gameData = Object.entries(gameMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Scroll depth funnel
  const scrollFunnel = [25, 50, 75, 100].map((m) => ({
    name: `${m}%`,
    count: scrollDepths.filter((s) => s.depth_percent >= m).length,
  }));

  // UTM sources
  const utmMap: Record<string, number> = {};
  visits.filter((v) => v.utm_source).forEach((v) => { utmMap[v.utm_source!] = (utmMap[v.utm_source!] || 0) + 1; });
  const utmData = Object.entries(utmMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // Daily visits (last 14 days)
  const dailyMap: Record<string, number> = {};
  visits.forEach((v) => {
    const day = v.started_at.substring(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });
  const dailyData = Object.entries(dailyMap).sort().slice(-14).map(([date, count]) => ({ date: date.substring(5), count }));

  // Browser breakdown
  const browserMap: Record<string, number> = {};
  visits.forEach((v) => { const b = v.browser || "unknown"; browserMap[b] = (browserMap[b] || 0) + 1; });
  const browserData = Object.entries(browserMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="bg-card rounded-xl p-5 border border-border">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6" style={{ background: "#0a1a10" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">📊 SawitPRO Analytics</h1>
        <a href="/" className="text-primary text-sm hover:underline">← Kembali</a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Visits" value={totalVisits} />
        <StatCard label="Bounce Rate" value={`${bounceRate}%`} sub={`${bounceCount} bounced`} />
        <StatCard label="Game Sessions" value={totalGames} sub={`${completedGames} completed, ${abandonedGames} abandoned`} />
        <StatCard label="Avg Game Duration" value={`${avgDuration}s`} />
        <StatCard label="New Visitors" value={newCount} />
        <StatCard label="Returning Visitors" value={returningCount} />
        <StatCard label="Avg TTFI" value={`${avgTtfi}ms`} sub="Time to first interaction" />
        <StatCard label="Completion Rate" value={totalGames > 0 ? `${((completedGames / totalGames) * 100).toFixed(0)}%` : "N/A"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Visits */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Daily Visits (14d)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Game Popularity */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Top Games</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gameData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Device Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Scroll Depth Funnel */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Scroll Depth Funnel</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scrollFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Browser</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={browserData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {browserData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* UTM Sources */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">UTM Sources</h2>
          {utmData.length === 0 ? (
            <p className="text-muted-foreground text-sm">Belum ada data UTM. Gunakan ?utm_source=xxx di URL.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={utmData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="value" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h2 className="text-foreground font-bold mb-4">Conversion Funnel</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
          {[
            { label: "Visits", value: totalVisits },
            { label: "Scrolled 50%+", value: scrollDepths.filter((s) => s.depth_percent >= 50).length },
            { label: "Game Clicks", value: totalGames },
            { label: "Completed", value: completedGames },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2 md:gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{step.value}</p>
                <p className="text-xs text-muted-foreground">{step.label}</p>
                {i > 0 && arr[i - 1].value > 0 && (
                  <p className="text-xs text-primary">{((step.value / arr[i - 1].value) * 100).toFixed(0)}%</p>
                )}
              </div>
              {i < arr.length - 1 && <span className="text-muted-foreground text-xl">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
