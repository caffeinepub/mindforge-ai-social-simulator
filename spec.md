# MindForge V3 — Large Scale Social Network Simulator

## Current State

MindForge is a frontend-only, session-based social media simulator built with React, TypeScript, Tailwind CSS, and Chart.js. The current V2 implementation includes:

- Home feed with infinite scroll, post creation, and engagement simulation
- Trending and Explore pages
- Messages (DM simulation)
- Profile page with editable avatar, bio, follower/following counts, creator level, achievements, and posts grid
- Post Detail View with comments and prev/next navigation
- Engagement engine with wave-based simulation and viral scoring
- Analytics dashboard with Chart.js charts
- Boost Followers (3 packages)
- Notifications sidebar
- Achievement system
- Dark glassmorphism UI, responsive layout

## Requested Changes (Diff)

### Add

- **Virtualized user simulation**: Dynamically generate simulated users/posts on-demand as user scrolls; never load millions into memory. Each simulated user has username, avatar, bio, follower/following count, and posts with engagement metrics.
- **Story system**: Story bar at top of feed. Users can upload story images. View stories from followed/simulated users with tap navigation, viewer count, 24-minute session expiry, and 24h label.
- **Hashtag system**: Posts support hashtags (#tag). Hashtags are clickable and link to a HashtagPage showing related posts. Trending hashtags section in Explore.
- **Save/Bookmark posts**: Save button on posts. Saved Posts section in profile page.
- **Nested comment replies**: Reply to any comment; replies appear indented under parent comment.
- **Multi-image carousel posts**: Post creation supports up to 5 images. Posts render as swipeable carousel.
- **Full follow/unfollow system**: Follow/unfollow any simulated user. Follower and following counts update in real time.
- **Followers list modal**: View who follows a profile. Ability to follow back from this list.
- **Following list modal**: View who a profile follows. Ability to unfollow directly from this list.
- **Profile navigation**: Clicking any username (in feed, post detail, comments, follower/following lists) navigates to that user's profile.
- **Creator Leaderboard page**: Ranked list of top creators by followers and engagement score.
- **Expanded achievement system**: 15 milestone badges with unlock animations (First Post, First Comment, First Share, 100/500/1k/5k/10k Followers, First Viral Post, 10 Posts Created, 100/1k Likes Received, Top Trending Post, Creator Level 5, Creator Level 10).

### Modify

- **Home feed**: Mix followed users' posts, trending posts, recommended posts, and simulated-user posts.
- **Post Detail View**: Support carousel images, show full engagement details (views, reach, impressions, likes, comments, shares, followers gained, engagement rate), allow all interactions (like, comment, share, save). Navigate to commenter/author profiles.
- **Engagement engine**: Wave-based simulation scaling with follower count. Likes 6–10%, comments 0.5–2%, shares 0.2–1% of viewers. Engagement score = likes + (comments×2) + (shares×3). Viral threshold triggers trending badge and reach boost. Follower gains driven by shares > comments > likes.
- **Profile page**: Add Saved Posts tab, Followers/Following count as clickable links opening modals with lists and follow/unfollow actions.
- **Explore page**: Add trending hashtags section alongside recommended posts.
- **Analytics dashboard**: Ensure all 6 chart types present (follower growth, engagement trends, likes/post, comments/post, top post, engagement rate).
- **Notifications**: Add events for all new triggers (achievements, boosts, follower gains from posts, viral alerts).
- **Sidebar navigation**: Add Leaderboard route.

### Remove

- Nothing removed; all V2 features are preserved and extended.

## Implementation Plan

1. **Simulated user generator** (`utils/simulatedUsers.ts`): Deterministic seeded generator that produces user objects and posts on demand using an index. Used by feed and profile navigation without storing all users in state.

2. **AppContext expansion**: Add savedPosts, followedUsers (Set of user IDs), stories, hashtag index, leaderboard data. Add actions: savePost, followUser, unfollowUser, addStory, addComment reply.

3. **Story components**: `StoryBar.tsx` (horizontal scroll of story rings), `StoryViewer.tsx` (fullscreen viewer with tap nav, progress bar, viewer count, 24-min expiry timer).

4. **Hashtag system**: Parse hashtags from post captions in PostCard. `HashtagPage.tsx` route showing posts with that tag. Trending hashtags in Explore.

5. **PostCard upgrade**: Carousel swipe support (multiple images), save button, follow/unfollow button on avatar/username click, hashtag parsing.

6. **Post Detail upgrade**: Full metrics panel, carousel, nested comment replies, profile navigation from username/avatar.

7. **Profile page upgrade**: Saved Posts tab, clickable follower/following counts opening `FollowerListModal.tsx` and `FollowingListModal.tsx` with follow/unfollow actions and profile links.

8. **Engagement engine rewrite** (`hooks/useEngagementSimulator.ts`): Wave-based phases, realistic percentage ranges, viral threshold detection, follower gain notifications.

9. **Leaderboard page** (`pages/Leaderboard.tsx`): Ranked table of top 50 simulated + real users by follower count and engagement score.

10. **Achievement expansion**: Add 15 achievement definitions, check triggers across all interaction handlers, show unlock toast/animation.

11. **Routing**: Add `/leaderboard`, `/hashtag/:tag`, `/profile/:userId` routes in App.tsx.

12. **Sidebar + MobileNav**: Add Leaderboard icon and link.
