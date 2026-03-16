import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import MobileNav from "./components/MobileNav";
import NotificationsSidebar from "./components/NotificationsSidebar";
import Sidebar from "./components/Sidebar";
import { AppProvider } from "./context/AppContext";
import { useIsMobile } from "./hooks/use-mobile";
import { useEngagementSimulator } from "./hooks/useEngagementSimulator";
import Analytics from "./pages/Analytics";
import Explore from "./pages/Explore";
import HomeFeed from "./pages/HomeFeed";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Trending from "./pages/Trending";

function AppShell() {
  const [activePage, setActivePage] = useState("home");
  const isMobile = useIsMobile();

  useEngagementSimulator();

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
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {!isMobile && (
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      )}

      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: isMobile ? 0 : "240px",
          marginRight: isMobile ? 0 : "288px",
          paddingBottom: isMobile ? "80px" : 0,
        }}
      >
        {renderPage()}
      </main>

      {!isMobile && <NotificationsSidebar />}
      {isMobile && (
        <MobileNav activePage={activePage} onNavigate={setActivePage} />
      )}

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
