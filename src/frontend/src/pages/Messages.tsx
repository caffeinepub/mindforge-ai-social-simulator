import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import type { Conversation } from "../context/AppContext";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h`;
}

export default function Messages() {
  const { conversations, setConversations, setUnreadDMs } = useApp();
  const [activeConvo, setActiveConvo] = useState<Conversation>(
    conversations[0],
  );
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updated = conversations.find((c) => c.id === activeConvo.id);
    if (updated) setActiveConvo(updated);
  }, [conversations, activeConvo.id]);

  useEffect(() => {
    setUnreadDMs(0);
  }, [setUnreadDMs]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvo.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  text: inputText.trim(),
                  sent: true,
                  timestamp: Date.now(),
                },
              ],
            }
          : c,
      ),
    );
    setInputText("");
    setTimeout(scrollToBottom, 50);
  };

  return (
    <div className="h-[calc(100vh-2rem)] py-6 px-4 flex gap-4 max-w-4xl mx-auto">
      <div className="glass-card w-72 flex-shrink-0 flex flex-col overflow-hidden">
        <div
          className="p-4 border-b"
          style={{ borderColor: "oklch(0.25 0.025 280 / 0.3)" }}
        >
          <h2 className="font-semibold">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conv, idx) => (
            <button
              type="button"
              key={conv.id}
              data-ocid={`messages.conversation.item.${idx + 1}`}
              onClick={() => {
                setActiveConvo(conv);
                setTimeout(scrollToBottom, 50);
              }}
              className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left ${
                activeConvo.id === conv.id ? "bg-white/10" : ""
              }`}
            >
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={conv.avatar} />
                <AvatarFallback>{conv.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{conv.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {conv.messages.length > 0
                      ? timeAgo(
                          conv.messages[conv.messages.length - 1].timestamp,
                        )
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.messages.length > 0
                    ? conv.messages[conv.messages.length - 1].text
                    : "No messages"}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        <div
          className="flex items-center gap-3 p-4 border-b"
          style={{ borderColor: "oklch(0.25 0.025 280 / 0.3)" }}
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={activeConvo.avatar} />
            <AvatarFallback>{activeConvo.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{activeConvo.name}</p>
            <p className="text-xs text-muted-foreground">
              {activeConvo.username}
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConvo.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sent
                    ? "text-white rounded-br-sm"
                    : "glass-card-light text-foreground rounded-bl-sm"
                }`}
                style={
                  msg.sent
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.55 0.2 240))",
                      }
                    : {}
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div
          className="p-4 border-t flex gap-3"
          style={{ borderColor: "oklch(0.25 0.025 280 / 0.3)" }}
        >
          <Input
            data-ocid="messages.message_input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ background: "oklch(0.18 0.02 280 / 0.5)" }}
          />
          <Button
            data-ocid="messages.send_button"
            size="icon"
            className="btn-gradient text-white border-none flex-shrink-0"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
