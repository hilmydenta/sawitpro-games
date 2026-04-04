import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json();
    const { action } = body;

    const country = req.headers.get("cf-ipcountry") || req.headers.get("x-country") || null;
    const city = req.headers.get("cf-ipcity") || req.headers.get("x-city") || null;

    if (action === "page_visit_start") {
      const { session_id, device_type, browser, os, screen_width, screen_height, referrer, language, user_agent, is_returning, utm_source, utm_medium, utm_campaign } = body;
      const { error } = await supabase.from("page_visits").insert({
        session_id,
        device_type,
        browser,
        os,
        screen_width,
        screen_height,
        referrer: referrer || null,
        language,
        user_agent,
        country,
        city,
        started_at: new Date().toISOString(),
        is_returning: is_returning || false,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "page_visit_end") {
      const { session_id } = body;
      const { error } = await supabase
        .from("page_visits")
        .update({ ended_at: new Date().toISOString() })
        .eq("session_id", session_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "game_session_start") {
      const { session_id, game_name } = body;
      const { data, error } = await supabase.from("game_sessions").insert({
        session_id,
        game_name,
        started_at: new Date().toISOString(),
      }).select("id").single();
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, game_session_id: data.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "game_session_end") {
      const { game_session_id, duration_seconds, abandoned } = body;
      const { error } = await supabase
        .from("game_sessions")
        .update({ ended_at: new Date().toISOString(), duration_seconds })
        .eq("id", game_session_id);
      if (error) throw error;

      // Track abandonment as a page event
      if (abandoned) {
        await supabase.from("page_events").insert({
          session_id: game_session_id,
          event_type: "game_abandon",
          event_data: { duration_seconds },
        });
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "page_event") {
      const { session_id, event_type, event_data } = body;
      const { error } = await supabase.from("page_events").insert({
        session_id,
        event_type,
        event_data: event_data || {},
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "scroll_depth") {
      const { session_id, depth_percent } = body;
      const { error } = await supabase.from("scroll_depths").insert({
        session_id,
        depth_percent,
        reached_at: new Date().toISOString(),
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "ttfi") {
      const { session_id, time_to_first_interaction_ms } = body;
      const { error } = await supabase
        .from("page_visits")
        .update({ time_to_first_interaction_ms })
        .eq("session_id", session_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Track event error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
