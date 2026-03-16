import { useEffect, useRef } from "react";
import { toast } from "sonner";
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
    achievements,
  } = useApp();
  const postsRef = useRef(posts);
  postsRef.current = posts;
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const achievementsRef = useRef(achievements);
  achievementsRef.current = achievements;

  useEffect(() => {
    const interval = setInterval(() => {
      const followers = profileRef.current.followers;
      setPosts((prev) => {
        const updated = prev.map((post) => {
          const ageMs = Date.now() - post.timestamp;
          const ageMin = ageMs / 60000;

          // Wave-based reach calculation
          // Phase 1 (0-2 min): reach 10-20% of followers over 40 ticks
          // Phase 2 (2-10 min): expand if strong engagement
          // Phase 3 (10+ min): viral reach to non-followers
          let viewerBase: number;
          if (ageMin < 2) {
            // Phase 1: spread over 40 ticks
            viewerBase = Math.floor(
              (followers * (0.1 + Math.random() * 0.1)) / 40,
            );
          } else if (ageMin < 10) {
            // Phase 2: reduced rate
            const expansionMult = post.engagementScore > 200 ? 1.5 : 0.7;
            viewerBase = Math.floor(((followers * 0.05) / 160) * expansionMult);
          } else {
            // Phase 3: viral boost or slow decay
            if (post.isTrending) {
              viewerBase = Math.floor(followers * 0.002 * (1 + Math.random()));
            } else {
              viewerBase = Math.floor(followers * 0.0005);
            }
          }
          viewerBase = Math.max(1, viewerBase);

          const newLikeDelta = Math.floor(
            viewerBase * (0.06 + Math.random() * 0.04),
          );
          const newCommentDelta =
            Math.random() < 0.35
              ? Math.floor(viewerBase * (0.005 + Math.random() * 0.015))
              : 0;
          const newShareDelta =
            Math.random() < 0.25
              ? Math.floor(viewerBase * (0.002 + Math.random() * 0.008))
              : 0;

          const newLikes = post.likes + newLikeDelta;
          const newShares = post.shares + newShareDelta;
          const newViews = post.views + viewerBase;
          const newReach = post.reach + Math.floor(viewerBase * 0.7);
          const newImpressions =
            post.impressions + Math.floor(viewerBase * 1.2);

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
                    userId: ["1", "2", "3", "4", "5", "6"][
                      Math.floor(Math.random() * 6)
                    ],
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.floor(Math.random() * 100)}`,
                    text: SAMPLE_COMMENTS[
                      Math.floor(Math.random() * SAMPLE_COMMENTS.length)
                    ],
                    timestamp: Date.now(),
                    replies: [],
                  }),
                )
              : [];
          const newComments = [...post.comments, ...addedComments];

          const newScore = newLikes + newComments.length * 2 + newShares * 3;
          const wasViral = post.isTrending;
          const isNowViral = newScore > 500;

          // Follower gains: shares > comments > likes
          const followersFromShares =
            newShareDelta * (0.5 + Math.random() * 0.5);
          const followersFromComments =
            newCommentDelta * (0.1 + Math.random() * 0.2);
          const followersFromLikes =
            newLikeDelta * (0.01 + Math.random() * 0.04);
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
                type: "follower_gain",
              });
            }
          }

          if (!wasViral && isNowViral) {
            addNotification({
              icon: "🔥",
              message: `Your post "${post.caption.slice(0, 30)}..." is going viral! 🔥`,
              type: "viral",
            });
            toast("🔥 Your post is going viral!", { duration: 4000 });
            setAchievements((ach) =>
              ach.map((a) =>
                a.id === "a9"
                  ? { ...a, unlocked: true, unlockedAt: Date.now() }
                  : a,
              ),
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

        // Check achievements based on profile
        const currentFollowers = profileRef.current.followers;
        const currentAchievements = achievementsRef.current;
        const updatesNeeded: string[] = [];
        if (
          currentFollowers >= 10000 &&
          !currentAchievements.find((a) => a.id === "a8")?.unlocked
        )
          updatesNeeded.push("a8");
        if (
          currentFollowers >= 5000 &&
          !currentAchievements.find((a) => a.id === "a7")?.unlocked
        )
          updatesNeeded.push("a7");
        if (updatesNeeded.length > 0) {
          setAchievements((ach) =>
            ach.map((a) =>
              updatesNeeded.includes(a.id)
                ? { ...a, unlocked: true, unlockedAt: Date.now() }
                : a,
            ),
          );
        }

        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [
    setPosts,
    addNotification,
    setProfile,
    setAchievements,
    setAnalyticsData,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData((a) => {
        const current = profileRef.current.followers;
        return {
          ...a,
          followerGrowth: [...a.followerGrowth.slice(-6), current],
        };
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [setAnalyticsData]);

  const { setConversations, setUnreadDMs } = useApp();
  useEffect(() => {
    const msgs = [
      "Hey I love your posts!",
      "Your content is amazing!",
      "Followed you today!",
      "Keep it up!",
      "Can we collab? 🔥",
      "You're so inspiring!",
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

  // Achievement celebration effect
  const prevAchRef = useRef(achievements);
  useEffect(() => {
    const prev = prevAchRef.current;
    for (const ach of achievements) {
      const was = prev.find((a) => a.id === ach.id);
      if (ach.unlocked && was && !was.unlocked) {
        toast(
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "28px" }}>{ach.icon}</span>
            <div>
              <p style={{ fontWeight: "bold", fontSize: "14px" }}>
                🏆 Achievement Unlocked!
              </p>
              <p style={{ fontSize: "12px", opacity: 0.7 }}>{ach.title}</p>
            </div>
          </div>,
          { duration: 5000 },
        );
        addNotification({
          icon: ach.icon,
          message: `Achievement unlocked: ${ach.title}`,
          type: "achievement",
        });
      }
    }
    prevAchRef.current = achievements;
  }, [achievements, addNotification]);
}
