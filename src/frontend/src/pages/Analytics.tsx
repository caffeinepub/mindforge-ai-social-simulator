import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../context/AppContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const tooltipStyle = {
  background: "oklch(0.16 0.018 280)",
  border: "1px solid oklch(0.3 0.03 280 / 0.4)",
  borderRadius: "10px",
  color: "oklch(0.97 0.01 260)",
};

export default function Analytics() {
  const { analyticsData, posts } = useApp();

  const followerData = analyticsData.followerGrowth.map((v, i) => ({
    day: DAYS[i % DAYS.length],
    followers: v,
  }));

  const engagementData = posts.map((p, i) => ({
    name: `Post ${i + 1}`,
    likes: p.likes,
    comments: p.comments.length,
    shares: p.shares,
  }));

  const topPost =
    posts.find((p) => p.id === analyticsData.topPostId) ?? posts[0];

  const statCards = [
    {
      label: "Followers Gained Today",
      value: analyticsData.followersGainedToday.toLocaleString(),
      icon: "👤",
      ocid: "analytics.followers_card",
    },
    {
      label: "Total Likes Today",
      value: analyticsData.totalLikesToday.toLocaleString(),
      icon: "❤️",
      ocid: "analytics.likes_card",
    },
    {
      label: "Total Comments Today",
      value: analyticsData.totalCommentsToday.toLocaleString(),
      icon: "💬",
      ocid: "analytics.comments_card",
    },
    {
      label: "Engagement Rate",
      value: `${analyticsData.engagementRate.toFixed(1)}%`,
      icon: "📈",
      ocid: "analytics.engagement_card",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon, ocid }) => (
          <div key={label} data-ocid={ocid} className="glass-card p-4">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Top Performing Post */}
      {topPost && (
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">🏆 Top Performing Post</h2>
          <div className="flex gap-4">
            <img
              src={topPost.imageUrl}
              alt=""
              className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1 line-clamp-2">
                {topPost.caption}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                {topPost.authorUsername}
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Likes", value: topPost.likes.toLocaleString() },
                  {
                    label: "Comments",
                    value: topPost.comments.length.toString(),
                  },
                  { label: "Shares", value: topPost.shares.toString() },
                  {
                    label: "Score",
                    value: Math.floor(topPost.engagementScore).toLocaleString(),
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.75 0.22 295)" }}
                    >
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follower Growth */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-5">📈 Follower Growth</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={followerData}>
            <defs>
              <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="oklch(0.6 0.22 295)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="oklch(0.6 0.22 295)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.025 280 / 0.4)"
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="followers"
              stroke="oklch(0.6 0.22 295)"
              strokeWidth={2}
              fill="url(#colorFollowers)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Post Engagement — Likes */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-5">📊 Likes per Post</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={engagementData}>
            <defs>
              <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.6 0.22 295)"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.65 0.2 210)"
                  stopOpacity={0.7}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.025 280 / 0.4)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="likes"
              fill="url(#colorLikes)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comments per Post */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-5">💬 Comments per Post</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={engagementData}>
            <defs>
              <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.65 0.2 175)"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.65 0.2 210)"
                  stopOpacity={0.7}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.025 280 / 0.4)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar
              dataKey="comments"
              fill="url(#colorComments)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Trends */}
      <div className="glass-card p-5">
        <h2 className="font-semibold mb-5">
          🔥 Engagement Trends (Likes vs Shares)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={engagementData}>
            <defs>
              <linearGradient id="colorLikes2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.6 0.22 295)"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.55 0.22 295)"
                  stopOpacity={0.7}
                />
              </linearGradient>
              <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="oklch(0.65 0.2 50)"
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.65 0.2 50)"
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.25 0.025 280 / 0.4)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "oklch(0.55 0.02 270)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              wrapperStyle={{ color: "oklch(0.75 0.02 270)", fontSize: 12 }}
            />
            <Bar
              dataKey="likes"
              fill="url(#colorLikes2)"
              radius={[3, 3, 0, 0]}
              name="Likes"
            />
            <Bar
              dataKey="shares"
              fill="url(#colorShares)"
              radius={[3, 3, 0, 0]}
              name="Shares"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
