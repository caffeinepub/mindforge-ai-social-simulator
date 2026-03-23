# MindForge AI Social Simulator — Batch 2

## Current State
MindForge V5.1 is live with 80+ features including Live Streaming (Batch 1). The app has persistent LocalStorage save, PWA offline, 5-icon bottom nav, Creator Hub, Creator Coins, skill upgrades, AI creators, viral engine, analytics, messaging, and story system.

## Requested Changes (Diff)

### Add
- **Creator Drama Engine**: AI creators can call out the player, start beef, or copy their content. Player gets a notification with 3 choices (respond, ignore, escalate). Each choice affects reputation/trust score and follower count differently.
- **Creator Rivalries**: One AI creator becomes the player's rival — tracks the player's stats, posts competitive content, and tries to outperform them. Rival is shown on Profile page with a head-to-head stats comparison.
- **Fan Rebellion**: If the player hasn't posted in a long time or engagement drops severely, fans start unfollowing in waves with angry comments appearing in the feed. A "Calm Your Fans" action lets the player recover.
- **Platform Takeover Events**: Rare random events where the algorithm goes haywire — any post can massively blow up or tank. Shown as a dramatic platform-wide banner with a countdown. During the event, viral scoring is randomized with extreme multipliers.

### Modify
- `AppContext.tsx`: Add drama events state, rival creator state, fan rebellion state, and platform takeover event state. Integrate into persistence (LocalStorage).
- `HomeFeed.tsx`: Show drama notifications, fan rebellion alerts, platform takeover banner.
- `Profile.tsx`: Show rival creator comparison panel.
- Notification system: Add drama/rivalry/rebellion/takeover notification types.

### Remove
- Nothing removed.

## Implementation Plan
1. Add drama/rival/rebellion/takeover state to AppContext with LocalStorage persistence.
2. Drama Engine: Random timer triggers AI creator drama event → notification with 3 choices → outcome affects trust score + followers.
3. Rivalry System: Assign one rival AI creator on first trigger, show on Profile as head-to-head stats card, rival posts more aggressively.
4. Fan Rebellion: Monitor post frequency; if player hasn't posted in 30+ min (simulated inactivity), trigger rebellion wave — follower drop + angry comments. "Post Now" or "Calm Fans" button to stop it.
5. Platform Takeover: Rare random event (every 20-40 min), dramatic banner with countdown in feed, viral multipliers go wild (0.1x to 50x) for 2 minutes.
6. All events wired to notification system.
