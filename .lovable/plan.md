

## Plan: Embed Games in Same Page via iframe

Instead of opening game URLs in new tabs, clicking a game card will display the game in a full-screen iframe overlay on the same page.

### Changes

1. **`src/pages/Index.tsx`** — Add state to track the currently selected game. When a game is selected, render a full-screen iframe overlay with a close/back button. Pass an `onSelect` callback to GameCard instead of having it open a new tab.

2. **`src/components/GameCard.tsx`** — Replace `window.open` with calling the `onSelect` prop. The card becomes a simple trigger that notifies the parent which game was clicked.

### UX Details
- Full-screen overlay with the game iframe covering the viewport
- A floating "✕ Kembali" (Back) button at the top-left corner to close the game and return to the game list
- "Coming Soon" cards remain disabled and non-clickable
- Smooth fade-in transition when opening/closing

