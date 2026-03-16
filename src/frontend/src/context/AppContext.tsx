import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AI_CREATORS } from "../utils/aiInfluencers";
import type { AICreator } from "../utils/aiInfluencers";
import type { SimulatedPostData } from "../utils/simulatedUsers";

export interface CommentReply {
  id: string;
  username: string;
  userId?: string;
  avatar?: string;
  text: string;
  timestamp: number;
}

export interface CommentItem {
  id: string;
  username: string;
  userId?: string;
  avatar?: string;
  text: string;
  timestamp: number;
  replies?: CommentReply[];
}

export interface PostItem {
  id: string;
  authorName: string;
  authorUsername: string;
  authorUserId?: string;
  authorAvatar: string;
  imageUrl: string;
  images?: string[];
  caption: string;
  hashtags?: string[];
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
  viralStage?: number;
  viralScore?: number;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  imageUrl: string;
  createdAt: number;
  viewCount: number;
  viewed: boolean;
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
    | "dm"
    | "follower_gain"
    | "tip"
    | "sponsorship"
    | "merch_sale"
    | "collab_request"
    | "collab_accepted";
  collabId?: string;
  collabCreatorId?: string;
  collabCreatorName?: string;
  collabCreatorAvatar?: string;
}

export interface CollabRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
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

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  xp: number;
  level: number;
  niche: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
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

export interface Route {
  page: string;
  userId?: string;
  tag?: string;
}

export interface SponsorshipDeal {
  id: string;
  brandName: string;
  dealValue: number;
  tier: "small" | "ambassador" | "premium";
  status: "active" | "pending";
  acceptedAt?: number;
}

export interface MerchProduct {
  id: string;
  name: string;
  price: number;
  emoji: string;
  totalSales: number;
  totalRevenue: number;
}

export interface MonetizationData {
  totalEarnings: number;
  adRevenue: number;
  tipRevenue: number;
  merchRevenue: number;
  sponsorRevenue: number;
  dailyEarnings: number[];
  monthlyEarnings: number[];
  topEarningPosts: { postId: string; label: string; earnings: number }[];
  activeSponsorships: SponsorshipDeal[];
}

interface AppContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  posts: PostItem[];
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>;
  savedPosts: Set<string>;
  likedPosts: Set<string>;
  followedUserIds: Set<string>;
  stories: Story[];
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
  monetization: MonetizationData;
  setMonetization: React.Dispatch<React.SetStateAction<MonetizationData>>;
  merchProducts: MerchProduct[];
  setMerchProducts: React.Dispatch<React.SetStateAction<MerchProduct[]>>;
  addMerchSale: (productId: string) => void;
  acceptSponsorship: (dealId: string) => void;
  aiCreators: AICreator[];
  pendingCollabs: CollabRequest[];
  acceptCollab: (collabId: string) => void;
  boostFollowers: (amount: number) => void;
  savePost: (id: string) => void;
  unsavePost: (id: string) => void;
  likePost: (id: string) => void;
  unlikePost: (id: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  addStory: (story: Story) => void;
  addCommentReply: (
    postId: string,
    commentId: string,
    reply: CommentReply,
  ) => void;
  addSimulatedPost: (post: SimulatedPostData) => PostItem;
  currentRoute: Route;
  navigate: (page: string, params?: Partial<Route>) => void;
}

export const SAMPLE_COMMENTS = [
  "Nice post!",
  "Amazing content!",
  "Love this! \u2764\ufe0f",
  "\ud83d\udd25\ud83d\udd25\ud83d\udd25",
  "Keep posting!",
  "Absolutely stunning!",
  "This made my day!",
  "So inspiring!",
  "Incredible shot!",
  "Goals! \ud83d\ude4c",
  "Need this in my life!",
  "You're so talented!",
  "Obsessed with this \ud83d\ude0d",
  "More of this please!",
];

export const SAMPLE_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
];

export const PRESET_AVATARS = [
  { seed: "artist", label: "\ud83c\udfa8 Artist" },
  { seed: "gamer", label: "\ud83c\udfae Gamer" },
  { seed: "explorer", label: "\ud83c\udf0d Explorer" },
  { seed: "creator", label: "\u2728 Creator" },
  { seed: "athlete", label: "\ud83c\udfc6 Athlete" },
  { seed: "techie", label: "\ud83d\udcbb Techie" },
  { seed: "foodie", label: "\ud83c\udf55 Foodie" },
  { seed: "musician", label: "\ud83c\udfb5 Musician" },
  { seed: "photographer", label: "\ud83d\udcf8 Photographer" },
  { seed: "traveler", label: "\u2708\ufe0f Traveler" },
];

const SAMPLE_USERS = ["@samchen", "@miatorres", "@jordankim", "@rileylee"];
const SAMPLE_USER_IDS = ["1", "2", "3", "4"];

const makeComment = (index: number): CommentItem => ({
  id: `c-${Date.now()}-${index}`,
  username: SAMPLE_USERS[index % 4],
  userId: SAMPLE_USER_IDS[index % 4],
  avatar: SAMPLE_AVATARS[index % 4],
  text: SAMPLE_COMMENTS[index % SAMPLE_COMMENTS.length],
  timestamp: Date.now() - (8 - index) * 60000,
  replies: [],
});

const INITIAL_POSTS: PostItem[] = [
  {
    id: "p1",
    authorName: "Alex Rivera",
    authorUsername: "@alexrivera",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    imageUrl: "https://picsum.photos/seed/travel1/600/400",
    images: [
      "https://picsum.photos/seed/travel1/600/400",
      "https://picsum.photos/seed/travel2/600/400",
      "https://picsum.photos/seed/travel3/600/400",
    ],
    caption:
      "Golden hour at Santorini \u2014 nothing beats this view \ud83c\udf05 #travel #wanderlust",
    hashtags: ["#travel", "#wanderlust"],
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
    viralStage: 3,
    viralScore: 5000,
  },
  {
    id: "p2",
    authorName: "Sam Chen",
    authorUsername: "@samchen",
    authorUserId: "1",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam",
    imageUrl: "https://picsum.photos/seed/city2/600/400",
    images: ["https://picsum.photos/seed/city2/600/400"],
    caption:
      "Late night city lights always hit different \ud83c\udf06 #citylife #nightphotography",
    hashtags: ["#citylife", "#nightphotography"],
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
    viralStage: 2,
    viralScore: 1500,
  },
  {
    id: "p3",
    authorName: "Mia Torres",
    authorUsername: "@miatorres",
    authorUserId: "2",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
    imageUrl: "https://picsum.photos/seed/nature3/600/400",
    images: [
      "https://picsum.photos/seed/nature3/600/400",
      "https://picsum.photos/seed/nature4/600/400",
    ],
    caption:
      "Morning hike to the summit \ud83c\udfd4\ufe0f The struggle is always worth it #hiking #nature",
    hashtags: ["#hiking", "#nature"],
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
    viralStage: 0,
    viralScore: 0,
  },
  {
    id: "p4",
    authorName: "Alex Rivera",
    authorUsername: "@alexrivera",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    imageUrl: "https://picsum.photos/seed/food4/600/400",
    images: ["https://picsum.photos/seed/food4/600/400"],
    caption:
      "Brunch goals achieved \ud83e\udd51\ud83c\udf73 Recipe drop coming soon! #foodie #brunch",
    hashtags: ["#foodie", "#brunch"],
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
    viralStage: 0,
    viralScore: 0,
  },
  {
    id: "p5",
    authorName: "Jordan Kim",
    authorUsername: "@jordankim",
    authorUserId: "3",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
    imageUrl: "https://picsum.photos/seed/portrait5/600/400",
    images: ["https://picsum.photos/seed/portrait5/600/400"],
    caption:
      "Self-portrait series: chapter 3 \ud83d\udcf8 Exploring light and shadow #photography #portrait",
    hashtags: ["#photography", "#portrait"],
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
    viralStage: 0,
    viralScore: 0,
  },
  {
    id: "p6",
    authorName: "Riley Lee",
    authorUsername: "@rileylee",
    authorUserId: "4",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riley",
    imageUrl: "https://picsum.photos/seed/fashion6/600/400",
    images: [
      "https://picsum.photos/seed/fashion6/600/400",
      "https://picsum.photos/seed/fashion7/600/400",
      "https://picsum.photos/seed/fashion8/600/400",
    ],
    caption:
      "New drop is live \u2728 Which look is your favorite? #fashion #style #ootd",
    hashtags: ["#fashion", "#style", "#ootd"],
    likes: 892,
    comments: [0, 1, 2, 3].map(makeComment),
    shares: 67,
    saves: 204,
    views: 12400,
    reach: 9800,
    impressions: 15600,
    followersGained: 112,
    timestamp: Date.now() - 1800000,
    engagementScore: 892 + 4 * 2 + 67 * 3,
    likedByUser: false,
    savedByUser: false,
    isTrending: true,
    viralStage: 4,
    viralScore: 15000,
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
    icon: "\ud83d\udcf8",
    title: "First Post",
    description: "Publish your first post",
    unlocked: true,
  },
  {
    id: "a2",
    icon: "\ud83d\udcac",
    title: "First Comment",
    description: "Leave your first comment",
    unlocked: false,
  },
  {
    id: "a3",
    icon: "\ud83d\udd04",
    title: "First Share",
    description: "Share your first post",
    unlocked: false,
  },
  {
    id: "a4",
    icon: "\ud83c\udfaf",
    title: "100 Followers",
    description: "Reach 100 followers",
    unlocked: true,
  },
  {
    id: "a5",
    icon: "\u2b50",
    title: "500 Followers",
    description: "Reach 500 followers",
    unlocked: true,
  },
  {
    id: "a6",
    icon: "\ud83c\udfc5",
    title: "1K Followers",
    description: "Reach 1,000 followers",
    unlocked: true,
  },
  {
    id: "a7",
    icon: "\ud83d\udc8e",
    title: "5K Followers",
    description: "Reach 5,000 followers",
    unlocked: false,
  },
  {
    id: "a8",
    icon: "\ud83d\ude80",
    title: "10K Followers",
    description: "Reach 10,000 followers",
    unlocked: false,
  },
  {
    id: "a9",
    icon: "\ud83d\udd25",
    title: "First Viral Post",
    description: "Get a post trending",
    unlocked: true,
  },
  {
    id: "a10",
    icon: "\ud83d\udcdd",
    title: "10 Posts Created",
    description: "Create 10 posts",
    unlocked: false,
  },
  {
    id: "a11",
    icon: "\u2764\ufe0f",
    title: "100 Likes Received",
    description: "Accumulate 100 total likes",
    unlocked: true,
  },
  {
    id: "a12",
    icon: "\ud83d\udc96",
    title: "1K Likes Received",
    description: "Accumulate 1,000 total likes",
    unlocked: false,
  },
  {
    id: "a13",
    icon: "\ud83d\udcc8",
    title: "Top Trending Post",
    description: "Have a post appear in trending",
    unlocked: true,
  },
  {
    id: "a14",
    icon: "\u26a1",
    title: "Creator Level 5",
    description: "Reach creator level 5",
    unlocked: false,
  },
  {
    id: "a15",
    icon: "\ud83d\udc51",
    title: "Creator Level 10",
    description: "Reach creator level 10",
    unlocked: false,
  },
];

const INITIAL_STORIES: Story[] = [
  {
    id: "s1",
    userId: "1",
    username: "@samchen",
    avatar: SAMPLE_AVATARS[0],
    imageUrl: "https://picsum.photos/seed/story1/400/700",
    createdAt: Date.now() - 300000,
    viewCount: 842,
    viewed: false,
  },
  {
    id: "s2",
    userId: "2",
    username: "@miatorres",
    avatar: SAMPLE_AVATARS[1],
    imageUrl: "https://picsum.photos/seed/story2/400/700",
    createdAt: Date.now() - 900000,
    viewCount: 1204,
    viewed: false,
  },
  {
    id: "s3",
    userId: "3",
    username: "@jordankim",
    avatar: SAMPLE_AVATARS[2],
    imageUrl: "https://picsum.photos/seed/story3/400/700",
    createdAt: Date.now() - 1800000,
    viewCount: 567,
    viewed: true,
  },
  {
    id: "s4",
    userId: "4",
    username: "@rileylee",
    avatar: SAMPLE_AVATARS[3],
    imageUrl: "https://picsum.photos/seed/story4/400/700",
    createdAt: Date.now() - 600000,
    viewCount: 2341,
    viewed: false,
  },
];

const buildDailyEarnings = (): number[] => {
  const base = [
    22, 28, 31, 25, 34, 38, 29, 42, 36, 44, 38, 47, 41, 35, 50, 46, 52, 48, 55,
    43, 58, 61, 54, 66, 59, 63, 68, 72, 65, 78,
  ];
  return base;
};

const buildMonthlyEarnings = (): number[] => [
  210, 265, 298, 312, 380, 425, 390, 468, 510, 545, 620, 720,
];

const INITIAL_MONETIZATION: MonetizationData = {
  totalEarnings: 1240.5,
  adRevenue: 820.0,
  tipRevenue: 245.5,
  merchRevenue: 175.0,
  sponsorRevenue: 0,
  dailyEarnings: buildDailyEarnings(),
  monthlyEarnings: buildMonthlyEarnings(),
  topEarningPosts: [
    {
      postId: "p6",
      label: "New drop is live ✨ Whic",
      earnings: (12400 * 7) / 1000,
    },
    {
      postId: "p1",
      label: "Golden hour at Santorini",
      earnings: (5820 * 7) / 1000,
    },
    {
      postId: "p2",
      label: "Late night city lights al",
      earnings: (3910 * 7) / 1000,
    },
  ],
  activeSponsorships: [],
};

const INITIAL_MERCH: MerchProduct[] = [
  {
    id: "m1",
    name: "MindForge Hoodie",
    price: 49.99,
    emoji: "👕",
    totalSales: 12,
    totalRevenue: 599.88,
  },
  {
    id: "m2",
    name: "Creator Cap",
    price: 24.99,
    emoji: "🧢",
    totalSales: 8,
    totalRevenue: 199.92,
  },
  {
    id: "m3",
    name: "Digital Creator Pack",
    price: 9.99,
    emoji: "💾",
    totalSales: 23,
    totalRevenue: 229.77,
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Rivera",
    username: "@alexrivera",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexrivera",
    bio: "Content creator \u2022 Travel \u2022 Photography \ud83c\udf0d",
    followers: 4820,
    following: 312,
    postsCount: 5,
    xp: 2400,
    level: 3,
    niche: "Tech",
  });
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const postsRef = useRef<PostItem[]>(INITIAL_POSTS);
  postsRef.current = posts;

  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(
    new Set(["1", "2"]),
  );
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n0",
      icon: "\ud83d\udd25",
      message: "Your post 'Golden hour at Santorini' is trending!",
      timestamp: Date.now() - 300000,
      type: "viral",
    },
    {
      id: "n1",
      icon: "\ud83d\udc64",
      message: "@samchen started following you",
      timestamp: Date.now() - 600000,
      type: "follower",
    },
    {
      id: "n2",
      icon: "\u2764\ufe0f",
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
  const [monetization, setMonetization] =
    useState<MonetizationData>(INITIAL_MONETIZATION);
  const [merchProducts, setMerchProducts] =
    useState<MerchProduct[]>(INITIAL_MERCH);
  const [currentRoute, setCurrentRoute] = useState<Route>({ page: "home" });
  const notifIdRef = useRef(10);

  const navigate = useCallback((page: string, params?: Partial<Route>) => {
    setCurrentRoute({ page, ...params });
  }, []);

  const addNotification = useCallback(
    (notif: Omit<NotificationItem, "id" | "timestamp">) => {
      if (
        notif.type === "collab_request" &&
        notif.collabId &&
        notif.collabCreatorId &&
        notif.collabCreatorName &&
        notif.collabCreatorAvatar
      ) {
        setPendingCollabs((prev) => [
          ...prev,
          {
            id: notif.collabId as string,
            creatorId: notif.collabCreatorId as string,
            creatorName: notif.collabCreatorName as string,
            creatorAvatar: notif.collabCreatorAvatar as string,
          },
        ]);
      }
      const newNotif: NotificationItem = {
        ...notif,
        id: `n-${notifIdRef.current++}`,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
    },
    [],
  );

  const addMerchSale = useCallback(
    (productId: string) => {
      setMerchProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                totalSales: p.totalSales + 1,
                totalRevenue: p.totalRevenue + p.price,
              }
            : p,
        ),
      );
      const product = merchProducts.find((p) => p.id === productId);
      if (product) {
        setMonetization((prev) => ({
          ...prev,
          merchRevenue: prev.merchRevenue + product.price,
          totalEarnings: prev.totalEarnings + product.price,
          dailyEarnings: prev.dailyEarnings.map((v, i) =>
            i === prev.dailyEarnings.length - 1 ? v + product.price : v,
          ),
        }));
        addNotification({
          icon: "🛍️",
          message: `Someone bought your ${product.name} for $${product.price}! 🎉`,
          type: "merch_sale",
        });
      }
    },
    [merchProducts, addNotification],
  );

  const acceptSponsorship = useCallback(
    (dealId: string) => {
      setMonetization((prev) => {
        const deal = prev.activeSponsorships.find((d) => d.id === dealId);
        if (!deal) return prev;
        addNotification({
          icon: "🤝",
          message: `You accepted the ${deal.brandName} sponsorship deal for $${deal.dealValue.toLocaleString()}!`,
          type: "sponsorship",
        });
        return {
          ...prev,
          sponsorRevenue: prev.sponsorRevenue + deal.dealValue,
          totalEarnings: prev.totalEarnings + deal.dealValue,
          activeSponsorships: prev.activeSponsorships.map((d) =>
            d.id === dealId
              ? { ...d, status: "active" as const, acceptedAt: Date.now() }
              : d,
          ),
        };
      });
    },
    [addNotification],
  );

  const savePost = useCallback((id: string) => {
    setSavedPosts((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, savedByUser: true, saves: p.saves + 1 } : p,
      ),
    );
  }, []);

  const unsavePost = useCallback((id: string) => {
    setSavedPosts((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, savedByUser: false, saves: Math.max(0, p.saves - 1) }
          : p,
      ),
    );
  }, []);

  const likePost = useCallback((id: string) => {
    setLikedPosts((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likedByUser: true, likes: p.likes + 1 } : p,
      ),
    );
  }, []);

  const unlikePost = useCallback((id: string) => {
    setLikedPosts((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likedByUser: false, likes: Math.max(0, p.likes - 1) }
          : p,
      ),
    );
  }, []);

  const followUser = useCallback((userId: string) => {
    setFollowedUserIds((prev) => {
      const s = new Set(prev);
      s.add(userId);
      return s;
    });
    setProfile((p) => ({ ...p, following: p.following + 1 }));
  }, []);

  const unfollowUser = useCallback((userId: string) => {
    setFollowedUserIds((prev) => {
      const s = new Set(prev);
      s.delete(userId);
      return s;
    });
    setProfile((p) => ({ ...p, following: Math.max(0, p.following - 1) }));
  }, []);

  const addStory = useCallback((story: Story) => {
    setStories((prev) => [story, ...prev]);
  }, []);

  const addCommentReply = useCallback(
    (postId: string, commentId: string, reply: CommentReply) => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, replies: [...(c.replies ?? []), reply] }
                    : c,
                ),
              }
            : p,
        ),
      );
    },
    [],
  );

  const [pendingCollabs, setPendingCollabs] = useState<CollabRequest[]>([]);

  const acceptCollab = useCallback(
    (collabId: string) => {
      const collab = pendingCollabs.find((c) => c.id === collabId);
      if (!collab) return;
      const creator = AI_CREATORS.find((c) => c.id === collab.creatorId);
      if (!creator) return;
      const combinedReach = Math.floor(
        (profile.followers + creator.followerCount) / 10,
      );
      const imgSeed = Date.now() % 1000;
      const imageUrl = `https://picsum.photos/seed/${imgSeed}/600/600`;
      const newPost: PostItem = {
        id: `collab-${collabId}`,
        authorName: `${profile.name} & ${creator.name}`,
        authorUsername: "@collab",
        authorUserId: creator.id,
        authorAvatar: creator.avatar,
        imageUrl,
        images: [imageUrl],
        caption: `🤝 Collab post with ${creator.name}! Two creators, one incredible post. #collab #creators`,
        hashtags: ["#collab", "#creators"],
        likes: Math.floor(combinedReach * 0.08),
        comments: [],
        shares: Math.floor(combinedReach * 0.02),
        saves: Math.floor(combinedReach * 0.01),
        views: combinedReach * 2,
        reach: combinedReach,
        impressions: combinedReach * 3,
        followersGained: Math.floor(combinedReach * 0.005),
        timestamp: Date.now(),
        engagementScore: Math.floor(combinedReach * 0.1),
        likedByUser: false,
        savedByUser: false,
        isTrending: true,
      };
      setPosts((prev) => [newPost, ...prev]);
      setPendingCollabs((prev) => prev.filter((c) => c.id !== collabId));
      addNotification({
        icon: "🚀",
        message: `Collab post with ${creator.name} is live! Combined reach: ${Math.floor(combinedReach / 1000)}K`,
        type: "collab_accepted",
      });
    },
    [pendingCollabs, profile, addNotification],
  );

  const addSimulatedPost = useCallback((sp: SimulatedPostData): PostItem => {
    const existing = postsRef.current.find((p) => p.id === sp.id);
    if (existing) return existing;
    const postItem: PostItem = {
      id: sp.id,
      authorName: sp.authorName,
      authorUsername: sp.authorUsername,
      authorUserId: sp.authorId,
      authorAvatar: sp.authorAvatar,
      imageUrl: sp.imageUrl,
      images: sp.images,
      caption: sp.caption,
      hashtags: sp.hashtags,
      likes: sp.likes,
      comments: Array.from({ length: Math.min(sp.commentCount, 5) }, (_, i) =>
        makeComment(i),
      ),
      shares: sp.shares,
      saves: sp.saves,
      views: sp.views,
      reach: sp.reach,
      impressions: sp.impressions,
      followersGained: sp.followersGained,
      timestamp: sp.timestamp,
      engagementScore: sp.engagementScore,
      likedByUser: false,
      savedByUser: false,
      isTrending: sp.isTrending,
      viralStage: 0,
      viralScore: 0,
    };
    setPosts((prev) => {
      if (prev.find((p) => p.id === sp.id)) return prev;
      return [...prev, postItem];
    });
    return postItem;
  }, []);

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
        icon: "\ud83d\ude80",
        message: `Boost activated! You gained ${amount.toLocaleString()} followers!`,
        type: "boost",
      });
    },
    [addNotification],
  );

  const TWENTY_FOUR_MIN = 24 * 60 * 1000;
  const activeStories = stories.filter(
    (s) => Date.now() - s.createdAt < TWENTY_FOUR_MIN,
  );

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        posts,
        setPosts,
        savedPosts,
        likedPosts,
        followedUserIds,
        stories: activeStories,
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
        monetization,
        setMonetization,
        merchProducts,
        setMerchProducts,
        addMerchSale,
        acceptSponsorship,
        aiCreators: AI_CREATORS,
        pendingCollabs,
        acceptCollab,
        boostFollowers,
        savePost,
        unsavePost,
        likePost,
        unlikePost,
        followUser,
        unfollowUser,
        addStory,
        addCommentReply,
        addSimulatedPost,
        currentRoute,
        navigate,
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

export function extractHashtags(caption: string): string[] {
  const matches = caption.match(/#\w+/g);
  return matches ? matches.map((t) => t.toLowerCase()) : [];
}
