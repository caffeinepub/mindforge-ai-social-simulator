import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { PostItem } from "../context/AppContext";

interface Props {
  post: PostItem;
  posts: PostItem[];
  onClose: () => void;
  onNavigate: (post: PostItem) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function PostDetailView({
  post,
  posts,
  onClose,
  onNavigate,
}: Props) {
  const { setPosts } = useApp();
  const [commentInput, setCommentInput] = useState("");

  const currentIndex = posts.findIndex((p) => p.id === post.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1;

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

  const addComment = () => {
    if (!commentInput.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c-${Date.now()}`,
                  username: "@alexrivera",
                  text: commentInput.trim(),
                  timestamp: Date.now(),
                },
              ],
            }
          : p,
      ),
    );
    setCommentInput("");
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        data-ocid="post_detail.modal"
        className="max-w-5xl w-full p-0 overflow-hidden"
        style={{
          background: "oklch(0.14 0.018 280)",
          border: "1px solid oklch(0.28 0.025 280 / 0.5)",
          maxHeight: "90vh",
        }}
      >
        <button
          type="button"
          data-ocid="post_detail.close_button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className="flex flex-col md:flex-row h-full"
          style={{ maxHeight: "90vh" }}
        >
          {/* Image */}
          <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img
              src={post.imageUrl}
              alt="post"
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: "90vh" }}
            />
            {hasPrev && (
              <button
                type="button"
                data-ocid="post_detail.pagination_prev"
                onClick={() => onNavigate(posts[currentIndex - 1])}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button
                type="button"
                data-ocid="post_detail.pagination_next"
                onClick={() => onNavigate(posts[currentIndex + 1])}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Side panel */}
          <div
            className="w-full md:w-80 flex flex-col"
            style={{ borderLeft: "1px solid oklch(0.25 0.025 280 / 0.4)" }}
          >
            {/* Author */}
            <div
              className="flex items-center gap-3 p-4"
              style={{ borderBottom: "1px solid oklch(0.25 0.025 280 / 0.3)" }}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.authorAvatar} />
                <AvatarFallback>{post.authorName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{post.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {post.authorUsername} · {timeAgo(post.timestamp)}
                </p>
              </div>
            </div>

            {/* Caption */}
            <div
              className="p-4"
              style={{ borderBottom: "1px solid oklch(0.25 0.025 280 / 0.3)" }}
            >
              <p className="text-sm text-foreground">{post.caption}</p>
            </div>

            {/* Comments */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-2">
                    <span className="font-semibold text-xs text-foreground">
                      {c.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div
              className="p-4"
              style={{ borderTop: "1px solid oklch(0.25 0.025 280 / 0.3)" }}
            >
              <div className="flex items-center gap-4 mb-3">
                <button
                  type="button"
                  data-ocid="post_detail.like_button"
                  onClick={toggleLike}
                  className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${
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
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments.length}
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-cyan-400 transition-all hover:scale-110"
                >
                  <Share2 className="w-5 h-5" />
                  {post.shares}
                </button>
                <button
                  type="button"
                  data-ocid="post_detail.save_button"
                  onClick={toggleSave}
                  className={`ml-auto flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${
                    post.savedByUser
                      ? "text-yellow-400"
                      : "text-muted-foreground hover:text-yellow-400"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${post.savedByUser ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <div className="flex gap-2">
                <Input
                  data-ocid="post_detail.comment_input"
                  placeholder="Add a comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                  className="text-sm"
                  style={{
                    background: "oklch(0.18 0.02 280 / 0.5)",
                    border: "1px solid oklch(0.3 0.025 280 / 0.4)",
                  }}
                />
                <Button
                  data-ocid="post_detail.submit_button"
                  size="icon"
                  className="btn-gradient text-white border-none flex-shrink-0"
                  onClick={addComment}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
