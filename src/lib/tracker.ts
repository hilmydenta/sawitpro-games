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

  let device_type = "desktop";
  if (/Mobi|Android/i.test(ua)) device_type = "mobile";
  else if (/Tablet|iPad/i.test(ua)) device_type = "tablet";

  let browser = "unknown";
  if (/CriOS|Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = "Safari";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
  else if (/Edg/i.test(ua)) browser = "Edge";
  else if (/OPR|Opera/i.test(ua)) browser = "Opera";

  let os = "unknown";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return { device_type, browser, os, user_agent: ua };
}

// Parse UTM parameters from URL
function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
  };
}

// Check if visitor is returning
function checkReturningVisitor(): boolean {
  const key = "sp_has_visited";
  const hasVisited = localStorage.getItem(key) === "true";
  localStorage.setItem(key, "true");
  return hasVisited;
}

function getEdgeFunctionUrl(fnName: string): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  return `${supabaseUrl}/functions/v1/${fnName}`;
}

async function sendEvent(payload: Record<string, unknown>) {
  try {
    await fetch(getEdgeFunctionUrl("track-event"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silently fail — tracking should never break the app
  }
}

// Track page visit start
export function trackPageVisit() {
  const sessionId = getSessionId();
  const { device_type, browser, os, user_agent } = parseUserAgent();
  const utmParams = getUtmParams();
  const is_returning = checkReturningVisitor();

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
    is_returning,
    ...utmParams,
  });

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

  sendEvent({
    action: "page_event",
    session_id: sessionId,
    event_type: "game_card_click",
    event_data: { game_name: gameName },
  });

  try {
    const res = await fetch(getEdgeFunctionUrl("track-event"), {
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

  // Track game abandonment on page unload
  window.addEventListener("beforeunload", handleGameAbandon);
}

function handleGameAbandon() {
  if (!currentGameSessionId || !gameStartTime) return;
  const durationSeconds = Math.round((Date.now() - gameStartTime) / 1000);

  sendEvent({
    action: "game_session_end",
    game_session_id: currentGameSessionId,
    duration_seconds: durationSeconds,
    abandoned: true,
  });

  currentGameSessionId = null;
  gameStartTime = null;
}

export function trackGameEnd() {
  window.removeEventListener("beforeunload", handleGameAbandon);

  if (!currentGameSessionId || !gameStartTime) return;
  const durationSeconds = Math.round((Date.now() - gameStartTime) / 1000);

  sendEvent({
    action: "game_session_end",
    game_session_id: currentGameSessionId,
    duration_seconds: durationSeconds,
    abandoned: false,
  });

  currentGameSessionId = null;
  gameStartTime = null;
}

export function trackEvent(eventType: string, eventData?: Record<string, unknown>) {
  sendEvent({
    action: "page_event",
    session_id: getSessionId(),
    event_type: eventType,
    event_data: eventData || {},
  });
}

// Scroll depth tracking
const scrollMilestones = [25, 50, 75, 100];
const reachedMilestones = new Set<number>();

export function trackScrollDepth() {
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const percent = Math.round((window.scrollY / scrollHeight) * 100);

    for (const milestone of scrollMilestones) {
      if (percent >= milestone && !reachedMilestones.has(milestone)) {
        reachedMilestones.add(milestone);
        sendEvent({
          action: "scroll_depth",
          session_id: getSessionId(),
          depth_percent: milestone,
        });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}

// Time to first interaction
export function trackTimeToFirstInteraction() {
  const pageLoadTime = Date.now();
  let tracked = false;

  const handler = () => {
    if (tracked) return;
    tracked = true;
    const ttfi = Date.now() - pageLoadTime;

    sendEvent({
      action: "ttfi",
      session_id: getSessionId(),
      time_to_first_interaction_ms: ttfi,
    });

    window.removeEventListener("click", handler);
    window.removeEventListener("scroll", handler);
    window.removeEventListener("touchstart", handler);
  };

  window.addEventListener("click", handler, { once: true, passive: true });
  window.addEventListener("scroll", handler, { once: true, passive: true });
  window.addEventListener("touchstart", handler, { once: true, passive: true });
}
