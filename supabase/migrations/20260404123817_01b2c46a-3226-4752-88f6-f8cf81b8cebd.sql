
-- Create scroll_depths table
CREATE TABLE public.scroll_depths (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  depth_percent integer NOT NULL,
  reached_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scroll_depths ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge function (service role)
CREATE POLICY "Allow public insert for tracking" ON public.scroll_depths FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for analytics" ON public.scroll_depths FOR SELECT USING (true);

-- Add new columns to page_visits
ALTER TABLE public.page_visits ADD COLUMN is_returning boolean DEFAULT false;
ALTER TABLE public.page_visits ADD COLUMN utm_source text;
ALTER TABLE public.page_visits ADD COLUMN utm_medium text;
ALTER TABLE public.page_visits ADD COLUMN utm_campaign text;
ALTER TABLE public.page_visits ADD COLUMN time_to_first_interaction_ms integer;
