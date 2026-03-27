

## Event Tracker for SawitPRO Games

### Overview
Set up Lovable Cloud (Supabase) and create database tables to track user activity, then add client-side tracking logic.

### Database Tables

**1. `page_visits`** — Landing page access logs
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| session_id | text | Generated per visit |
| started_at | timestamptz | Page open time |
| ended_at | timestamptz | Updated on page close/hide |
| device_type | text | mobile/tablet/desktop (from user-agent) |
| browser | text | Parsed from user-agent |
| os | text | Parsed from user-agent |
| screen_width | int | |
| screen_height | int | |
| referrer | text | document.referrer |
| country | text | From IP via edge function |
| city | text | From IP via edge function |
| language | text | navigator.language |

**2. `game_sessions`** — Tracks each game play session (covers both Panen Sawit & Tanam Sawit)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| session_id | text | Links to page_visits |
| game_name | text | "panen_sawit" / "tanam_sawit" / "dunia_sawit" |
| started_at | timestamptz | When user clicked the card |
| ended_at | timestamptz | When user closed the game |
| duration_seconds | int | Computed on close |

**3. `page_events`** — Generic event log for additional tracking
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| session_id | text | |
| event_type | text | e.g. "game_card_click", "page_scroll", "cta_click" |
| event_data | jsonb | Flexible payload |
| created_at | timestamptz | |

### Implementation Steps

1. **Enable Lovable Cloud** — Set up Supabase backend
2. **Create migrations** — Three tables above with appropriate indexes
3. **Create an edge function `track-event`** — Accepts event payloads, extracts geo/IP data from request headers, inserts into tables. Disables JWT verification since there's no auth.
4. **Create `src/lib/tracker.ts`** — Client-side module that:
   - Generates a session ID (stored in sessionStorage)
   - Detects device type, browser, OS from `navigator.userAgent`
   - Sends page visit on load, updates `ended_at` on `visibilitychange`/`beforeunload`
   - Tracks game open/close with timestamps and duration
5. **Integrate tracker into `Index.tsx`** — Call tracker on mount and when game iframe opens/closes

### Key Design Decisions
- **No authentication required** — anonymous tracking, no user IDs
- **Single `game_sessions` table** instead of separate tables per game — more scalable and easier to query
- **Edge function for inserts** — avoids exposing table directly, allows IP-based geo lookup
- **`visibilitychange` + `beforeunload`** — ensures we capture end times even on mobile browsers

