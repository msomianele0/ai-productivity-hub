import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw, RotateCcw, Search, Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-shell";
import { completeResearch, type ResearchResult } from "@/lib/ai";
import { buildResearchPrompt } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content:
          "Summarise a topic or pasted article into a summary, key insights, important points and recommendations you can edit and copy.",
      },
      { property: "og:title", content: "AI Research Assistant — Workplace AI" },
      {
        property: "og:description",
        content:
          "Summarise a topic or article into summary, insights, important points and recommendations.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/40 focus:outline-hidden focus:ring-3 focus:ring-ring/25";

const SECTIONS: { key: keyof ResearchResult; label: string; hint: string }[] = [
  { key: "summary", label: "Summary", hint: "Plain-language overview" },
  { key: "insights", label: "Key Insights", hint: "Non-obvious takeaways" },
  { key: "points", label: "Important Points", hint: "Facts, constraints and risks" },
  { key: "recommendations", label: "Recommendations", hint: "Concrete next actions" },
];

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (topic.trim().length < 3) {
      toast.error("Enter a research topic or question first.");
      return;
    }
    setLoading(true);
    try {
      setResult(await completeResearch(buildResearchPrompt({ topic, source })));
    } catch {
      toast.error("Could not complete the research. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTopic("");
    setSource("");
    setResult(null);
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } catch {
      toast.error("Copying is blocked in this browser.");
    }
  }

  return (
    <div>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask a question or paste an article. You get an organised, editable brief instead of a wall of text."
      />

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Research topic or question
            </span>
            <input
              className={fieldClass}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="How should we structure a hybrid work policy?"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">
              Article or text <span className="font-normal text-muted-foreground">(optional)</span>
            </span>
            <textarea
              className={cn(fieldClass, "min-h-28 resize-y")}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Paste the source material you want summarised."
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Sparkle className="size-4" />
            )}
            {loading ? "Researching…" : "Research & summarise"}
          </button>
          {result && (
            <>
              <button
                type="button"
                onClick={run}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <RefreshCw className="size-4" /> Regenerate
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <RotateCcw className="size-4" /> Clear
              </button>
            </>
          )}
        </div>
      </section>

      {result && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {SECTIONS.map(({ key, label, hint }) => (
            <section key={key} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">{label}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(result[key], label)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Copy className="size-3.5" /> Copy
                </button>
              </div>
              <textarea
                value={result[key]}
                onChange={(e) => setResult({ ...result, [key]: e.target.value })}
                className={cn(fieldClass, "mt-3 min-h-44 resize-y text-[0.8rem] leading-relaxed")}
              />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
