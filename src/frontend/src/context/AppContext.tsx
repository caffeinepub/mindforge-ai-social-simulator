import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export interface CommentItem {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface PostItem {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: CommentItem[];
  shares: number;
  saves: number;
  views: number;
  reach: number;
  impressions: number;
  followersGained: number;
  timestamp: number;
  engagementScore: number;
  likedByUser: boolean;
  savedByUser: boolean;
  isTrending: boolean;
}

export interface NotificationItem {
  id: string;
  icon: string;
  message: string;
  timestamp: number;
  type:
    | "follower"
    | "like"
    | "comment"
    | "viral"
    | "achievement"
    | "boost"
    | "dm";
}

export interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: number;
}

export interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  messages: Message[];
}

export interface Profile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  xp: number;
  level: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface AnalyticsData {
  followersGainedToday: number;
  totalLikesToday: number;
  totalCommentsToday: number;
  engagementRate: number;
  followerGrowth: number[];
  postEngagement: { label: string; likes: number; comments: number }[];
  topPostId: string | null;
}

interface AppContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  posts: PostItem[];
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, "id" | "timestamp">) => void;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  unreadDMs: number;
  setUnreadDMs: React.Dispatch<React.SetStateAction<number>>;
  analyticsData: AnalyticsData;
  setAnalyticsData: React.Dispatch<React.SetStateAction<AnalyticsData>>;
  boostFollowers: (amount: number) => void;
}

export const SAMPLE_COMMENTS = [
  "Nice post!",
  "Amazing content!",
  "Love this! ❤️",
  "🔥🔥🔥",
  "Keep posting!",
  "Absolutely stunning!",
  "This made my day!",
  "So inspiring!",
  "Incredible shot!",
  "Goals! 🙌",
];

export const SAMPLE_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
];

export const PRESET_AVATARS = [
  { seed: "artist", label: "🎨 Artist" },
  { seed: "gamer", label: "🎮 Gamer" },
  { seed: "explorer", label: "🌍 Explorer" },
  { seed: "creator", label: "✨ Creator" },
  { seed: "athlete", label: "🏆 Athlete" },
  { seed: "techie", label: "💻 Techie" },
  { seed: "foodie", label: "🍕 Foodie" },
  { seed: "musician", label: "🎵 Musician" },
  { seed: "photographer", label: "📸 Photographer" },
  { seed: "traveler", label: "✈️ Traveler" },
];

const SAMPLE_USERS = ["@samchen", "@miatorres", "@jordankim", "@rileylee"];

const makeComment = (index: number): CommentItem => ({
  id: `c-${Date.now()}-${index}`,
  username: SAMPLE_USERS[index % 4],
  text: SAMPLE_COMMENTS[index % SAMPLE_COMMENTS.length],
  timestamp: Date.now() - (8 - index) * 60000,
});

const INITIAL_POSTS: PostItem[] = [
  {
    id: "p1",
    authorName: "Alex Rivera",
    authorUsername: "@alexrivera",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    imageUrl: "https://picsum.photos/seed/travel1/600/400",
    caption:
      "Golden hour at Santorini — nothing beats this view 🌅 #travel #wanderlust",
    likes: 482,
    comments: [0, 1, 2, 3, 4].map(makeComment),
    shares: 34,
    saves: 87,
    views: 5820,
    reach: 4200,
    impressions: 7340,
    followersGained: 48,
    timestamp: Date.now() - 3600000,
    engagementScore: 482 + 5 * 2 + 34 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: true,
  },
  {
    id: "p2",
    authorName: "Sam Chen",
    authorUsername: "@samchen",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    imageUrl: "https://picsum.photos/seed/city2/600/400",
    caption:
      "Late night city lights always hit different 🌆 #citylife #nightphotography",
    likes: 317,
    comments: [1, 2, 3].map(makeComment),
    shares: 21,
    saves: 52,
    views: 3910,
    reach: 2800,
    impressions: 4920,
    followersGained: 23,
    timestamp: Date.now() - 7200000,
    engagementScore: 317 + 3 * 2 + 21 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: true,
  },
  {
    id: "p3",
    authorName: "Mia Torres",
    authorUsername: "@miatorres",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
    imageUrl: "https://picsum.photos/seed/nature3/600/400",
    caption:
      "Morning hike to the summit 🏔️ The struggle is always worth it #hiking #nature",
    likes: 201,
    comments: [2, 3, 4, 5].map(makeComment),
    shares: 15,
    saves: 33,
    views: 2450,
    reach: 1900,
    impressions: 3100,
    followersGained: 14,
    timestamp: Date.now() - 10800000,
    engagementScore: 201 + 4 * 2 + 15 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: false,
  },
  {
    id: "p4",
    authorName: "Alex Rivera",
    authorUsername: "@alexrivera",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    imageUrl: "https://picsum.photos/seed/food4/600/400",
    caption:
      "Brunch goals achieved 🥑🍳 Recipe drop coming soon! #foodie #brunch",
    likes: 156,
    comments: [0, 1, 2].map(makeComment),
    shares: 8,
    saves: 21,
    views: 1820,
    reach: 1400,
    impressions: 2240,
    followersGained: 9,
    timestamp: Date.now() - 86400000,
    engagementScore: 156 + 3 * 2 + 8 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: false,
  },
  {
    id: "p5",
    authorName: "Jordan Kim",
    authorUsername: "@jordankim",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    imageUrl: "https://picsum.photos/seed/portrait5/600/400",
    caption:
      "Self-portrait series: chapter 3 📸 Exploring light and shadow #photography #portrait",
    likes: 89,
    comments: [3, 4].map(makeComment),
    shares: 5,
    saves: 12,
    views: 1040,
    reach: 820,
    impressions: 1310,
    followersGained: 4,
    timestamp: Date.now() - 172800000,
    engagementScore: 89 + 2 * 2 + 5 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: false,
  },
];

const INITIAL_CONVOS: Conversation[] = [
  {
    id: "conv1",
    name: "Sam Chen",
    username: "@samchen",
    avatar: SAMPLE_AVATARS[0],
    messages: [
      {
        id: "m1",
        text: "Hey I love your posts!",
        sent: false,
        timestamp: Date.now() - 600000,
      },
    ],
  },
  {
    id: "conv2",
    name: "Mia Torres",
    username: "@miatorres",
    avatar: SAMPLE_AVATARS[1],
    messages: [
      {
        id: "m2",
        text: "Your content is amazing!",
        sent: false,
        timestamp: Date.now() - 1200000,
      },
    ],
  },
  {
    id: "conv3",
    name: "Jordan Kim",
    username: "@jordankim",
    avatar: SAMPLE_AVATARS[2],
    messages: [
      {
        id: "m3",
        text: "Followed you today!",
        sent: false,
        timestamp: Date.now() - 3600000,
      },
    ],
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    icon: "📸",
    title: "First Post",
    description: "Publish your first post",
    unlocked: true,
  },
  {
    id: "a2",
    icon: "🎯",
    title: "100 Followers",
    description: "Reach 100 followers",
    unlocked: true,
  },
  {
    id: "a3",
    icon: "🔥",
    title: "First Viral Post",
    description: "Get a post trending",
    unlocked: true,
  },
  {
    id: "a4",
    icon: "🚀",
    title: "10k Followers",
    description: "Reach 10,000 followers",
    unlocked: false,
  },
  {
    id: "a5",
    icon: "💯",
    title: "100k Likes",
    description: "Accumulate 100,000 total likes",
    unlocked: false,
  },
  {
    id: "a6",
    icon: "⭐",
    title: "Influencer",
    description: "Reach creator level 10",
    unlocked: false,
  },
  {
    id: "a7",
    icon: "💬",
    title: "Conversation Starter",
    description: "Get 500 total comments",
    unlocked: false,
  },
  {
    id: "a8",
    icon: "🌍",
    title: "Global Reach",
    description: "Reach 50k followers",
    unlocked: false,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    name: "Alex Rivera",
    username: "@alexrivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    bio: "Content creator • Travel • Photography 🌍",
    followers: 4820,
    following: 312,
    postsCount: 5,
    xp: 2400,
    level: 3,
  });

  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n0",
      icon: "🔥",
      message: "Your post 'Golden hour at Santorini' is trending!",
      timestamp: Date.now() - 300000,
      type: "viral",
    },
    {
      id: "n1",
      icon: "👤",
      message: "@samchen started following you",
      timestamp: Date.now() - 600000,
      type: "follower",
    },
    {
      id: "n2",
      icon: "❤️",
      message: "@miatorres liked your post",
      timestamp: Date.now() - 900000,
      type: "like",
    },
  ]);
  const [conversations, setConversations] =
    useState<Conversation[]>(INITIAL_CONVOS);
  const [achievements, setAchievements] =
    useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [unreadDMs, setUnreadDMs] = useState(3);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    followersGainedToday: 142,
    totalLikesToday: 847,
    totalCommentsToday: 93,
    engagementRate: 8.4,
    followerGrowth: [4200, 4310, 4450, 4520, 4600, 4720, 4820],
    postEngagement: INITIAL_POSTS.map((p) => ({
      label: `${p.caption.slice(0, 18)}...`,
      likes: p.likes,
      comments: p.comments.length,
    })),
    topPostId: "p1",
  });

  const notifIdRef = useRef(10);

  const addNotification = useCallback(
    (notif: Omit<NotificationItem, "id" | "timestamp">) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: `n-${notifIdRef.current++}`,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
    },
    [],
  );

  const boostFollowers = useCallback(
    (amount: number) => {
      const steps = 20;
      const perStep = Math.floor(amount / steps);
      let added = 0;
      const interval = setInterval(() => {
        added += perStep;
        setProfile((prev) => ({
          ...prev,
          followers: prev.followers + perStep,
        }));
        if (added >= amount) clearInterval(interval);
      }, 60);
      addNotification({
        icon: "🚀",
        message: `Boost activated! You gained ${amount.toLocaleString()} followers!`,
        type: "boost",
      });
    },
    [addNotification],
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        posts,
        setPosts,
        notifications,
        addNotification,
        conversations,
        setConversations,
        achievements,
        setAchievements,
        unreadDMs,
        setUnreadDMs,
        analyticsData,
        setAnalyticsData,
        boostFollowers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
