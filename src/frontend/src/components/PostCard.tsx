import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { PostItem } from "../context/AppContext";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  post: PostItem;
  index: number;
}

export default function PostCard({ post, index }: Props) {
  const { setPosts } = useApp();
  const [showStats, setShowStats] = useState(false);
  const idx = index + 1;

  const toggleLike = () => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likedByUser: !p.likedByUser,
              likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const toggleSave = () => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              savedByUser: !p.savedByUser,
              saves: p.savedByUser ? p.saves - 1 : p.saves + 1,
            }
          : p,
      ),
    );
  };

  const handleShare = () => {
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, shares: p.shares + 1 } : p)),
    );
  };

  const engagementRate =
    post.views > 0
      ? (
          ((post.likes + post.comments.length + post.shares) / post.views) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <article className="glass-card post-enter overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar
            className="w-10 h-10"
            style={{ boxShadow: "0 0 0 2px oklch(0.6 0.22 295 / 0.4)" }}
          >
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback>{post.authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {post.authorName}
            </p>
            <p className="text-xs text-muted-foreground">
              {post.authorUsername} · {timeAgo(post.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.isTrending && (
            <Badge
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.2 50), oklch(0.6 0.22 25))",
                color: "white",
                border: "none",
              }}
              className="text-xs"
            >
              🔥 Trending
            </Badge>
          )}
          <MoreHorizontal className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>
      </div>

      {post.imageUrl && (
        <div className="relative">
          <img
            src={post.imageUrl}
            alt="post"
            className="w-full object-cover"
            style={{ maxHeight: "400px" }}
            loading="lazy"
          />
        </div>
      )}

      <div className="px-4 py-3">
        <p className="text-sm text-foreground leading-relaxed">
          {post.caption}
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 pb-3">
        <button
          type="button"
          data-ocid={`post.like_button.${idx}`}
          onClick={toggleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:scale-110 ${
            post.likedByUser
              ? "text-pink-400"
              : "text-muted-foreground hover:text-pink-400"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${post.likedByUser ? "fill-current" : ""}`}
          />
          {post.likes.toLocaleString()}
        </button>

        <button
          type="button"
          data-ocid={`post.comment_button.${idx}`}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-blue-400 transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="w-5 h-5" />
          {post.comments.length}
        </button>

        <button
          type="button"
          data-ocid={`post.share_button.${idx}`}
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-cyan-400 transition-all duration-200 hover:scale-110"
        >
          <Share2 className="w-5 h-5" />
          {post.shares}
        </button>

        <button
          type="button"
          data-ocid={`post.save_button.${idx}`}
          onClick={toggleSave}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:scale-110 ${
            post.savedByUser
              ? "text-yellow-400"
              : "text-muted-foreground hover:text-yellow-400"
          }`}
        >
          <Bookmark
            className={`w-5 h-5 ${post.savedByUser ? "fill-current" : ""}`}
          />
          {post.saves}
        </button>

        <button
          type="button"
          data-ocid={`post.stats_toggle.${idx}`}
          onClick={() => setShowStats((s) => !s)}
          className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Stats
          {showStats ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Performance Panel */}
      {showStats && (
        <div
          className="mx-4 mb-4 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200"
          style={{
            background: "oklch(0.16 0.018 280 / 0.8)",
            border: "1px solid oklch(0.28 0.025 280 / 0.4)",
          }}
        >
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "oklch(0.65 0.2 295)" }}
          >
            Post Performance
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { label: "Views", value: post.views.toLocaleString() },
              { label: "Reach", value: post.reach.toLocaleString() },
              {
                label: "Impressions",
                value: post.impressions.toLocaleString(),
              },
              { label: "Followers Gained", value: `+${post.followersGained}` },
              { label: "Likes", value: post.likes.toLocaleString() },
              { label: "Comments", value: post.comments.length.toString() },
              { label: "Shares", value: post.shares.toString() },
              { label: "Eng. Rate", value: `${engagementRate}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-sm font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {post.comments.length > 0 && (
        <div
          className="px-4 pb-4 border-t"
          style={{ borderColor: "oklch(0.25 0.025 280 / 0.3)" }}
        >
          <div className="pt-3 space-y-1">
            {post.comments.slice(-2).map((c) => (
              <p key={c.id} className="text-xs">
                <span className="font-semibold text-foreground">
                  {c.username}
                </span>{" "}
                <span className="text-muted-foreground">{c.text}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
