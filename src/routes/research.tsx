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
  component: ResearchAssistant;
});

function ResearchAssistant() {
  return null;
}
