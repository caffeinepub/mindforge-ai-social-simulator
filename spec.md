# MindForge AI Social Simulator

## Current State
V4 Phase 1 (UI/UX + Messaging + Watch Time/Algorithm) is complete. The app has:
- Full monetization page with sponsorships (accept/decline only, no negotiation)
- Analytics page with region breakdown, watch time, follower growth
- Fan tips simulated as notifications (no loyalty levels)
- Smart notifications partially implemented
- Brand deals fire as notifications but have no negotiation flow
- AppContext tracks monetization, posts, followers, AI creators

## Requested Changes (Diff)

### Add
1. **Brand Deal Negotiation** — On pending sponsorship cards in Monetization page, add three negotiation buttons (1.25x, 1.5x, 2x offer). Higher multipliers (2x) have a 40% rejection chance. Rejected negotiations show a notification and remove the deal. Accepted negotiations update the deal value and fire a success notification.
2. **Fan Loyalty System** — 4 tiers: Fan, Super Fan, VIP Fan, Ultra Fan. Fans upgrade based on engagement over time (consistent posts = more upgrades). AppContext tracks `fanLoyalty: { fans, superFans, vipFans, ultraFans }`. Analytics page shows a fan loyalty breakdown chart (pie or bar). Notifications fire when fans upgrade (e.g., "12 fans upgraded to Super Fan!"). Higher-tier fans contribute more engagement multiplier.
3. **Content Series System** — When creating a post, user can optionally mark it as part of a named series (e.g., "My Fitness Journey Part 1"). Series posts are grouped on the profile page under a "Series" tab. When a new part is posted, returning viewers (loyal/superfans) get a notification. Series posts receive a small retention bonus.
4. **Reputation & Trust System** — Visible "Trust Score" (0–100) shown on the user's profile. Increases with: consistent posting, high engagement quality, accepted brand deals. Decreases with: spam behavior, fake follower purchase, shadow ban. Trust score affects reach multiplier (high trust = +20% reach, low trust = -30% reach). Small badge on profile (Trusted Creator / Rising Creator / At Risk).
5. **Burnout & Consistency System** — Track posting frequency. Overposting (5+ posts in a short period) triggers a "Burnout Warning" notification and reduces reach by 20% temporarily. Inactivity (no posts for a long simulated period) triggers a "Your audience is getting cold" notification and starts a slow follower drop. Consistent posting (steady cadence) gives a +10% engagement bonus.
6. **Smart Notification System** — Add context-aware notifications: "Best time to post right now", "Your audience is most active", "You're on a streak — keep posting!", "A post from yesterday is gaining traction". These fire based on simulated conditions (time of day simulation, post activity, engagement trends).

### Modify
- `Monetization.tsx` — Add negotiation buttons (1.25x, 1.5x, 2x) on pending sponsorship cards alongside the existing Accept button
- `Analytics.tsx` — Add fan loyalty breakdown section (pie chart with 4 tiers + counts)
- `AppContext.tsx` — Add `fanLoyalty` state, `reputationScore`, `burnoutStatus`, `negotiateSponsorship()`, `contentSeries[]`, `addToSeries()` actions
- `Profile.tsx` — Show Trust Score badge and reputation tier; add Series tab to user's profile posts
- Post creation UI — Add optional "Add to Series" input when creating posts
- Notification system — Add smart notification triggers for posting time, streaks, traction alerts

### Remove
- Nothing removed

## Implementation Plan
1. Extend AppContext with: `fanLoyalty`, `reputationScore`, `burnoutStatus`, `contentSeries`, `negotiateSponsorship()`, `addPostToSeries()` — plus simulation logic for fan upgrades, reputation changes, burnout tracking, and smart notification timing
2. Update Monetization.tsx: add negotiation buttons with risk logic on pending deals
3. Update Analytics.tsx: add fan loyalty chart section
4. Update Profile.tsx: show Trust Score badge, add Series tab
5. Update post creation modal: add optional series field
6. Wire smart notifications into the notification simulation loop
