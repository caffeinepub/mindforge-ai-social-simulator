# MindForge AI Social Simulator — Version 16

## Current State
MindForge V15 is a fully persistent, offline-capable social media creator simulator with 80+ features across V1–V15. The service worker uses a hardcoded cache name `mindforge-v5`, which means users with any cached version never receive updates on refresh — the old cached app is always served instead of the new one.

## Requested Changes (Diff)

### Add
- **Version 16 update prompt**: When the app loads and detects a new service worker is waiting, show a non-intrusive "Update available — tap to refresh" banner that triggers `skipWaiting` and reloads to V16.
- **Batch 4 Feature: Celebrity Mode** — Unlocks at 1M followers. Shows a special "Celebrity" badge on profile, unlocks paparazzi events (random pop-up events with follower spikes), a brand empire panel, and a global fanbase system.
- **Batch 4 Feature: Legacy Score** — A permanent all-time score that tracks total engagement, followers peaked, viral posts, and brand deal earnings. Persists even through New Game resets (stored separately in localStorage).
- **Batch 4 Feature: Hall of Fame** — A dedicated page (in Creator Hub) listing top creators of all time across all playthroughs, pulled from the Legacy Score data. Never resets.
- **Batch 4 Feature: Black Market** — A risky underground shop (in Creator Hub) offering: stolen engagement data (temporary engagement boost), leaked algorithm info (brief viral multiplier), rival sabotage (temporarily reduces an AI rival's reach). Each action has coin cost and risk of backfire.
- **Batch 4 Feature: Fan Army Wars** — Your fans vs a rival AI creator's fans in an engagement challenge. User picks a rival, both sides accumulate engagement points over a timed period, winner gets a follower boost and coin reward.
- **Batch 4 Feature: Real-Time Trend Battles** — Two hashtags compete; user picks a side when creating a post. Results update every few seconds showing which side is winning. Winner gets a 2x reach multiplier for posts using that hashtag.

### Modify
- **Service worker (`sw.js`)**: Update cache name from `mindforge-v5` to `mindforge-v16`. This forces all users with cached old versions to receive the new version on next refresh/visit.
- **main.tsx or App.tsx**: Register a `controllerchange` listener so when the service worker updates, the page reloads automatically (seamless forced update).

### Remove
- Nothing removed.

## Implementation Plan
1. Update `sw.js` cache name to `mindforge-v16` and add `skipWaiting()` + `clients.claim()` to force immediate activation.
2. In `main.tsx`, after service worker registration, listen for `controllerchange` event and call `window.location.reload()` to auto-update all open tabs.
3. Add an update notification banner in `App.tsx` that fires when a new SW is waiting.
4. Create `src/frontend/src/pages/HallOfFame.tsx` — Legacy Score display + all-time top creators table.
5. Create `src/frontend/src/pages/BlackMarket.tsx` — Underground shop with 3 purchasable risk actions.
6. Create `src/frontend/src/pages/FanArmyWars.tsx` — Pick rival, timed engagement battle, results + rewards.
7. Create `src/frontend/src/pages/TrendBattles.tsx` — Two competing hashtags, pick a side on post creation, live leaderboard.
8. Update `AppContext.tsx` — Add `legacyScore` state (persisted separately, never reset), `celebrityMode` flag (unlocked at 1M followers), `blackMarketHistory`, `fanArmyWar` state, `trendBattle` state.
9. Update `CreatorHub.tsx` — Add links to Hall of Fame, Black Market, Fan Army Wars, Trend Battles.
10. Update `Profile.tsx` — Show Celebrity badge + paparazzi event modal when celebrity mode is active.
