import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Image, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PostCard from "../components/PostCard";
import { useApp } from "../context/AppContext";

function FeedSkeleton() {
  return (
    <div className="glass-card overflow-hidden space-y-0">
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
      <div className="flex gap-4 px-4 pb-4">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
}

export default function HomeFeed() {
  const { profile, posts, setPosts, addNotification } = useApp();
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!caption.trim() && !imagePreview) return;
    const newPost = {
      id: `p-${Date.now()}`,
      authorName: profile.name,
      authorUsername: profile.username,
      authorAvatar: profile.avatar,
      imageUrl:
        imagePreview || `https://picsum.photos/seed/${Date.now()}/600/400`,
      caption: caption.trim() || "Check out this moment! 📸",
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
      icon: "📸",
      message: "You published a new post!",
      type: "like",
    });
    toast.success("Post published! 🎉");
    setCaption("");
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Sort feed: own posts first if recent, then mix of recency + engagement
  const sortedPosts = [...posts].sort((a, b) => {
    const isOwn = (p: typeof a) => p.authorUsername === profile.username;
    if (isOwn(a) && !isOwn(b)) return -1;
    if (!isOwn(a) && isOwn(b)) return 1;
    return (
      b.timestamp - a.timestamp + (b.engagementScore - a.engagementScore) * 0.1
    );
  });

  return (
    <div className="max-w-xl mx-auto space-y-5 py-6 px-4">
      {/* Create Post */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <Textarea
            data-ocid="feed.post_input"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="resize-none text-sm"
            style={{
              background: "oklch(0.18 0.02 280 / 0.5)",
              border: "1px solid oklch(0.3 0.025 280 / 0.5)",
            }}
            rows={2}
          />
        </div>

        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={imagePreview}
              alt="preview"
              className="w-full object-cover max-h-48"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            data-ocid="feed.image_upload_button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Image className="w-4 h-4" /> Photo
          </Button>
          <Button
            data-ocid="feed.submit_button"
            size="sm"
            className="ml-auto gap-2 btn-gradient text-white border-none"
            onClick={handlePost}
            disabled={!caption.trim() && !imagePreview}
          >
            <Send className="w-3.5 h-3.5" /> Post
          </Button>
        </div>
      </div>

      {/* Feed Label */}
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-purple-400" />
        <div>
          <p className="text-sm font-semibold">Curated for you</p>
          <p className="text-xs text-muted-foreground">
            Posts from your network, trending content, and recommendations
          </p>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <>
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </>
      ) : (
        sortedPosts.map((post, idx) => (
          <PostCard key={post.id} post={post} index={idx} />
        ))
      )}
    </div>
  );
}
