// Mutable algorithm weights — updated by algorithm update events
export const ALGORITHM_WEIGHTS = {
  shares: 3,
  comments: 2,
  likes: 1,
  saves: 1.5,
};

// Viral score formula using current weights
export function computeViralScore(post: {
  likes: number;
  comments: { length: number };
  shares: number;
  saves: number;
  views: number;
}): number {
  const engRate =
    post.views > 0
      ? (post.likes + post.comments.length + post.shares) / post.views
      : 0;
  return (
    ALGORITHM_WEIGHTS.likes * post.likes +
    ALGORITHM_WEIGHTS.comments * post.comments.length +
    ALGORITHM_WEIGHTS.shares * post.shares +
    ALGORITHM_WEIGHTS.saves * post.saves +
    engRate * 1000
  );
}

// Stage thresholds: score needed to reach each stage
export const VIRAL_STAGE_THRESHOLDS = [0, 300, 1200, 4000, 12000];

export function getViralStage(score: number): number {
  let stage = 0;
  for (let i = 1; i < VIRAL_STAGE_THRESHOLDS.length; i++) {
    if (score >= VIRAL_STAGE_THRESHOLDS[i]) stage = i;
  }
  return stage;
}

// Displayed as hints in post detail — NOT stage labels
export function getMomentumSignal(stage: number): string | null {
  switch (stage) {
    case 1:
      return "Picking up traction";
    case 2:
      return "Trending fast";
    case 3:
      return "Exploding in reach";
    case 4:
      return "🔥 Trending Worldwide";
    default:
      return null;
  }
}

// Post Strength score 0-100 based on caption, hashtags, time of day
export function computePostStrength(
  caption: string,
  hashtags: string[],
): number {
  let score = 0;
  // Caption length (max 40 points)
  const words = caption.trim().split(/\s+/).filter(Boolean).length;
  score += Math.min(40, words * 4);
  // Hashtag count (max 30 points) — sweet spot is 3-5 tags
  const tagCount = hashtags.length;
  if (tagCount >= 3 && tagCount <= 5) score += 30;
  else if (tagCount === 2 || tagCount === 6) score += 20;
  else if (tagCount === 1 || tagCount === 7) score += 10;
  else if (tagCount > 7) score += 5; // too many = spam signal
  // Simulated posting time score (max 30 points) — peak hours give bonus
  const hour = new Date().getHours();
  if ((hour >= 9 && hour <= 11) || (hour >= 18 && hour <= 21)) score += 30;
  else if (hour >= 12 && hour <= 17) score += 20;
  else score += 5;
  return Math.min(100, score);
}

// Algorithm update events
export const ALGORITHM_UPDATE_EVENTS: {
  message: string;
  apply: () => void;
}[] = [
  {
    message: "Platform Update: Shares are now more important for reach.",
    apply: () => {
      ALGORITHM_WEIGHTS.shares = 5;
      ALGORITHM_WEIGHTS.likes = 1;
    },
  },
  {
    message: "Platform Update: Comments are being weighted higher this week.",
    apply: () => {
      ALGORITHM_WEIGHTS.comments = 4;
      ALGORITHM_WEIGHTS.shares = 3;
    },
  },
  {
    message: "Platform Update: Saves now boost distribution significantly.",
    apply: () => {
      ALGORITHM_WEIGHTS.saves = 3;
      ALGORITHM_WEIGHTS.comments = 2;
    },
  },
  {
    message: "Platform Update: Likes carry more weight in the algorithm today.",
    apply: () => {
      ALGORITHM_WEIGHTS.likes = 2.5;
      ALGORITHM_WEIGHTS.saves = 1.5;
    },
  },
  {
    message: "Platform Update: Early engagement in the first hour is critical.",
    apply: () => {
      ALGORITHM_WEIGHTS.shares = 4;
      ALGORITHM_WEIGHTS.comments = 3;
    },
  },
  {
    message: "Platform Update: Hashtag relevance is now factored into reach.",
    apply: () => {
      ALGORITHM_WEIGHTS.saves = 2;
      ALGORITHM_WEIGHTS.likes = 1.5;
    },
  },
];
