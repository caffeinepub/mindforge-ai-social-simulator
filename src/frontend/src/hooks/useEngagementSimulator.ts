import { useEffect, useRef } from "react";
import { SAMPLE_COMMENTS, useApp } from "../context/AppContext";

export function useEngagementSimulator() {
  const {
    posts,
    setPosts,
    addNotification,
    setProfile,
    setAchievements,
    setAnalyticsData,
    profile,
  } = useApp();

  const postsRef = useRef(posts);
  postsRef.current = posts;
  const profileRef = useRef(profile);
  profileRef.current = profile;

  // Main engagement simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const followers = profileRef.current.followers;

      setPosts((prev) => {
        const updated = prev.map((post) => {
          const ageMs = Date.now() - post.timestamp;
          const ageMin = ageMs / 60000;

          // Phase 1: first 5 min — reach 10-20% of followers
          // Phase 2: strong engagement — expand reach
          // Phase 3: viral — reach non-followers
          let viewerBase = Math.floor(
            (followers * (0.1 + Math.random() * 0.1)) / 100,
          );
          if (post.engagementScore > 200 && ageMin < 30) {
            viewerBase = Math.floor(viewerBase * 1.3); // Phase 2 boost
          }
          if (post.isTrending) {
            viewerBase = Math.floor(viewerBase * (1.5 + Math.random() * 0.5)); // Phase 3
          }
          viewerBase = Math.max(1, viewerBase);

          const newLikeDelta = Math.floor(
            viewerBase * (0.06 + Math.random() * 0.04),
          );
          const newCommentDelta =
            Math.random() < 0.4
              ? Math.floor(viewerBase * (0.005 + Math.random() * 0.015))
              : 0;
          const newShareDelta =
            Math.random() < 0.3
              ? Math.floor(viewerBase * (0.002 + Math.random() * 0.008))
              : 0;

          const newLikes = post.likes + newLikeDelta;
          const newShares = post.shares + newShareDelta;
          const newViews = post.views + viewerBase;
          const newReach = post.reach + Math.floor(viewerBase * 0.7);
          const newImpressions =
            post.impressions + Math.floor(viewerBase * 1.2);

          // Add simulated comments
          const addedComments =
            newCommentDelta > 0
              ? Array.from(
                  { length: Math.min(newCommentDelta, 2) },
                  (_, i) => ({
                    id: `c-${Date.now()}-${post.id}-${i}`,
                    username: [
                      "@samchen",
                      "@miatorres",
                      "@jordankim",
                      "@rileylee",
                      "@alexk",
                      "@jessw",
                    ][Math.floor(Math.random() * 6)],
                    text: SAMPLE_COMMENTS[
                      Math.floor(Math.random() * SAMPLE_COMMENTS.length)
                    ],
                    timestamp: Date.now(),
                  }),
                )
              : [];
          const newComments = [...post.comments, ...addedComments];

          // Viral scoring: likes + comments*2 + shares*3
          const newScore = newLikes + newComments.length * 2 + newShares * 3;
          const wasViral = post.isTrending;
          const isNowViral = newScore > 500;

          // Follower growth from engagement: shares most, comments medium, likes small
          const followersFromShares =
            newShareDelta * (0.5 + Math.random() * 1.5);
          const followersFromComments =
            newCommentDelta * (0.1 + Math.random() * 0.4);
          const followersFromLikes =
            newLikeDelta * (0.02 + Math.random() * 0.03);
          const followersGainedDelta = Math.floor(
            followersFromShares + followersFromComments + followersFromLikes,
          );

          if (followersGainedDelta > 0) {
            setProfile((p) => ({
              ...p,
              followers: p.followers + followersGainedDelta,
              xp: p.xp + followersGainedDelta,
            }));
            setAnalyticsData((a) => ({
              ...a,
              followersGainedToday:
                a.followersGainedToday + followersGainedDelta,
            }));
            if (followersGainedDelta >= 5) {
              addNotification({
                icon: "🚀",
                message: `You gained ${followersGainedDelta} new followers from "${post.caption.slice(0, 30)}..."`,
                type: "follower",
              });
            }
          }

          if (!wasViral && isNowViral) {
            addNotification({
              icon: "🔥",
              message: `Your post "${post.caption.slice(0, 30)}..." is now trending!`,
              type: "viral",
            });
            setAchievements((ach) =>
              ach.map((a) => (a.id === "a3" ? { ...a, unlocked: true } : a)),
            );
          }

          return {
            ...post,
            likes: newLikes,
            comments: newComments,
            shares: newShares,
            views: newViews,
            reach: newReach,
            impressions: newImpressions,
            followersGained: post.followersGained + followersGainedDelta,
            engagementScore: newScore,
            isTrending: isNowViral,
          };
        });

        // Update analytics
        setAnalyticsData((a) => {
          const topPost = updated.reduce(
            (best, p) => (p.engagementScore > best.engagementScore ? p : best),
            updated[0],
          );
          return {
            ...a,
            totalLikesToday: a.totalLikesToday + Math.floor(Math.random() * 8),
            totalCommentsToday:
              a.totalCommentsToday + (Math.random() < 0.4 ? 1 : 0),
            engagementRate: Math.min(
              25,
              a.engagementRate + (Math.random() * 0.15 - 0.05),
            ),
            postEngagement: updated.map((p) => ({
              label: `${p.caption.slice(0, 18)}...`,
              likes: p.likes,
              comments: p.comments.length,
            })),
            topPostId: topPost?.id ?? null,
          };
        });

        // Random like/comment notifications
        if (Math.random() < 0.3) {
          const users = ["@samchen", "@miatorres", "@jordankim", "@rileylee"];
          const u = users[Math.floor(Math.random() * users.length)];
          if (Math.random() < 0.5) {
            addNotification({
              icon: "❤️",
              message: `${u} liked your post`,
              type: "like",
            });
          } else {
            addNotification({
              icon: "💬",
              message: `${u} commented: "${SAMPLE_COMMENTS[Math.floor(Math.random() * SAMPLE_COMMENTS.length)]}"`,
              type: "comment",
            });
          }
        }

        // Check 10k achievement
        const currentFollowers = profileRef.current.followers;
        if (currentFollowers >= 10000) {
          setAchievements((ach) =>
            ach.map((a) => (a.id === "a4" ? { ...a, unlocked: true } : a)),
          );
        }

        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [
    setPosts,
    addNotification,
    setProfile,
    setAchievements,
    setAnalyticsData,
  ]);

  // Follower growth snapshot for chart (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData((a) => {
        const currentFollowers = profileRef.current.followers;
        const newGrowth = [...a.followerGrowth.slice(-6), currentFollowers];
        return { ...a, followerGrowth: newGrowth };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [setAnalyticsData]);

  // DM simulation
  const { setConversations, setUnreadDMs } = useApp();
  useEffect(() => {
    const msgs = [
      "Hey I love your posts!",
      "Your content is amazing!",
      "Followed you today!",
      "Keep it up!",
      "When's your next post?",
      "You're so inspiring!",
      "Can we collab? 🔥",
      "Your feed is everything ❤️",
    ];
    const interval = setInterval(
      () => {
        const convoIds = ["conv1", "conv2", "conv3"];
        const randomConvo =
          convoIds[Math.floor(Math.random() * convoIds.length)];
        const text = msgs[Math.floor(Math.random() * msgs.length)];
        setConversations((prev) =>
          prev.map((c) =>
            c.id === randomConvo
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: `m-${Date.now()}`,
                      text,
                      sent: false,
                      timestamp: Date.now(),
                    },
                  ],
                }
              : c,
          ),
        );
        setUnreadDMs((n) => n + 1);
        addNotification({
          icon: "💬",
          message: `New DM: "${text}"`,
          type: "dm",
        });
      },
      Math.random() * 20000 + 20000,
    );
    return () => clearInterval(interval);
  }, [setConversations, setUnreadDMs, addNotification]);
}
