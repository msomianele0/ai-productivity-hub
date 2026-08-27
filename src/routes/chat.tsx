import { createFileRoute } from "@tanstack/react-router";
import { Bot, RefreshCw, SendHorizontal, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-shell";
import { completeText } from "@/lib/ai";
import { SUGGESTED_PROMPTS, buildChatPrompt, type ChatMessage } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with an AI assistant tuned for workplace productivity: brainstorming, writing help, research, planning and professional questions.",
      },
      { property: "og:title", content: "AI Workplace Chatbot — Workplace AI" },
      {
        property: "og:description",
        content:
          "Chat with an AI assistant tuned for workplace brainstorming, writing, research and planning.",
      },
    ],
  }),
  component: Chatbot,
});

const newId = () => Math.random().toString(36).slice(2);

function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const history = messages;
    const userMessage: ChatMessage = { id: newId(), role: "user", content };
    setMessages([...history, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await completeText({
        prompt: buildChatPrompt(content, history),
        kind: "chat",
      });
      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: reply }]);
    } catch {
      toast.error("The assistant could not reply. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={Bot}
        title="AI Workplace Chatbot"
        description="A working assistant for brainstorming, writing, research and planning. Messages are kept for this session only."
      />

      <section className="flex h-[34rem] flex-col overflow-hidden rounded-lg border border-border bg-card sm:h-[38rem]">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="text-sm font-semibold tracking-tight text-foreground">Session chat</p>
          <button
            type="button"
            onClick={() => setMessages([])}
            disabled={!messages.length}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
          >
            <Trash2 className="size-3.5" /> Clear chat
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {!messages.length && (
            <div className="mx-auto max-w-md py-6 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                <Bot className="size-5" />
              </span>
              <p className="mt-4 text-sm font-medium text-foreground">
                What are you working on today?
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Pick a starting point or type your own question.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                  <Bot className="size-4" />
                </span>
              )}
              <div
                className={cn(
                  "max-w-[42rem] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground",
                )}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                  <User className="size-4" />
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
                <Bot className="size-4" />
              </span>
              <RefreshCw className="size-3.5 animate-spin" /> Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Ask about writing, planning, research or anything work-related…"
              className="min-h-11 flex-1 resize-none rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/40 focus:outline-hidden focus:ring-3 focus:ring-ring/25"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={loading || !input.trim()}
              className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <SendHorizontal className="size-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
