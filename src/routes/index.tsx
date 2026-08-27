import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, Mail, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, summarise research and chat with an AI workplace assistant in one clean, professional workspace.",
      },
      { property: "og:title", content: "Workplace AI — Productivity Assistant Dashboard" },
      {
        property: "og:description",
        content:
          "Draft emails, summarise research and chat with an AI workplace assistant in one clean, professional workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Turn a purpose, context and a few key points into a polished workplace email in the tone you need.",
    action: "Draft an email",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description:
      "Summarise a topic or a pasted article into a summary, key insights, important points and recommendations.",
    action: "Start researching",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Workplace Chatbot",
    description:
      "Brainstorm, plan, write and think out loud with an assistant tuned for professional work.",
    action: "Open chat",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <section className="rounded-lg border border-border bg-card p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your AI workplace productivity assistant. Write clearer emails, get to the point of a
          dense topic faster, and think through work with an assistant built for professional
          communication — no setup, no accounts.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Draft an email <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Ask the assistant
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, description, action }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-secondary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              {action}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
