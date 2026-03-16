import { Eye, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Story } from "../context/AppContext";

interface Props {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, startIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(currentIndex);
  const storiesLenRef = useRef(stories.length);
  currentIndexRef.current = currentIndex;
  storiesLenRef.current = stories.length;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const DURATION = 5000;

  const goNext = useCallback(() => {
    if (currentIndexRef.current < storiesLenRef.current - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onCloseRef.current();
    }
  }, []);

  const goPrev = useCallback(() => {
    if (currentIndexRef.current > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentIndex triggers interval reset intentionally
  useEffect(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = (elapsed / DURATION) * 100;
      if (pct >= 100) {
        goNext();
      } else {
        setProgress(pct);
      }
    }, 50);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, goNext]);

  const story = stories[currentIndex];
  if (!story) return null;

  const timeRemaining = Math.max(
    0,
    24 - Math.floor((Date.now() - story.createdAt) / 60000),
  );

  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ")
      goNext();
  };

  return (
    <div
      data-ocid="story.viewer.panel"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      <div className="relative w-full max-w-sm h-full max-h-[85vh] flex flex-col">
        {/* Progress bars */}
        <div className="flex gap-1 px-4 pt-4 pb-2 absolute top-0 left-0 right-0 z-10">
          {stories.map((s, i) => (
            <div
              key={s.id}
              className="flex-1 h-0.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.3)" }}
            >
              <div
                className="h-full rounded-full transition-none"
                style={{
                  background: "white",
                  width:
                    i < currentIndex
                      ? "100%"
                      : i === currentIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 pt-10 pb-3 absolute top-0 left-0 right-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <img
            src={story.avatar}
            alt=""
            className="w-9 h-9 rounded-full border-2 border-white/50"
          />
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">{story.username}</p>
            <p className="text-white/60 text-xs">{timeRemaining}h remaining</p>
          </div>
          <span className="text-white/70 text-xs bg-black/30 px-2 py-0.5 rounded-full">
            24h
          </span>
          <button
            type="button"
            data-ocid="story.viewer.close_button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image navigation — use button for accessibility */}
        <button
          type="button"
          className="flex-1 relative cursor-pointer w-full text-left"
          aria-label="Tap to navigate story"
          onClick={(e) => {
            const rect = (
              e.currentTarget as HTMLButtonElement
            ).getBoundingClientRect();
            if (e.clientX < rect.left + rect.width / 2) goPrev();
            else goNext();
          }}
          onKeyDown={handleImageKeyDown}
          style={{ background: "none", border: "none", padding: 0 }}
        >
          <img
            src={story.imageUrl}
            alt="story"
            className="w-full h-full object-cover"
            style={{ borderRadius: "12px" }}
          />
        </button>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        >
          <div className="flex items-center gap-1.5 text-white/80 text-sm">
            <Eye className="w-4 h-4" />
            <span>{story.viewCount.toLocaleString()} views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
