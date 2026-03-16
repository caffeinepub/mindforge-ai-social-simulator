# MindForge AI Social Simulator

## Current State
MindForge V4 Phase 2 is complete. The app has:
- Full post feed, engagement simulation, wave-based engagement engine
- AI Influencer Ecosystem with 50 AI creators posting, commenting, collaborating
- Creator Economy: Monetization page, Merch Store, Brand Sponsorships, Fan Tips
- PostItem has fields: id, likes, comments, shares, saves, views, reach, impressions, engagementScore, isTrending
- PostDetailView shows engagement metrics (views, reach, engagement rate)
- HomeFeed has a post creation box with caption textarea and image upload
- useAIInfluencers.ts handles background AI activity and notifications
- No viral stage tracking, no post strength meter, no algorithm update system

## Requested Changes (Diff)

### Add
- `viralStage` field (0-4) to PostItem type in AppContext
- `viralScore` field to PostItem (computed from engagement signals)
- `useViralEngine.ts` hook: runs on interval, advances post viral stages based on viralScore, fires momentum notifications for user's posts
- `viralEngine.ts` utility: viral score formula, stage thresholds, algorithm weight system (mutable weights for shares/comments/likes/saves), trending hashtag boost logic
- `PostStrengthMeter` component: live meter shown in HomeFeed post creation box, reacts to caption length, hashtag count, and time of day (simulated posting time score). Shows a labeled progress bar with text like "Weak", "Good", "Strong", "Excellent"
- Algorithm Update notification system in `useViralEngine.ts`: fires every 3-5 minutes, randomly shifts algorithm weights and fires a notification like "Platform Update: Shares are now more important for reach"
- Momentum signal badge in PostDetailView: shows contextual hints based on viralStage — Stage 1: "Picking up traction", Stage 2: "Trending fast", Stage 3: "Exploding in reach", Stage 4: "🔥 Trending Worldwide"
- Posts at viralStage 3-4 gain `isTrending: true` and appear at top of Trending page

### Modify
- `AppContext.tsx`: add `viralStage` and `viralScore` to `PostItem` interface; initialize existing posts with `viralStage: 0, viralScore: 0`
- `App.tsx`: import and call `useViralEngine()` in AppShell
- `HomeFeed.tsx`: add `PostStrengthMeter` below the caption textarea, above the action buttons
- `PostDetailView.tsx`: add momentum signal badge below the engagement stats grid, only shown when viralStage > 0
- Trending page: sort by viralStage desc first, then engagementScore

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/utils/viralEngine.ts`
   - Export `ALGORITHM_WEIGHTS` object: `{ shares: 3, comments: 2, likes: 1, saves: 1.5 }` (mutable)
   - Export `computeViralScore(post, weights)` function
   - Export `VIRAL_STAGE_THRESHOLDS: [0, 500, 2000, 8000, 20000]`
   - Export `getViralStage(score)` returning 0-4
   - Export `getMomentumSignal(stage)` returning label string
   - Export `ALGORITHM_UPDATE_EVENTS`: array of {message, weightChange} objects
   - Export `computePostStrength(caption, hashtags)` returning 0-100 score
2. Create `src/frontend/src/hooks/useViralEngine.ts`
   - On interval (every 8-15s), iterate user's posts and advance viralStage if viralScore crosses threshold
   - Fire notification when user post advances stage (momentum hints)
   - On separate interval (every 3-5 min), pick random algorithm update, mutate ALGORITHM_WEIGHTS, fire platform announcement notification
3. Add `PostStrengthMeter` inline in HomeFeed or as small component file
4. Update AppContext PostItem type with viralStage/viralScore fields
5. Update PostDetailView to show momentum badge when viralStage > 0
6. Wire useViralEngine in App.tsx
