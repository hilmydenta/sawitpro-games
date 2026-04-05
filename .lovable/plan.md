

## Analytics Improvement Recommendations

Based on a deep dive into the live data, here are concrete issues and improvements found.

### Critical Bugs Found

**1. Game name inconsistency (data corruption)**
Games are tracked with inconsistent names: `panen_sawit` (102 sessions) vs `panen-sawit` (7 sessions), and `tanam_sawit` (43) vs `tanam-sawit` (24). This splits analytics data and inflates game counts. Root cause is likely in `src/data/games.ts` game IDs using different separators.
- Fix: Normalize all game IDs to use underscores, add a migration to merge existing data.

**2. Game abandon event stores wrong session_id**
In `track-event/index.ts` line 82, when tracking game abandonment, it uses `game_session_id` as `session_id` instead of the actual page visit `session_id`. This means abandon events cannot be correlated with the visitor session.
- Fix: Pass the real `session_id` from the client when ending a game session.

### Dashboard Improvements

**3. Add date range filter**
Currently the dashboard always loads the last 1000 rows with no date filtering. As traffic grows, this will miss older data and make the dashboard slow.
- Add a date picker (last 7d, 30d, custom) to filter queries.

**4. Add page events breakdown chart**
The dashboard has no visualization for event types (67 CTA clicks, 106 section views, etc.). Add a bar chart showing event type distribution.

**5. Add hourly traffic pattern chart**
Show which hours of the day get the most traffic. Useful for timing social media posts or campaigns.

**6. Add CTA source breakdown**
CTA clicks have rich `event_data` (hero_main: 20, sticky_main: 13, download: 11, etc.) but the dashboard doesn't break this down. Show which CTAs convert best.

### New Tracking

**7. Track app download clicks separately**
Currently app card clicks (only 4 total) go to `app_card_click` but don't distinguish which app. The data shows all 4 came from 1 session. Track `app_name` more prominently and add to dashboard.

**8. Track Toko Sawit engagement time**
`toko_sawit_close` events (only 3 of 8 opens) include `duration_seconds` but the dashboard doesn't display this. Add Toko Sawit engagement metrics.

**9. Add session replay link for Clarity**
The Clarity script placeholder in `index.html` still has `CLARITY_PROJECT_ID` — needs a real ID to activate heatmaps and session replays.

### Data Insights to Surface

**10. Mobile vs Desktop engagement gap**
Mobile avg duration is 11 min vs Desktop 65 min — a 6x gap. The dashboard should highlight this discrepancy with a comparison card.

**11. Panen Sawit abandonment alert**
Panen Sawit has 58% abandonment (59/102) vs Tanam Sawit at 30% (13/43). Surface per-game completion rates in the dashboard.

### Implementation Summary

| File | Changes |
|---|---|
| `src/data/games.ts` | Normalize game IDs to underscores |
| `src/lib/tracker.ts` | Pass session_id in game_session_end |
| `supabase/functions/track-event/index.ts` | Fix abandon event session_id |
| `supabase/migrations/` | Merge duplicate game name data |
| `src/pages/Analytics.tsx` | Date filter, event breakdown chart, hourly chart, CTA breakdown, per-game completion rates, mobile vs desktop card, Toko Sawit metrics |
| `index.html` | Reminder to set real Clarity ID |

### Priority Order

| # | Item | Effort |
|---|---|---|
| 1 | Fix game name inconsistency + merge data | Small |
| 2 | Fix game abandon session_id bug | Small |
| 3 | Add date range filter to dashboard | Medium |
| 4 | Add event breakdown + CTA source charts | Medium |
| 5 | Add per-game completion rates | Small |
| 6 | Add hourly traffic + mobile vs desktop cards | Small |
| 7 | Add Toko Sawit engagement metrics | Small |

