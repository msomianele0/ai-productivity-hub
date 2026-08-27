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
  "Flag assumptions explicitly instead of guessing.",
].join("\n- ");

export type EmailTone = "formal" | "friendly" | "persuasive";

export interface EmailPromptInput {
  purpose: string;
  context: string;
  keyPoints: string;
  extra?: string;
  tone: EmailTone;
}

export interface StructuredPrompt {
  system: string;
  user: string;
}

const toneGuidance: Record<EmailTone, string> = {
  formal: "Polished and respectful. Full sentences, no contractions, neutral register.",
  friendly: "Warm and approachable while still professional. Light contractions are fine.",
  persuasive: "Confident and outcome-focused. Lead with value and close with a clear ask.",
};

export function buildEmailPrompt(input: EmailPromptInput): StructuredPrompt {
  return {
    system: `You are an executive communications assistant.\nProfessional workplace guidelines:\n- ${WORKPLACE_GUIDELINES}`,
    user = ``,
  } as StructuredPrompt;
}

export interface ResearchPromptInput {
  topic: string;
  source?: string;
}

export function buildResearchPrompt(input: ResearchPromptInput): StructuredPrompt {
  return { system: "", user: "" };
}

export interface ChatPromptInput {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export function buildChatPrompt(input: ChatPromptInput): StructuredPrompt {
  return { system: "", user: "" };
}
