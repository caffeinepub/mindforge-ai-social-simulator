import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import DramaModal from "./components/DramaModal";
import MobileNav from "./components/MobileNav";
import NotificationsSidebar from "./components/NotificationsSidebar";
import SaveIndicator from "./components/SaveIndicator";
import Sidebar from "./components/Sidebar";
import { AppProvider, useApp } from "./context/AppContext";
import { useIsMobile } from "./hooks/use-mobile";
import { useAIInfluencers } from "./hooks/useAIInfluencers";
import { useCollaborationSimulator } from "./hooks/useCollaborationSimulator";
import { type DramaEvent, useDramaEngine } from "./hooks/useDramaEngine";
import { useEngagementSimulator } from "./hooks/useEngagementSimulator";
import { useViralEngine } from "./hooks/useViralEngine";
import Analytics from "./pages/Analytics";
import CreatorHouses from "./pages/CreatorHouses";
import CreatorHub from "./pages/CreatorHub";
import Explore from "./pages/Explore";
import HashtagPage from "./pages/HashtagPage";
import HomeFeed from "./pages/HomeFeed";
import Leaderboard from "./pages/Leaderboard";
import LiveStream from "./pages/LiveStream";
import MerchStore from "./pages/MerchStore";
import Messages from "./pages/Messages";
import Monetization from "./pages/Monetization";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Trending from "./pages/Trending";
import ViralRoulette from "./pages/ViralRoulette";

function AppShell() {
  const { currentRoute, navigate, hideMobileNav, isNewUser } = useApp();
  const isMobile = useIsMobile();
  useEngagementSimulator();
  useAIInfluencers();
  useViralEngine();
  useCollaborationSimulator();

  const [activeDrama, setActiveDrama] = useState<DramaEvent | null>(null);
  useDramaEngine((event) => setActiveDrama(event));

  if (isNewUser) {
    return <Onboarding />;
  }

  const activePage = currentRoute.page;

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <HomeFeed />;
      case "trending":
        return <Trending />;
      case "explore":
        return <Explore />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile />;
      case "analytics":
        return <Analytics />;
      case "monetization":
        return <Monetization />;
      case "merch-store":
        return <MerchStore />;
      case "leaderboard":
        return <Leaderboard />;
      case "houses":
        return <CreatorHouses />;
      case "hub":
        return <CreatorHub />;
      case "creator-studio":
        return <HomeFeed />; // placeholder until CreatorStudio page exists
      case "challenges":
        return <HomeFeed />; // placeholder
      case "user-profile":
        return <Profile userId={currentRoute.userId} />;
      case "hashtag":
        return <HashtagPage tag={currentRoute.tag ?? ""} />;
      case "live-stream":
        return <LiveStream />;
      case "viral-roulette":
        return <ViralRoulette />;
      default:
        return <HomeFeed />;
    }
  };

  const handleNavigate = (page: string) => navigate(page);

  return (
    <div className="min-h-screen flex">
      {!isMobile && (
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      )}
      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: isMobile ? 0 : "240px",
          marginRight: isMobile ? 0 : "288px",
          paddingBottom: isMobile && !hideMobileNav ? "80px" : 0,
        }}
      >
        {renderPage()}
      </main>
      {!isMobile && <NotificationsSidebar />}
      {isMobile && !hideMobileNav && (
        <MobileNav activePage={activePage} onNavigate={handleNavigate} />
      )}
      <SaveIndicator />
      <DramaModal event={activeDrama} onClose={() => setActiveDrama(null)} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.02 280 / 0.95)",
            border: "1px solid oklch(0.35 0.03 280 / 0.4)",
            color: "oklch(0.97 0.01 260)",
            backdropFilter: "blur(20px)",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
