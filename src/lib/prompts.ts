/**
 * Structured prompt templates.
 *
 * Each builder returns a { system, user } pair so a real AI API can be wired in
 * later (see src/lib/ai.ts) without touching the UI.
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
  return {
    system: `You are an executive workplace communications assistant.
Professional workplace guidelines:
- ${WORKPLACE_GUIDELINES}`,
    user = "" as never,
  } as unknown as StructuredPrompt;
}

export interface ResearchPromptInput {
  topic: string;
  source?: string;
}

export function buildResearchPrompt(input: ResearchPromptInput): StructuredPrompt {
  return { system: "", user: "" };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function buildChatPrompt(message: string, history: ChatMessage[]): StructuredPrompt {
  return { system: "", user: "" };
}
