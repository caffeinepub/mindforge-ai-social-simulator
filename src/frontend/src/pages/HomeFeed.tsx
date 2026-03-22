import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PostCard from "../components/PostCard";
import PostDetailView from "../components/PostDetailView";
import StoryBar from "../components/StoryBar";
import StoryViewer from "../components/StoryViewer";
import { useApp } from "../context/AppContext";
import type { PostItem, Story } from "../context/AppContext";
import { extractHashtags } from "../context/AppContext";
import { generatePostsForUser } from "../utils/simulatedUsers";
import { computePostStrength } from "../utils/viralEngine";

const SKEL_IDS = ["s1", "s2", "s3"];
const BOUNCE_IDS = ["b1", "b2", "b3"];

function FeedSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-20" />
        </div>
      </div>
      <Skeleton className="w-full h-60" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

function PostStrengthMeter({ caption }: { caption: string }) {
  const hashtags = extractHashtags(caption);
  const score = computePostStrength(caption, hashtags);
  const label =
    score < 26
      ? "Weak"
      : score < 51
        ? "Fair"
        : score < 76
          ? "Strong"
          : "Excellent";
  const color =
    score < 26
      ? "oklch(0.6 0.2 25)"
      : score < 51
        ? "oklch(0.75 0.18 65)"
        : score < 76
          ? "oklch(0.72 0.18 145)"
          : "oklch(0.7 0.22 295)";
  const tip =
    hashtags.length < 2
      ? "Tip: Add 2\u20134 hashtags for more reach"
      : caption.split(/\s+/).filter(Boolean).length < 5
        ? "Tip: Write a longer caption"
        : "Looking great! Post at peak hours for extra reach";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Post Strength</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {label}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(0.22 0.02 280)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">{tip}</p>
    </div>
  );
}

function PlatformEventBanner({
  onDismiss,
  onUseTag,
}: {
  onDismiss: () => void;
  onUseTag: (tag: string) => void;
}) {
  const { activePlatformEvent } = useApp();
  if (!activePlatformEvent) return null;

  return (
    <div
      data-ocid="feed.event.card"
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.28 0.08 295 / 0.9), oklch(0.22 0.06 240 / 0.9))",
        border: "1px solid oklch(0.55 0.2 295 / 0.4)",
        boxShadow: "0 0 30px oklch(0.55 0.2 295 / 0.15)",
      }}
    >
      {/* Dismiss */}
      <button
        type="button"
        data-ocid="feed.event.close_button"
        onClick={onDismiss}
        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        style={{ background: "oklch(0.2 0.04 280 / 0.5)" }}
      >
        <X className="w-3 h-3" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "oklch(0.55 0.25 295 / 0.3)" }}
        >
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "oklch(0.72 0.2 295)" }}
            >
              Active Event
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.88 0.12 295)" }}
            >
              {activePlatformEvent.hashtag}
            </span>
          </div>
          <p className="text-sm text-white/90">{activePlatformEvent.label}</p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button
          data-ocid="feed.event.primary_button"
          size="sm"
          className="gap-1.5 btn-gradient text-white border-none text-xs"
          onClick={() => onUseTag(activePlatformEvent.hashtag)}
        >
          Use {activePlatformEvent.hashtag}
        </Button>
        <span
          className="text-xs self-center"
          style={{ color: "oklch(0.72 0.2 295)" }}
        >
          {activePlatformEvent.reachMultiplier}x reach multiplier
        </span>
      </div>
    </div>
  );
}

export default function HomeFeed() {
  const {
    profile,
    posts,
    setPosts,
    addNotification,
    stories,
    addSimulatedPost,
    addPostToSeries,
    setPostingStreak,
    setLastPostTime,
    lastPostTime,
  } = useApp();
  const [caption, setCaption] = useState("");
  const [seriesInput, setSeriesInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailPost, setDetailPost] = useState<PostItem | null>(null);
  const [viewingStory, setViewingStory] = useState<{
    story: Story;
    index: number;
  } | null>(null);
  const [eventDismissed, setEventDismissed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const simFeedPageRef = useRef(0);
  const addSimulatedPostRef = useRef(addSimulatedPost);
  addSimulatedPostRef.current = addSimulatedPost;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const generated = [
      ...generatePostsForUser(4, 3, 0),
      ...generatePostsForUser(2, 2, 10),
      ...generatePostsForUser(3, 2, 20),
    ];
    for (const sp of generated) addSimulatedPostRef.current(sp);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const page = simFeedPageRef.current + 1;
          simFeedPageRef.current = page;
          const newGenerated = generatePostsForUser(
            (page % 8) + 5,
            3,
            page * 100,
          );
          for (const sp of newGenerated) addSimulatedPostRef.current(sp);
        }
      },
      { threshold: 0.1 },
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(
      0,
      5 - imagePreviews.length,
    );
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setImagePreviews((prev) =>
          [...prev, ev.target?.result as string].slice(0, 5),
        );
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));

  const handlePost = () => {
    if (!caption.trim() && imagePreviews.length === 0) return;
    const imgs =
      imagePreviews.length > 0
        ? imagePreviews
        : [`https://picsum.photos/seed/${Date.now()}/600/400`];
    const newPost: PostItem = {
      id: `p-${Date.now()}`,
      authorName: profile.name,
      authorUsername: profile.username,
      authorAvatar: profile.avatar,
      imageUrl: imgs[0],
      images: imgs,
      caption: caption.trim() || "Check out this moment! \ud83d\udcf8",
      hashtags: [],
      likes: 0,
      comments: [],
      shares: 0,
      saves: 0,
      views: 0,
      reach: 0,
      impressions: 0,
      followersGained: 0,
      timestamp: Date.now(),
      engagementScore: 0,
      likedByUser: false,
      savedByUser: false,
      isTrending: false,
      watchTime: 45 + Math.floor(Math.random() * 48),
    };
    setPosts((prev) => [newPost, ...prev]);
    addNotification({
      icon: "\ud83d\udcf8",
      message: "You published a new post!",
      type: "like",
    });
    if (seriesInput.trim()) {
      addPostToSeries(newPost.id, seriesInput.trim());
    }
    // Update posting streak
    const now = Date.now();
    if (lastPostTime > 0 && now - lastPostTime < 12 * 60 * 60 * 1000) {
      setPostingStreak((s) => s + 1);
    } else {
      setPostingStreak(1);
    }
    setLastPostTime(now);
    toast.success("Post published! 🎉");
    setCaption("");
    setSeriesInput("");
    setImagePreviews([]);
  };

  const handleUseTag = (tag: string) => {
    setCaption((prev) =>
      prev.includes(tag) ? prev : `${prev}${prev ? " " : ""}${tag}`,
    );
    toast.success(`${tag} added to your post!`);
  };

  const allFeedPosts = [...posts].sort((a, b) => {
    const isOwn = (p: PostItem) => p.authorUsername === profile.username;
    if (isOwn(a) && !isOwn(b)) return -1;
    if (!isOwn(a) && isOwn(b)) return 1;
    return (
      b.timestamp - a.timestamp + (b.engagementScore - a.engagementScore) * 0.1
    );
  });

  return (
    <div className="max-w-xl mx-auto space-y-5 py-6 px-4">
      {/* Platform Event Banner */}
      {!eventDismissed && (
        <PlatformEventBanner
          onDismiss={() => setEventDismissed(true)}
          onUseTag={handleUseTag}
        />
      )}

      {!loading && (
        <div className="glass-card p-4">
          <StoryBar
            onStoryClick={(story, index) => setViewingStory({ story, index })}
          />
        </div>
      )}

      <div className="glass-card p-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <Textarea
            data-ocid="post.create.textarea"
            placeholder="What's on your mind? Use #hashtags!"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="resize-none text-sm flex-1"
            style={{
              background: "oklch(0.18 0.02 280 / 0.5)",
              border: "1px solid oklch(0.3 0.025 280 / 0.5)",
            }}
            rows={2}
          />
        </div>

        {caption.trim().length > 0 && <PostStrengthMeter caption={caption} />}

        <input
          type="text"
          data-ocid="post.series.input"
          placeholder="📺 Add to series (optional, e.g. 'Morning Routine')"
          value={seriesInput}
          onChange={(e) => setSeriesInput(e.target.value)}
          className="w-full text-xs rounded-lg px-3 py-2 outline-none transition-all"
          style={{
            background: "oklch(0.18 0.02 280 / 0.5)",
            border: "1px solid oklch(0.3 0.025 280 / 0.4)",
            color: "oklch(0.9 0.01 260)",
          }}
        />

        {imagePreviews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {imagePreviews.map((src, i) => (
              <div
                key={src.slice(0, 20)}
                className="relative w-20 h-20 rounded-lg overflow-hidden"
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                style={{ borderColor: "oklch(0.35 0.03 280 / 0.5)" }}
              >
                <Image className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            data-ocid="post.create.upload_button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => fileRef.current?.click()}
          >
            <Image className="w-4 h-4" /> Photo
          </Button>
          <p className="text-xs text-muted-foreground ml-auto">
            {imagePreviews.length}/5 photos
          </p>
          <Button
            data-ocid="post.create.submit_button"
            size="sm"
            className="btn-gradient text-white border-none gap-1.5"
            onClick={handlePost}
            disabled={!caption.trim() && imagePreviews.length === 0}
          >
            <Send className="w-3.5 h-3.5" /> Post
          </Button>
        </div>
      </div>

      {loading
        ? SKEL_IDS.map((id) => <FeedSkeleton key={id} />)
        : allFeedPosts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              index={i}
              onOpenDetail={setDetailPost}
            />
          ))}

      <div ref={bottomRef} className="h-4" />
      {!loading && (
        <div className="flex justify-center py-2">
          <div className="flex gap-1">
            {BOUNCE_IDS.map((id, i) => (
              <div
                key={id}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: "oklch(0.6 0.22 295 / 0.6)",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {viewingStory && (
        <StoryViewer
          stories={stories}
          startIndex={Math.max(
            0,
            stories.findIndex((s) => s.id === viewingStory.story.id),
          )}
          onClose={() => setViewingStory(null)}
        />
      )}

      {detailPost && (
        <PostDetailView
          post={allFeedPosts.find((p) => p.id === detailPost.id) ?? detailPost}
          posts={allFeedPosts}
          onClose={() => setDetailPost(null)}
          onNavigate={setDetailPost}
        />
      )}
    </div>
  );
}
