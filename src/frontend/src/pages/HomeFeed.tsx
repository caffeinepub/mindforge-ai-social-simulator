import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PostCard from "../components/PostCard";
import PostDetailView from "../components/PostDetailView";
import StoryBar from "../components/StoryBar";
import StoryViewer from "../components/StoryViewer";
import { useApp } from "../context/AppContext";
import type { PostItem, Story } from "../context/AppContext";
import { generatePostsForUser } from "../utils/simulatedUsers";

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

export default function HomeFeed() {
  const {
    profile,
    posts,
    setPosts,
    addNotification,
    stories,
    addSimulatedPost,
  } = useApp();
  const [caption, setCaption] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailPost, setDetailPost] = useState<PostItem | null>(null);
  const [viewingStory, setViewingStory] = useState<{
    story: Story;
    index: number;
  } | null>(null);
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
    };
    setPosts((prev) => [newPost, ...prev]);
    addNotification({
      icon: "\ud83d\udcf8",
      message: "You published a new post!",
      type: "like",
    });
    toast.success("Post published! \ud83c\udf89");
    setCaption("");
    setImagePreviews([]);
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
