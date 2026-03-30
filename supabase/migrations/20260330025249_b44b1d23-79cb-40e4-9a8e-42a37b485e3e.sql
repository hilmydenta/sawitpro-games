
-- Table 1: page_visits — Landing page access logs
CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INT,
  screen_height INT,
  referrer TEXT,
  country TEXT,
  city TEXT,
  language TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 2: game_sessions — Tracks each game play session
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  game_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table 3: page_events — Generic event log
CREATE TABLE public.page_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;

-- Since this is anonymous tracking (no auth), we allow inserts from the service role only (via edge function)
-- No public select/insert policies — edge function uses service_role key

-- Indexes for common queries
CREATE INDEX idx_page_visits_session_id ON public.page_visits (session_id);
CREATE INDEX idx_page_visits_started_at ON public.page_visits (started_at DESC);
CREATE INDEX idx_game_sessions_session_id ON public.game_sessions (session_id);
CREATE INDEX idx_game_sessions_game_name ON public.game_sessions (game_name);
CREATE INDEX idx_game_sessions_started_at ON public.game_sessions (started_at DESC);
CREATE INDEX idx_page_events_session_id ON public.page_events (session_id);
CREATE INDEX idx_page_events_event_type ON public.page_events (event_type);
CREATE INDEX idx_page_events_created_at ON public.page_events (created_at DESC);
