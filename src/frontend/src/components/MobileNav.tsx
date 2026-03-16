import {
  BarChart2,
  Compass,
  Home,
  MessageCircle,
  TrendingUp,
  User,
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "home", icon: Home, ocid: "nav.home_link" },
  { id: "trending", icon: TrendingUp, ocid: "nav.trending_link" },
  { id: "explore", icon: Compass, ocid: "nav.explore_link" },
  { id: "messages", icon: MessageCircle, ocid: "nav.messages_link" },
  { id: "profile", icon: User, ocid: "nav.profile_link" },
  { id: "analytics", icon: BarChart2, ocid: "nav.analytics_link" },
];

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function MobileNav({ activePage, onNavigate }: Props) {
  const { unreadDMs } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex"
      style={{
        background: "oklch(0.13 0.016 280 / 0.97)",
        borderTop: "1px solid oklch(0.25 0.025 280 / 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      {navItems.map(({ id, icon: Icon, ocid }) => (
        <button
          type="button"
          key={id}
          data-ocid={ocid}
          onClick={() => onNavigate(id)}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative"
        >
          <div className="relative">
            <Icon
              className={`w-5 h-5 ${activePage === id ? "text-purple-400" : "text-muted-foreground"}`}
            />
            {id === "messages" && unreadDMs > 0 && (
              <span
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-white text-[8px] flex items-center justify-center"
                style={{ background: "oklch(0.55 0.25 295)" }}
              >
                {unreadDMs > 9 ? "9" : unreadDMs}
              </span>
            )}
          </div>
          {activePage === id && (
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "oklch(0.6 0.22 295)" }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
