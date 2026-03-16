import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Grid, Upload, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PostDetailView from "../components/PostDetailView";
import { PRESET_AVATARS, useApp } from "../context/AppContext";
import type { PostItem } from "../context/AppContext";

const LEVEL_THRESHOLDS = [
  { level: 1, name: "Beginner Creator", min: 0, max: 500 },
  { level: 2, name: "Emerging Voice", min: 500, max: 1500 },
  { level: 3, name: "Rising Creator", min: 1500, max: 3000 },
  { level: 5, name: "Rising Star", min: 3000, max: 6000 },
  { level: 10, name: "Influencer", min: 10000, max: 20000 },
  { level: 20, name: "Social Media Legend", min: 50000, max: 100000 },
];

function getLevelInfo(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].min) {
      const tier = LEVEL_THRESHOLDS[i];
      const next =
        LEVEL_THRESHOLDS[Math.min(i + 1, LEVEL_THRESHOLDS.length - 1)];
      const progress = ((xp - tier.min) / (next.max - tier.min)) * 100;
      return { ...tier, progress: Math.min(100, progress), nextXp: next.max };
    }
  }
  return { ...LEVEL_THRESHOLDS[0], progress: 0, nextXp: 500 };
}

export default function Profile() {
  const {
    profile,
    setProfile,
    posts,
    achievements,
    setAchievements,
    boostFollowers,
  } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [detailPost, setDetailPost] = useState<PostItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    username: profile.username,
    bio: profile.bio,
    avatar: profile.avatar,
  });
  const [avatarTab, setAvatarTab] = useState<"url" | "upload" | "preset">(
    "url",
  );
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const prevAchievementsRef = useRef(achievements);

  const levelInfo = getLevelInfo(profile.xp);
  const userPosts = posts.filter((p) => p.authorUsername === profile.username);

  // Milestone celebration on achievement unlock
  useEffect(() => {
    const prev = prevAchievementsRef.current;
    for (const ach of achievements) {
      const was = prev.find((a) => a.id === ach.id);
      if (ach.unlocked && was && !was.unlocked) {
        toast(
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ach.icon}</span>
            <div>
              <p className="font-bold text-sm">🏆 Achievement Unlocked!</p>
              <p className="text-xs text-muted-foreground">{ach.title}</p>
            </div>
          </div>,
          { duration: 5000 },
        );
        setAchievements((prev) =>
          prev.map((a) => (a.id === ach.id ? { ...a, unlocked: true } : a)),
        );
      }
    }
    prevAchievementsRef.current = achievements;
  }, [achievements, setAchievements]);

  const handleSave = () => {
    setProfile((prev) => ({ ...prev, ...editForm }));
    setEditOpen(false);
    toast.success("Profile updated!");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setEditForm((f) => ({ ...f, avatar: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleBoost = (amount: number) => {
    boostFollowers(amount);
    toast.success(
      `🚀 Boost activated! +${amount.toLocaleString()} followers incoming!`,
    );
    setBoostOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-5">
          <Avatar
            className="w-24 h-24"
            style={{ boxShadow: "0 0 0 4px oklch(0.6 0.22 295 / 0.3)" }}
          >
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {profile.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground text-sm mb-2">
              {profile.username}
            </p>
            <p className="text-sm text-foreground mb-4">{profile.bio}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                data-ocid="profile.edit_button"
                variant="outline"
                size="sm"
                className="gap-2"
                style={{
                  borderColor: "oklch(0.35 0.03 280 / 0.5)",
                  background: "oklch(0.2 0.02 280 / 0.5)",
                }}
                onClick={() => {
                  setEditForm({
                    name: profile.name,
                    username: profile.username,
                    bio: profile.bio,
                    avatar: profile.avatar,
                  });
                  setEditOpen(true);
                }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </Button>
              <Button
                data-ocid="profile.boost_open_button"
                size="sm"
                className="gap-2 btn-gradient text-white border-none boost-pulse"
                onClick={() => setBoostOpen(true)}
              >
                <Zap className="w-3.5 h-3.5" /> Boost Followers
              </Button>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t"
          style={{ borderColor: "oklch(0.25 0.025 280 / 0.3)" }}
        >
          {[
            { label: "Posts", value: userPosts.length },
            { label: "Followers", value: profile.followers.toLocaleString() },
            { label: "Following", value: profile.following },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Level */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Creator Level
            </p>
            <p
              className="font-bold text-lg"
              style={{ color: "oklch(0.75 0.22 295)" }}
            >
              Lv.{levelInfo.level} — {levelInfo.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {profile.xp.toLocaleString()} XP
            </p>
            <p className="text-xs text-muted-foreground">
              Next: {levelInfo.nextXp.toLocaleString()} XP
            </p>
          </div>
        </div>
        <Progress
          value={levelInfo.progress}
          className="h-2"
          style={{ background: "oklch(0.2 0.02 280)" }}
        />
      </div>

      {/* Achievements */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          🏆 Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((ach, idx) => (
            <div
              key={ach.id}
              data-ocid={`achievements.item.${idx + 1}`}
              className={`glass-card-light p-3 text-center transition-all duration-300 ${
                ach.unlocked
                  ? "ring-1 ring-purple-500/30"
                  : "opacity-40 grayscale"
              }`}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <p className="text-xs font-semibold text-foreground leading-tight">
                {ach.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {ach.description}
              </p>
              {ach.unlocked && (
                <div
                  className="mt-2 text-xs"
                  style={{ color: "oklch(0.65 0.2 175)" }}
                >
                  ✓ Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Grid className="w-4 h-4" /> Posts
        </h2>
        {userPosts.length === 0 ? (
          <p
            data-ocid="profile.posts.empty_state"
            className="text-muted-foreground text-sm text-center py-4"
          >
            No posts yet
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {userPosts.map((post, idx) => (
              <button
                type="button"
                key={post.id}
                data-ocid={`profile.posts.item.${idx + 1}`}
                onClick={() => setDetailPost(post)}
                className="aspect-square rounded-xl overflow-hidden group"
              >
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post Detail View */}
      {detailPost && (
        <PostDetailView
          post={posts.find((p) => p.id === detailPost.id) ?? detailPost}
          posts={userPosts}
          onClose={() => setDetailPost(null)}
          onNavigate={setDetailPost}
        />
      )}

      {/* Boost Modal */}
      <Dialog open={boostOpen} onOpenChange={setBoostOpen}>
        <DialogContent
          data-ocid="profile.boost.modal"
          style={{
            background: "oklch(0.16 0.018 280)",
            border: "1px solid oklch(0.3 0.03 280 / 0.4)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Boost Followers
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Choose a boost package to instantly grow your audience.
          </p>
          <div className="grid gap-3 py-2">
            {[
              {
                label: "MIN Boost",
                amount: 1000,
                icon: "⚡",
                desc: "Great for kickstarting growth",
                gradient:
                  "linear-gradient(135deg, oklch(0.55 0.2 240), oklch(0.5 0.22 210))",
                ocid: "profile.boost.min_button",
              },
              {
                label: "MEDIUM Boost",
                amount: 10000,
                icon: "🔥",
                desc: "Most popular choice",
                gradient:
                  "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.55 0.22 240))",
                badge: "Most Popular",
                ocid: "profile.boost.medium_button",
              },
              {
                label: "MAX Boost",
                amount: 100000,
                icon: "🚀",
                desc: "Go viral instantly",
                gradient:
                  "linear-gradient(135deg, oklch(0.7 0.2 80), oklch(0.65 0.2 50))",
                ocid: "profile.boost.max_button",
              },
            ].map(({ label, amount, icon, desc, gradient, badge, ocid }) => (
              <button
                type="button"
                key={label}
                data-ocid={ocid}
                onClick={() => handleBoost(amount)}
                className="relative flex items-center gap-4 p-4 rounded-xl text-white text-left hover:opacity-90 active:scale-98 transition-all duration-150"
                style={{ background: gradient }}
              >
                <span className="text-3xl">{icon}</span>
                <div className="flex-1">
                  <p className="font-bold">{label}</p>
                  <p className="text-sm opacity-80">{desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    +{amount.toLocaleString()}
                  </p>
                  <p className="text-xs opacity-70">followers</p>
                </div>
                {badge && (
                  <span className="absolute top-2 right-2 text-xs bg-white/20 rounded-full px-2 py-0.5">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              data-ocid="profile.boost.cancel_button"
              variant="ghost"
              onClick={() => setBoostOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          data-ocid="profile.edit.modal"
          style={{
            background: "oklch(0.16 0.018 280)",
            border: "1px solid oklch(0.3 0.03 280 / 0.4)",
          }}
          className="max-w-lg"
        >
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm text-muted-foreground">Name</Label>
              <Input
                data-ocid="profile.edit.name_input"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Username</Label>
              <Input
                data-ocid="profile.edit.username_input"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, username: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Bio</Label>
              <Textarea
                data-ocid="profile.edit.bio_input"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, bio: e.target.value }))
                }
                className="mt-1 resize-none"
                rows={2}
              />
            </div>

            {/* Avatar Options */}
            <div>
              <Label className="text-sm text-muted-foreground">
                Profile Picture
              </Label>
              <div className="flex items-center gap-2 mt-2 mb-3">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={editForm.avatar} />
                  <AvatarFallback>{editForm.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: "url" as const, label: "URL" },
                    { id: "upload" as const, label: "Upload" },
                    { id: "preset" as const, label: "Presets" },
                  ].map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      data-ocid={`profile.edit.avatar_${tab.id}_tab`}
                      onClick={() => setAvatarTab(tab.id)}
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        avatarTab === tab.id
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={
                        avatarTab === tab.id
                          ? {
                              background:
                                "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.55 0.22 240))",
                            }
                          : {}
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {avatarTab === "url" && (
                <Input
                  data-ocid="profile.edit.avatar_url_input"
                  placeholder="https://..."
                  value={
                    editForm.avatar.startsWith("data:") ? "" : editForm.avatar
                  }
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, avatar: e.target.value }))
                  }
                />
              )}

              {avatarTab === "upload" && (
                <div>
                  <input
                    ref={avatarFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    data-ocid="profile.edit.avatar_upload_button"
                    variant="outline"
                    className="w-full gap-2"
                    style={{ borderColor: "oklch(0.35 0.03 280 / 0.5)" }}
                    onClick={() => avatarFileRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" /> Choose from Gallery
                  </Button>
                </div>
              )}

              {avatarTab === "preset" && (
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AVATARS.map((p, i) => (
                    <button
                      type="button"
                      key={p.seed}
                      data-ocid={`profile.edit.preset_avatar.${i + 1}`}
                      onClick={() =>
                        setEditForm((f) => ({
                          ...f,
                          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`,
                        }))
                      }
                      className="flex flex-col items-center gap-1 group"
                    >
                      <Avatar
                        className={`w-10 h-10 transition-all duration-150 ${
                          editForm.avatar.includes(p.seed)
                            ? "ring-2 ring-purple-400 scale-110"
                            : "group-hover:scale-105"
                        }`}
                      >
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`}
                        />
                        <AvatarFallback>{p.label[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground leading-tight text-center">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="profile.cancel_button"
              variant="ghost"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="profile.save_button"
              className="btn-gradient text-white border-none"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
