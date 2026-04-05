-- Merge hyphenated game names to underscored versions in game_sessions
UPDATE public.game_sessions SET game_name = REPLACE(game_name, '-', '_') WHERE game_name LIKE '%-%';

-- Merge hyphenated game names in page_events event_data
UPDATE public.page_events 
SET event_data = jsonb_set(event_data, '{game_name}', to_jsonb(REPLACE(event_data->>'game_name', '-', '_')))
WHERE event_data->>'game_name' LIKE '%-%';