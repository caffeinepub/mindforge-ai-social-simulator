# MindForge Social Simulator — Version 2

## Current State

Version 1 is a fully frontend-only React + TypeScript + Tailwind app with:
- AppContext holding profile, posts, notifications, conversations, achievements, analyticsData
- 5 pages: HomeFeed, Trending, Messages, Profile, Analytics
- PostCard component with like/comment/share buttons
- useEngagementSimulator hook running auto-engagement, DM simulation, and follower growth on intervals
- Profile page with single "Boost Followers" button (+10k) and basic edit dialog (name, username, bio, avatar URL)
- No: Explore page, Post Detail View, save button, post performance panel, engagement wave phases, viral threshold logic, three-tier boost packages, preset avatars, views/reach/impressions tracking, loading skeletons, infinite scroll indicator

## Requested Changes (Diff)

### Add
- **Explore page** — new discovery page showing posts ranked by engagement score and popularity with an algorithmic mix; add to nav
- **Post Detail View** — modal/overlay triggered by clicking a post in profile grid, showing full image, caption, like/comment/share counts, comments list, comment input, prev/next navigation
- **Save button** on PostCard (bookmark icon) with saved state tracked per post
- **Post Performance Panel** on each PostCard — expandable panel showing views, reach, impressions, likes, comments, shares, followers gained, engagement rate
- **Engagement wave simulation** — Phase 1 (10–20% followers), Phase 2 (expand if strong), Phase 3 (reach non-followers); per-post views/reach/impressions fields
- **Viral threshold system** — engagement_score = likes + (comments×2) + (shares×3); mark trending and boost reach when threshold crossed
- **Follower growth model** — shares generate most followers, comments medium, likes small; notifications like "You gained 24 new followers from your post."
- **Three-tier Boost Followers packages** — MIN (+1,000), MEDIUM (+10,000), MAX (+100,000) with animated counter and confirmation popup
- **Preset avatars** — 10 preset avatar options in Edit Profile dialog
- **Avatar upload from device** in Edit Profile dialog
- **Profile customization** — name, username, bio editable (already exists but extend with avatar options)
- **Milestone celebration animations** — toast/overlay on achievement unlock
- **Loading skeleton animations** for feed cards
- **Analytics page enhancements** — follower growth chart, engagement trends, likes per post, comments per post, top performing post, engagement rate (Chart.js)
- **Notification system additions** — achievement unlocks, boost follower events added to notifications sidebar

### Modify
- **AppContext** — extend PostItem with: views, reach, impressions, savedByUser, followersGained fields; extend Profile with no changes needed; update boostFollowers to accept package size; add savedPosts list
- **useEngagementSimulator** — rewrite to implement 3-phase engagement waves with proper percentage-based scaling; implement viral threshold scoring; implement follower growth from engagement source
- **HomeFeed** — add save button, add post performance panel toggle, add loading skeleton on initial load, feed mix (followed + trending + recommended)
- **Profile page** — replace single boost button with three-tier boost modal; extend edit dialog with avatar options (URL, upload, 10 presets); post grid items clickable to open PostDetailView
- **PostCard** — add save button, add performance stats panel (expandable)
- **Trending page** — use engagement_score formula for ranking
- **Sidebar + MobileNav** — add Explore page nav item
- **App.tsx** — add Explore page routing

### Remove
- Single "Boost Followers" button (replaced by three-tier boost modal)

## Implementation Plan

1. **Extend AppContext** — add views/reach/impressions/savedByUser/followersGained to PostItem; add savedPosts state; update boostFollowers signature with amount param; add analyticsData fields for comments per post, top post
2. **Rewrite useEngagementSimulator** — implement phase-based waves, viral scoring formula, follower growth by engagement source, proper notification messages with follower counts
3. **Create Explore page** (`pages/Explore.tsx`) — discovery grid of posts sorted by engagement score; show recommendation badges
4. **Create PostDetailView component** (`components/PostDetailView.tsx`) — modal with image, caption, stats, comments list, comment input, prev/next nav
5. **Update PostCard** — add save (bookmark) button, add expandable performance panel with metrics
6. **Update Profile page** — three-tier boost modal, extended edit dialog with preset avatars and upload, post grid click to open PostDetailView, milestone celebration animation
7. **Update HomeFeed** — loading skeletons, save button visible, algorithmic feed mix label
8. **Update Analytics page** — add comments per post chart, top post highlight, follower growth improvements
9. **Update Sidebar + MobileNav + App.tsx** — wire Explore page
10. **Add milestone animations** — confetti or overlay toast on achievement unlock events
