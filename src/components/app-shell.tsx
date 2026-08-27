import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, LayoutDashboard, Mail, Menu, Search, ShieldAlert, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { RESPONSIBLE_AI_NOTICE } from "@/lib/prompts";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "Workplace Chatbot", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "border-border bg-secondary text-foreground"
                : "text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-md bg-foreground text-background">
        <Bot className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight text-foreground">
          Workplace AI
        </span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </div>
  );
}

export function ResponsibleAiNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-2.5 rounded-md border border-border bg-secondary/50 p-3 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI. </span>
        {RESPONSIBLE_AI_NOTICE}
      </p>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Mail;
}) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
          <Icon className="size-5" />
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r border-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-5">
        <Brand />
        <div className="mt-8 flex-1">
          <p className="mb-3 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <NavLinks />
        </div>
        <p className="border-t border-border pt-4 text-[0.7rem] leading-relaxed text-muted-foreground">
          Demo mode — outputs are generated locally. Connect an AI model to go live.
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="border-b border-border bg-sidebar px-4 py-4 lg:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        )}

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-5xl">
            <ResponsibleAiNotice />
          </div>
        </footer>
      </div>
    </div>
  );
}
