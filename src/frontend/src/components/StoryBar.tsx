import { Plus } from "lucide-react";
import { useRef } from "react";
import { useApp } from "../context/AppContext";
import type { Story } from "../context/AppContext";

interface Props {
  onStoryClick: (story: Story, index: number) => void;
}

export default function StoryBar({ onStoryClick }: Props) {
  const { profile, stories, addStory } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddStory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addStory({
        id: `story-${Date.now()}`,
        userId: "me",
        username: profile.username,
        avatar: profile.avatar,
        imageUrl: ev.target?.result as string,
        createdAt: Date.now(),
        viewCount: 0,
        viewed: false,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Group stories by userId, show one per user (latest)
  const storyMap = new Map<string, Story>();
  for (const s of stories) {
    if (
      !storyMap.has(s.userId) ||
      s.createdAt > (storyMap.get(s.userId)?.createdAt ?? 0)
    ) {
      storyMap.set(s.userId, s);
    }
  }
  const uniqueStories = Array.from(storyMap.values());

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Add story */}
      <div className="flex-shrink-0">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAddStory}
        />
        <button
          type="button"
          data-ocid="story.add.button"
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center relative"
            style={{
              background: "oklch(0.18 0.02 280)",
              border: "2px dashed oklch(0.45 0.15 295 / 0.6)",
            }}
          >
            <img
              src={profile.avatar}
              alt=""
              className="w-full h-full rounded-full object-cover opacity-60"
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.55 0.22 240))",
              }}
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground w-16 text-center truncate">
            Your story
          </span>
        </button>
      </div>

      {uniqueStories.map((story, idx) => (
        <button
          key={story.id}
          type="button"
          onClick={() => onStoryClick(story, idx)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div
            className="w-16 h-16 rounded-full p-0.5"
            style={{
              background: story.viewed
                ? "oklch(0.3 0.02 280)"
                : "linear-gradient(135deg, oklch(0.65 0.2 50), oklch(0.6 0.22 295), oklch(0.6 0.2 210))",
            }}
          >
            <img
              src={story.avatar}
              alt={story.username}
              className="w-full h-full rounded-full object-cover"
              style={{ background: "oklch(0.15 0.018 280)" }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-16 text-center truncate">
            {story.username.replace("@", "")}
          </span>
        </button>
      ))}
    </div>
  );
}
