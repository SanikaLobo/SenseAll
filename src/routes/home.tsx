import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, Hand, Grid2x2, Vibrate, ArrowRight, History as HistoryIcon, Settings } from "lucide-react";
import { usePrefs, useHistory } from "@/lib/prefs";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "SenseAll Home — Choose how you communicate" },
      {
        name: "description",
        content:
          "Your SenseAll hub: context-aware voice, Indian Sign Language, Braille and haptic feedback in one accessible place.",
      },
      { property: "og:title", content: "SenseAll Home — Choose how you communicate" },
      {
        property: "og:description",
        content: "Voice, ISL, Braille and haptics in one accessible communication hub.",
      },
    ],
  }),
  component: HomePage,
});

const MODULES = [
  {
    to: "/voice",
    icon: Mic,
    name: "Voice",
    tagline: "Context-aware speech assistance",
    detail: "Speak naturally. SenseAll suggests corrections instead of assuming.",
  },
  {
    to: "/isl",
    icon: Hand,
    name: "ISL",
    tagline: "Translate between text and Indian Sign Language",
    detail: "Text to sign now, sign to text interface ready for recognition models.",
  },
  {
    to: "/braille",
    icon: Grid2x2,
    name: "Braille",
    tagline: "Read and write using Braille",
    detail: "Real Grade 1 cell mapping with a digital Braille keyboard.",
  },
  {
    to: "/haptics",
    icon: Vibrate,
    name: "Haptics",
    tagline: "Feel important interactions through touch",
    detail: "Vibration patterns for confirmation, errors and Braille cells.",
  },
] as const;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const { prefs } = usePrefs();
  const history = useHistory();

  return (
    <div className="space-y-12">
      <section>
        <p className="text-lg text-muted-foreground">
          {greeting()}
          {prefs.name ? `, ${prefs.name}` : ""}.
        </p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Communication without barriers.</h1>
        <p className="mt-3 max-w-2xl text-xl text-muted-foreground">
          Choose the way you want to communicate.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-border bg-muted px-4 py-2 text-base">
            Preferred: {prefs.modalities.length ? prefs.modalities.join(", ") : "not set"}
          </span>
          <span className="rounded-full border border-border bg-muted px-4 py-2 text-base">
            Text size {prefs.textScale}%
          </span>
          <span className="rounded-full border border-border bg-muted px-4 py-2 text-base">
            {prefs.highContrast ? "High contrast on" : "Standard contrast"}
          </span>
          <Link
            to="/settings"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl px-4 py-2 text-base font-medium text-primary underline underline-offset-4"
          >
            <Settings aria-hidden="true" className="size-5" />
            Adjust accessibility
          </Link>
        </div>
      </section>

      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-3xl font-semibold">
          Ways to communicate
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {MODULES.map(({ to, icon: Icon, name, tagline, detail }) => (
            <li key={to}>
              <Link
                to={to}
                className="surface-panel group flex h-full min-h-44 flex-col gap-3 p-6 transition-transform hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground"
                >
                  <Icon className="size-7" />
                </span>
                <span className="font-display text-2xl font-semibold">{name}</span>
                <span className="text-lg text-muted-foreground">{tagline}</span>
                <span className="text-base text-muted-foreground/90">{detail}</span>
                <span className="mt-auto inline-flex items-center gap-2 text-base font-semibold text-primary">
                  Open {name}
                  <ArrowRight aria-hidden="true" className="size-5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="recent-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="recent-heading" className="text-3xl font-semibold">
            Recent activity
          </h2>
          <Link
            to="/history"
            className="inline-flex min-h-12 items-center gap-2 text-base font-semibold text-primary underline underline-offset-4"
          >
            <HistoryIcon aria-hidden="true" className="size-5" />
            View all history
          </Link>
        </div>
        {history.length === 0 ? (
          <p className="surface-panel mt-4 p-6 text-lg text-muted-foreground">
            Nothing yet. Anything you convert with voice, ISL or Braille will appear here, stored
            only on this device.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {history.slice(0, 4).map((item) => (
              <li key={item.id} className="surface-panel flex flex-wrap gap-3 p-5">
                <span className="rounded-full bg-accent px-3 py-1 text-base font-semibold uppercase text-accent-foreground">
                  {item.kind}
                </span>
                <span className="flex-1 text-lg">{item.text}</span>
                <span className="text-base text-muted-foreground">
                  {new Date(item.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
