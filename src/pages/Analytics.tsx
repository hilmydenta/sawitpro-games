import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const PASS_KEY = "sawitpro2024";
const COLORS = ["hsl(142, 76%, 36%)", "hsl(142, 60%, 50%)", "hsl(45, 93%, 47%)", "hsl(25, 95%, 53%)", "hsl(0, 72%, 51%)", "hsl(200, 70%, 50%)"];

type DateRange = "7d" | "30d" | "90d" | "all";

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
  started_at: string;
}

interface ScrollRow {
  depth_percent: number;
}

interface EventRow {
  event_type: string;
  event_data: Record<string, unknown> | null;
  created_at: string;
}

function getDateFilter(range: DateRange): string | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const Analytics = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [games, setGames] = useState<GameRow[]>([]);
  const [scrollDepths, setScrollDepths] = useState<ScrollRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASS_KEY) setAuthenticated(true);
  };

  useEffect(() => {
    if (!authenticated) return;
    const fetchData = async () => {
      setLoading(true);
      const dateFilter = getDateFilter(dateRange);

      let vq = supabase.from("page_visits").select("started_at, ended_at, device_type, browser, is_returning, utm_source, time_to_first_interaction_ms").order("started_at", { ascending: false }).limit(1000);
      let gq = supabase.from("game_sessions").select("game_name, duration_seconds, ended_at, started_at").order("started_at", { ascending: false }).limit(1000);
      let sq = supabase.from("scroll_depths").select("depth_percent").limit(1000);
      let eq = supabase.from("page_events").select("event_type, event_data, created_at").order("created_at", { ascending: false }).limit(1000);

      if (dateFilter) {
        vq = vq.gte("started_at", dateFilter);
        gq = gq.gte("started_at", dateFilter);
        sq = sq.gte("created_at", dateFilter);
        eq = eq.gte("created_at", dateFilter);
      }

      const [v, g, s, e] = await Promise.all([vq, gq, sq, eq]);
      setVisits((v.data || []) as VisitRow[]);
      setGames((g.data || []) as GameRow[]);
      setScrollDepths((s.data || []) as ScrollRow[]);
      setEvents((e.data || []) as EventRow[]);
      setLoading(false);
    };
    fetchData();
  }, [authenticated, dateRange]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a1a10" }}>
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-xl space-y-4 w-80">
          <h1 className="text-xl font-bold text-foreground text-center">Analytics Dashboard</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 rounded-lg bg-muted text-foreground border border-border" />
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

  return <DashboardContent visits={visits} games={games} scrollDepths={scrollDepths} events={events} dateRange={dateRange} setDateRange={setDateRange} />;
};

function DashboardContent({ visits, games, scrollDepths, events, dateRange, setDateRange }: {
  visits: VisitRow[]; games: GameRow[]; scrollDepths: ScrollRow[]; events: EventRow[];
  dateRange: DateRange; setDateRange: (r: DateRange) => void;
}) {
  const metrics = useMemo(() => {
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

    return { totalVisits, bounceCount, bounceRate, returningCount, newCount, totalGames, completedGames, abandonedGames, avgDuration, avgTtfi };
  }, [visits, games]);

  // Device breakdown
  const deviceData = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach((v) => { const d = v.device_type || "unknown"; map[d] = (map[d] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [visits]);

  // Mobile vs Desktop engagement
  const mobileVsDesktop = useMemo(() => {
    const mobile = visits.filter(v => v.device_type === "mobile");
    const desktop = visits.filter(v => v.device_type === "desktop");
    const calcAvgDuration = (rows: VisitRow[]) => {
      const withEnd = rows.filter(r => r.ended_at);
      if (withEnd.length === 0) return 0;
      return Math.round(withEnd.reduce((s, r) => s + (new Date(r.ended_at!).getTime() - new Date(r.started_at).getTime()) / 1000, 0) / withEnd.length);
    };
    return {
      mobile: { count: mobile.length, avgDuration: calcAvgDuration(mobile) },
      desktop: { count: desktop.length, avgDuration: calcAvgDuration(desktop) },
    };
  }, [visits]);

  // Game popularity & per-game completion
  const { gameData, gameCompletionData } = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    games.forEach((g) => {
      if (!map[g.game_name]) map[g.game_name] = { total: 0, completed: 0 };
      map[g.game_name].total++;
      if (g.ended_at) map[g.game_name].completed++;
    });
    const gameData = Object.entries(map).map(([name, v]) => ({ name, value: v.total })).sort((a, b) => b.value - a.value);
    const gameCompletionData = Object.entries(map).map(([name, v]) => ({
      name,
      completed: v.completed,
      abandoned: v.total - v.completed,
      rate: v.total > 0 ? Math.round((v.completed / v.total) * 100) : 0,
    })).sort((a, b) => b.completed + b.abandoned - (a.completed + a.abandoned));
    return { gameData, gameCompletionData };
  }, [games]);

  // Scroll depth funnel
  const scrollFunnel = useMemo(() => [25, 50, 75, 100].map((m) => ({
    name: `${m}%`,
    count: scrollDepths.filter((s) => s.depth_percent >= m).length,
  })), [scrollDepths]);

  // UTM sources
  const utmData = useMemo(() => {
    const map: Record<string, number> = {};
    visits.filter((v) => v.utm_source).forEach((v) => { map[v.utm_source!] = (map[v.utm_source!] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visits]);

  // Daily visits
  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach((v) => { const day = v.started_at.substring(0, 10); map[day] = (map[day] || 0) + 1; });
    return Object.entries(map).sort().slice(-14).map(([date, count]) => ({ date: date.substring(5), count }));
  }, [visits]);

  // Browser breakdown
  const browserData = useMemo(() => {
    const map: Record<string, number> = {};
    visits.forEach((v) => { const b = v.browser || "unknown"; map[b] = (map[b] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visits]);

  // Event type breakdown
  const eventTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((e) => { map[e.event_type] = (map[e.event_type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [events]);

  // CTA source breakdown
  const ctaSourceData = useMemo(() => {
    const map: Record<string, number> = {};
    events.filter(e => e.event_type.includes("cta_click") || e.event_type.includes("toko_sawit")).forEach(e => {
      const source = (e.event_data as Record<string, unknown>)?.source as string || e.event_type;
      map[source] = (map[source] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [events]);

  // Hourly traffic pattern
  const hourlyData = useMemo(() => {
    const map: Record<number, number> = {};
    for (let i = 0; i < 24; i++) map[i] = 0;
    visits.forEach((v) => {
      const hour = new Date(v.started_at).getHours();
      map[hour]++;
    });
    return Object.entries(map).map(([hour, count]) => ({ hour: `${hour}:00`, count }));
  }, [visits]);

  // Toko Sawit metrics
  const tokoMetrics = useMemo(() => {
    const opens = events.filter(e => e.event_type === "toko_sawit_open").length;
    const closes = events.filter(e => e.event_type === "toko_sawit_close");
    const durations = closes.map(e => (e.event_data as Record<string, unknown>)?.duration_seconds as number).filter(Boolean);
    const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    return { opens, closes: closes.length, avgDuration };
  }, [events]);

  const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="bg-card rounded-xl p-5 border border-border">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );

  const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-6" style={{ background: "#0a1a10" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">📊 SawitPRO Analytics</h1>
        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d", "all"] as DateRange[]).map((r) => (
            <button key={r} onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${dateRange === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {r === "all" ? "All" : r}
            </button>
          ))}
          <a href="/" className="text-primary text-sm hover:underline ml-2">← Kembali</a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Visits" value={metrics.totalVisits} />
        <StatCard label="Bounce Rate" value={`${metrics.bounceRate}%`} sub={`${metrics.bounceCount} bounced`} />
        <StatCard label="Game Sessions" value={metrics.totalGames} sub={`${metrics.completedGames} completed, ${metrics.abandonedGames} abandoned`} />
        <StatCard label="Avg Game Duration" value={`${metrics.avgDuration}s`} />
        <StatCard label="New Visitors" value={metrics.newCount} />
        <StatCard label="Returning Visitors" value={metrics.returningCount} />
        <StatCard label="Avg TTFI" value={`${metrics.avgTtfi}ms`} sub="Time to first interaction" />
        <StatCard label="Completion Rate" value={metrics.totalGames > 0 ? `${((metrics.completedGames / metrics.totalGames) * 100).toFixed(0)}%` : "N/A"} />
      </div>

      {/* Mobile vs Desktop Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-muted-foreground text-sm mb-2">📱 Mobile</p>
          <p className="text-2xl font-bold text-foreground">{mobileVsDesktop.mobile.count} visits</p>
          <p className="text-sm text-muted-foreground">Avg duration: {mobileVsDesktop.mobile.avgDuration}s</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-muted-foreground text-sm mb-2">🖥️ Desktop</p>
          <p className="text-2xl font-bold text-foreground">{mobileVsDesktop.desktop.count} visits</p>
          <p className="text-sm text-muted-foreground">Avg duration: {mobileVsDesktop.desktop.avgDuration}s</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-muted-foreground text-sm mb-2">🛒 Toko Sawit</p>
          <p className="text-2xl font-bold text-foreground">{tokoMetrics.opens} opens</p>
          <p className="text-sm text-muted-foreground">{tokoMetrics.closes} closed · Avg {tokoMetrics.avgDuration}s</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Visits */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Daily Visits</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Traffic */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Hourly Traffic Pattern</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={2} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(200, 70%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
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
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per-Game Completion Rate */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Per-Game Completion</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gameCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="completed" stackId="a" fill="hsl(142, 76%, 36%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="abandoned" stackId="a" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            {gameCompletionData.map(g => (
              <span key={g.name}>{g.name}: <span className="text-foreground font-semibold">{g.rate}%</span></span>
            ))}
          </div>
        </div>

        {/* Event Type Breakdown */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">Event Types</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={eventTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(142, 60%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CTA Source Breakdown */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h2 className="text-foreground font-bold mb-4">CTA Sources</h2>
          {ctaSourceData.length === 0 ? (
            <p className="text-muted-foreground text-sm">Belum ada data CTA.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ctaSourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={120} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="hsl(45, 93%, 47%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
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
              <Tooltip contentStyle={tooltipStyle} />
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
                <Tooltip contentStyle={tooltipStyle} />
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
            { label: "Visits", value: metrics.totalVisits },
            { label: "Scrolled 50%+", value: scrollDepths.filter((s) => s.depth_percent >= 50).length },
            { label: "Game Clicks", value: metrics.totalGames },
            { label: "Completed", value: metrics.completedGames },
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
}

export default Analytics;
