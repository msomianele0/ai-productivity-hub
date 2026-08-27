import { createFileRoute } from "@tanstack/react-router";
import { Copy, Mail, RefreshCw, RotateCcw, Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-shell";
import { completeText } from "@/lib/ai";
import { EMAIL_TONES, buildEmailPrompt, type EmailTone } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from a purpose, recipient context and key points, in a formal, friendly or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Workplace AI" },
      {
        property: "og:description",
        content:
          "Generate professional workplace emails from a purpose, recipient context and key points.",
      },
    ],
  }),
  component: EmailGenerator,
});

const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-foreground/40 focus:outline-hidden focus:ring-3 focus:ring-ring/25";

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [extra, setExtra] = useState("");
  const [tone, setTone] = useState<EmailTone>("formal");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const canGenerate = purpose.trim().length > 2 && keyPoints.trim().length > 2;

  async function generate() {
    if (!canGenerate) {
      toast.error("Add an email purpose and at least one key point.");
      return;
    }
    setLoading(true);
    try {
      const prompt = buildEmailPrompt({ purpose, context, keyPoints, extra, tone });
      setDraft(await completeText({ prompt, kind: "email" }));
    } catch {
      toast.error("Could not generate the email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPurpose("");
    setContext("");
    setKeyPoints("");
    setExtra("");
    setTone("formal");
    setDraft("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      toast.success("Email copied to clipboard.");
    } catch {
      toast.error("Copying is blocked in this browser.");
    }
  }

  return (
    <div>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what the email needs to achieve and the assistant will draft it. Every draft stays fully editable before you send it."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Email purpose
              </span>
              <input
                className={fieldClass}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Request a deadline extension on the Q3 report"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Recipient / context
              </span>
              <input
                className={fieldClass}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="My manager, who is already aware of the delay"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Key points</span>
              <textarea
                className={cn(fieldClass, "min-h-32 resize-y")}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"One point per line:\nData arrived four days late\nNeed two extra days\nDraft is 80% complete"}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">
                Additional instructions{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </span>
              <textarea
                className={cn(fieldClass, "min-h-20 resize-y")}
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="Keep it under five sentences. Suggest Thursday for a check-in."
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-foreground">Tone</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {EMAIL_TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={cn(
                      "rounded-md border px-3 py-2.5 text-left transition-colors",
                      tone === t.value
                        ? "border-foreground bg-secondary"
                        : "border-border hover:bg-secondary/60",
                    )}
                  >
                    <span className="block text-sm font-medium text-foreground">{t.label}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                      {t.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Sparkle className="size-4" />
              )}
              {loading ? "Generating…" : "Generate email"}
            </button>
          </div>
        </section>

        <section className="flex flex-col rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Generated email
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copy}
                disabled={!draft}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <Copy className="size-3.5" /> Copy
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={!draft || loading}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw className="size-3.5" /> Regenerate
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <RotateCcw className="size-3.5" /> Clear
              </button>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your draft will appear here, ready to edit."
            className={cn(fieldClass, "mt-4 min-h-[26rem] flex-1 resize-y font-mono text-[0.8rem] leading-relaxed")}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Edit freely — changes stay in this text area until you regenerate or clear.
          </p>
        </section>
      </div>
    </div>
  );
}
