/**
 * Structured prompt templates for every AI feature.
 *
 * Each builder returns a { system, user } pair so a real AI API can be wired in
 * later (see src/lib/ai.ts) without changing any UI code.
 */

export const WORKPLACE_GUIDELINES = [
  "Write for a professional workplace audience.",
  "Be concise, clear and action-oriented.",
  "Avoid jargon, hype, emojis and filler.",
  "Never invent names, figures, dates or commitments that were not provided.",
  "State assumptions explicitly instead of guessing.",
].join("\n- ");

export interface StructuredPrompt {
  system: string;
  user: string;
}

export type EmailTone = "formal" | "friendly" | "persuasive";

export const EMAIL_TONES: { value: EmailTone; label: string; hint: string }[] = [
  { value: "formal", label: "Formal", hint: "Polished, neutral, no contractions" },
  { value: "friendly", label: "Friendly", hint: "Warm but still professional" },
  { value: "persuasive", label: "Persuasive", hint: "Confident, value-led, clear ask" },
];

const TONE_GUIDANCE: Record<EmailTone, string> = {
  formal: "Polished and respectful. Full sentences, no contractions, neutral register.",
  friendly: "Warm and approachable while still professional. Light contractions are fine.",
  persuasive: "Confident and outcome-focused. Lead with value, close with a clear ask.",
};

export interface EmailPromptInput {
  purpose: string;
  context: string;
  keyPoints: string;
  extra?: string;
  tone: EmailTone;
}

export function buildEmailPrompt(input: EmailPromptInput): StructuredPrompt {
  const system = [
    "You are an executive workplace communications assistant.",
    "Professional workplace guidelines:",
    `- ${WORKPLACE_GUIDELINES}`,
  ].join("\n");

  const user = [
    "TASK: Draft a workplace email.",
    "",
    `PURPOSE: ${input.purpose}`,
    `RECIPIENT / CONTEXT: ${input.context}`,
    `KEY POINTS TO COVER:\n${input.keyPoints}`,
    input.extra ? `ADDITIONAL INSTRUCTIONS: ${input.extra}` : "",
    "",
    `TONE: ${input.tone} — ${TONE_GUIDANCE[input.tone]}`,
    "",
    "OUTPUT FORMAT:",
    "Subject: <one concise subject line>",
    "",
    "<greeting>",
    "<2-4 short paragraphs or a tight bullet list covering every key point>",
    "<explicit next step or ask>",
    "<sign-off>",
    "",
    "Keep the whole email under 200 words. Return plain text only.",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

export interface ResearchPromptInput {
  topic: string;
  source?: string;
}

export function buildResearchPrompt(input: ResearchPromptInput): StructuredPrompt {
  const system = [
    "You are a workplace research analyst supporting busy professionals.",
    "Professional workplace guidelines:",
    `- ${WORKPLACE_GUIDELINES}`,
    "If the provided material is insufficient, say so instead of speculating.",
  ].join("\n");

  const user = [
    "TASK: Research and summarise the topic below for a professional audience.",
    "",
    `TOPIC OR QUESTION: ${input.topic}`,
    input.source ? `SOURCE MATERIAL TO GROUND THE ANSWER IN:\n"""\n${input.source}\n"""` : "CONTEXT: No source material supplied — rely on general knowledge and label uncertainty.",
    "",
    "OUTPUT FORMAT — use exactly these four headed sections:",
    "## Summary — 3-5 sentences of plain-language overview.",
    "## Key Insights — 3-5 bullets, each a distinct non-obvious takeaway.",
    "## Important Points — 3-5 bullets of facts, constraints, risks or definitions.",
    "## Recommendations — 3-5 bullets of concrete next actions.",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function buildChatPrompt(message: string, history: ChatMessage[]): StructuredPrompt {
  const system = [
    "You are an AI workplace productivity assistant.",
    "You help with writing, brainstorming, research, planning and general professional questions.",
    "Professional workplace guidelines:",
    `- ${WORKPLACE_GUIDELINES}`,
    "Answer directly first, then add short supporting structure (bullets or numbered steps) when useful.",
    "Ask a clarifying question only when the request cannot be actioned as written.",
  ].join("\n");

  const transcript = history
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const user = [
    transcript ? `CONVERSATION SO FAR:\n${transcript}` : "",
    `CURRENT USER MESSAGE: ${message}`,
    "",
    "OUTPUT FORMAT: A focused reply under 180 words. Plain text with optional bullets.",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { system, user };
}

export const SUGGESTED_PROMPTS = [
  "Draft an agenda for a 30-minute project kickoff.",
  "Summarise this quarter's priorities into three themes.",
  "Help me give constructive feedback to a teammate.",
  "Turn these rough notes into clear meeting minutes.",
  "What questions should I ask in a vendor evaluation?",
];

export const RESPONSIBLE_AI_NOTICE =
  "AI-generated content may contain errors or omissions. Review outputs for accuracy, context, privacy and appropriateness before using them in professional settings. Do not enter confidential or sensitive information.";
