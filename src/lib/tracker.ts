import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("sp_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("sp_session_id", sessionId);
  }
  return sessionId;
}

// Parse user agent for device type, browser, OS
function parseUserAgent() {
  const ua = navigator.userAgent;

  // Device type
  let device_type = "desktop";
  if (/Mobi|Android/i.test(ua)) device_type = "mobile";
  else if (/Tablet|iPad/i.test(ua)) device_type = "tablet";

  // Browser
  let browser = "unknown";
  if (/CriOS|Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = "Safari";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/OPR|Opera/i.test(ua)) browser = "Opera";

  // OS
  let os = "unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return { device_type, browser, os, user_agent: ua };
}

async function sendEvent(payload: Record<string, unknown>) {
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/track-event`;
    
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true, // ensures beacon-like behavior on page unload
    });
  } catch {
    // Silently fail — tracking should never break the app
  }
}

// Track page visit start
export function trackPageVisit() {
  const sessionId = getSessionId();
  const { device_type, browser, os, user_agent } = parseUserAgent();

  sendEvent({
    action: "page_visit_start",
    session_id: sessionId,
    device_type,
    browser,
    os,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    referrer: document.referrer || null,
    language: navigator.language,
    user_agent,
  });

  // Track page close / visibility change
  const handleEnd = () => {
    sendEvent({ action: "page_visit_end", session_id: sessionId });
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") handleEnd();
  });

  window.addEventListener("beforeunload", handleEnd);
}

// Track game session
let currentGameSessionId: string | null = null;
let gameStartTime: number | null = null;

export async function trackGameStart(gameName: string) {
  const sessionId = getSessionId();
  gameStartTime = Date.now();

  // Also log a page event
  sendEvent({
    action: "page_event",
    session_id: sessionId,
    event_type: "game_card_click",
    event_data: { game_name: gameName },
  });

  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/track-event`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "game_session_start",
        session_id: sessionId,
        game_name: gameName,
      }),
    });
    const data = await res.json();
    currentGameSessionId = data.game_session_id || null;
  } catch {
    // Silently fail
  }
}

export function trackGameEnd() {
  if (!currentGameSessionId || !gameStartTime) return;
  const durationSeconds = Math.round((Date.now() - gameStartTime) / 1000);

  sendEvent({
    action: "game_session_end",
    game_session_id: currentGameSessionId,
    duration_seconds: durationSeconds,
  });

  currentGameSessionId = null;
  gameStartTime = null;
}

// Track generic page events
export function trackEvent(eventType: string, eventData?: Record<string, unknown>) {
  sendEvent({
    action: "page_event",
    session_id: getSessionId(),
    event_type: eventType,
    event_data: eventData || {},
  });
}
