import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { useApp } from "../context/AppContext";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsSidebar() {
  const { notifications } = useApp();

  return (
    <aside
      data-ocid="notifications.panel"
      className="fixed right-0 top-0 h-screen w-72 flex flex-col py-6 px-4 z-20"
      style={{
        background: "oklch(0.13 0.016 280 / 0.95)",
        borderLeft: "1px solid oklch(0.25 0.025 280 / 0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-purple-400" />
        <h2 className="font-semibold text-foreground">Notifications</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {notifications.length}
        </span>
      </div>

      <ScrollArea className="flex-1 -mx-1 px-1">
        <div className="flex flex-col gap-2">
          {notifications.map((notif, idx) => (
            <div
              key={notif.id}
              data-ocid={idx === 0 ? "notifications.item.1" : undefined}
              className="glass-card-light p-3 flex gap-3 items-start notification-enter"
            >
              <span className="text-lg leading-none mt-0.5">{notif.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(notif.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
