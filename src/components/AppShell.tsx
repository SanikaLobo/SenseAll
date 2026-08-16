import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Mic, Hand, Grid2x2, Vibrate, History, Settings, Moon, Sun, Type } from "lucide-react";
import type { ReactNode } from "react";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/voice", label: "Voice", icon: Mic },
  { to: "/isl", label: "ISL", icon: Hand },
  { to: "/braille", label: "Braille", icon: Grid2x2 },
  { to: "/haptics", label: "Haptics", icon: Vibrate },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { prefs, update } = usePrefs();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const cycleTextScale = () => {
    const steps = [100, 115, 130];
    const next = steps[(steps.indexOf(prefs.textScale) + 1) % steps.length] ?? 100;
    update({ textScale: next });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/home" className="flex items-center gap-3" aria-label="SenseAll home">
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"
            >
              <span className="font-display text-xl font-semibold">S</span>
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">SenseAll</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={cycleTextScale}
              aria-label={`Text size ${prefs.textScale} percent. Activate to change.`}
            >
              <Type aria-hidden="true" />
              <span className="hidden sm:inline">{prefs.textScale}%</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => update({ theme: prefs.theme === "dark" ? "light" : "dark" })}
              aria-label={`Switch to ${prefs.theme === "dark" ? "light" : "dark"} mode`}
            >
              {prefs.theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
              <span className="hidden sm:inline">{prefs.theme === "dark" ? "Light" : "Dark"}</span>
            </Button>
          </div>
        </div>

        <nav aria-label="Main" className="border-t border-border">
          <ul className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-2 py-2 sm:px-4">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(`${to}/`);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-base font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-base text-muted-foreground sm:px-6">
          SenseAll — communication without barriers. Prototype features are labelled clearly and
          nothing is recorded without a visible indicator.
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-base font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{description}</p>
    </div>
  );
}
