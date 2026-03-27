

## Plan: Fix iframe games opening new tabs on mobile browsers

### Problem
The game URLs loaded inside the iframe are likely navigating the parent window or triggering popups (via `window.open` or `target="_top"`). Safari iOS and Android browsers are more permissive with these navigations, causing new tabs to open instead of staying in the iframe.

### Solution
Add the `sandbox` attribute to the `<iframe>` in `src/pages/Index.tsx`. This restricts what the embedded content can do.

### Change

**`src/pages/Index.tsx`** — Add `sandbox` attribute to the iframe element:

```
sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-popups-to-redirect-within allow-presentation"
```

Key permissions:
- `allow-scripts` — games need JavaScript
- `allow-same-origin` — games need to access their own storage/cookies
- `allow-forms` — games may use form submissions
- **Omitting `allow-top-navigation`** — prevents the iframe from redirecting the parent page (the root cause of new tabs opening)
- `allow-popups` — some games may need popups, but they'll stay sandboxed

This is a one-line addition to the existing `<iframe>` tag.

