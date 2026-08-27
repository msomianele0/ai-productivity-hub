/**
 * AI provider boundary.
 *
 * The app currently runs on a deterministic demo provider so it works with no
 * backend, no keys and no accounts. To connect a real model later, replace the
 * body of `complete()` with a call to your endpoint — every feature already
 * sends a structured { system, user } prompt, so no UI changes are needed.
 */

import type { StructuredPrompt } from "./prompts";

export const AI_MODE: "demo" | "live" = "demo";

export interface CompleteOptions {
  prompt: StructuredPrompt;
  kind: "email" | "research" | "chat";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function field(user: string, label: string): string {
  const match = user.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?:\\n[A-Z][A-Z /]+:|\\n\\n|$)`));
  return match?.[1]?.trim() ?? "";
}

function bulletise(text: string): string[] {
  return text
    .split(/\n|;|•|- /)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter((line) => line.length > 2);
}

function demoEmail(user: string): string {
  const purpose = field(user, "PURPOSE") || "the request below";
  const context = field(user, "RECIPIENT / CONTEXT") || "the team";
  const points = bulletise(field(user, "KEY POINTS TO COVER"));
  const tone = field(user, "TONE").split("—")[0]?.trim() || "formal";

  const opening =
    tone === "friendly"
      ? `Hi there,\n\nHope your week is going well.`
      : tone === "persuasive"
        ? `Hello,\n\nI'd like to bring something forward that I think is worth your time.`
        : `Dear colleague,\n\nI am writing regarding ${purpose}.`;

  const body = points.length
    ? points.map((p) => `• ${p.charAt(0).toUpperCase()}${p.slice(1)}`).join("\n")
    : `• ${purpose}`;

  const close =
    tone === "persuasive"
      ? "Could we take fifteen minutes this week to agree on next steps?"
      : "Please let me know if you would like me to expand on any of the above.";

  return [
    `Subject: ${purpose.replace(/\.$/, "").slice(0, 70)}`,
    "",
    opening,
    "",
    `Context: ${context}`,
    "",
    body,
    "",
    close,
    "",
    "Best regards,\n[Your name]",
    "",
    "— Demo response. Connect an AI model to generate live drafts.",
  ].join("\n");
}

export interface ResearchResult {
  summary: string;
  insights: string;
  points: string;
  recommendations: string;
}

function demoResearch(user: string): ResearchResult {
  const topic = field(user, "TOPIC OR QUESTION") || "the topic";
  return {
    summary: `${topic} is best approached by first defining the outcome you need, then narrowing to the two or three variables that actually move it. Most teams over-collect information and under-decide. A short written brief, a small set of measurable criteria and one owner per workstream typically outperform a longer study. Treat this demo output as a scaffold and replace it with sourced findings before circulating it.`,
    insights: [
      "The decision is usually constrained by time and ownership, not by missing information.",
      "Stakeholders align faster on written criteria than on discussion.",
      "Small reversible pilots surface more signal than extended analysis.",
      "Documenting assumptions makes later disagreement productive rather than personal.",
    ].join("\n"),
    points: [
      `Scope: clarify what is explicitly out of scope for ${topic}.`,
      "Constraints: budget, timeline, headcount and compliance limits.",
      "Risks: single points of failure and dependencies outside your control.",
      "Measurement: define success metrics before starting work.",
    ].join("\n"),
    recommendations: [
      "Write a one-page brief with the decision, options and criteria.",
      "Name a single accountable owner and a review date.",
      "Run a two-week pilot before committing budget.",
      "Circulate findings for written comment rather than a meeting.",
      "Re-verify every claim against a primary source.",
    ].join("\n"),
  };
}

function demoChat(user: string): string {
  const message = field(user, "CURRENT USER MESSAGE") || "your question";
  return [
    `Here's a practical way to approach "${message.slice(0, 120)}":`,
    "",
    "1. Define the outcome — what does a good result look like in one sentence?",
    "2. Strip it back — list only the steps that change that outcome.",
    "3. Assign and date — one owner and one deadline per step.",
    "4. Close the loop — a short written summary beats another meeting.",
    "",
    "Tell me more about your constraints and I can tighten this into a concrete plan.",
    "",
    "(Demo response — connect an AI model for live answers.)",
  ].join("\n");
}

export async function completeText({ prompt, kind }: CompleteOptions): Promise<string> {
  await sleep(700);
  if (kind === "email") return demoEmail(prompt.user);
  return demoChat(prompt.user);
}

export async function completeResearch(prompt: StructuredPrompt): Promise<ResearchResult> {
  await sleep(900);
  return demoResearch(prompt.user);
}
