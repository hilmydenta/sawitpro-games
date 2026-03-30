

## Generate Sample/Seed Data for Analytics Tables

### What we'll do
Insert realistic sample data into the three tracking tables to populate the database for demo/dashboard purposes.

### Data to generate

**`page_visits`** (~50 rows, spanning the last 30 days)
- Mix of device types (60% desktop, 25% mobile, 15% tablet)
- Browsers: Chrome, Safari, Firefox, Edge
- OS: Windows, macOS, Android, iOS, Linux
- Countries: Indonesia (majority), Malaysia, Singapore, Philippines
- Cities: Jakarta, Surabaya, Bandung, Medan, Kuala Lumpur, Singapore
- Varied screen sizes, referrers (google, instagram, direct), languages (id, en)
- Each visit has start/end times with realistic durations (30s–15min)

**`game_sessions`** (~80 rows, linked to page visit sessions)
- Distributed across panen_sawit (~40%), tanam_sawit (~35%), dunia_sawit (~25%)
- Durations ranging from 10s to 300s
- Some sessions without end times (simulating abandoned plays)

**`page_events`** (~100 rows)
- Event types: game_card_click, page_scroll, cta_click, share_click
- Linked to existing session IDs
- Realistic event_data payloads

### Implementation
- Use the Supabase insert tool to run batch INSERT statements
- All data will use past timestamps spread across the last 30 days

