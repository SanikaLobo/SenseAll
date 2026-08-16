import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Hand, Grid2x2, Vibrate, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SenseAll — Communication without barriers" },
      {
        name: "description",
        content:
          "SenseAll is an inclusive communication platform combining context-aware voice, Indian Sign Language, Braille and haptic feedback in one accessible interface.",
      },
      { property: "og:title", content: "SenseAll — Communication without barriers" },
      {
        property: "og:description",
        content:
          "Voice, Indian Sign Language, Braille and haptics in one accessible communication platform.",
      },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  { icon: Mic, title: "Voice", copy: "Speech understood in context, corrected only with your consent." },
  { icon: Hand, title: "ISL", copy: "Indian Sign Language in both directions." },
  { icon: Grid2x2, title: "Braille", copy: "Real Grade 1 cells you can read and write." },
  { icon: Vibrate, title: "Haptics", copy: "Feedback you can feel, not just see." },
];

function Landing() {
  const { prefs, hydrated } = usePrefs();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const destination = hydrated && prefs.onboarded ? "/home" : "/onboarding";

  return (
    <div className="space-y-16">
      <section className="pt-4">
        <p className="text-base font-semibold uppercase tracking-[0.18em] text-primary">
          Inclusive communication platform
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight sm:text-7xl">
          Communication without barriers.
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
          Don't make the user adapt to the interface. SenseAll adapts to the user — through voice,
          text, Indian Sign Language, Braille and touch.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="min-h-16 px-9 text-lg">
            <Link to={destination}>
              Get started
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-16 px-9 text-lg">
            <Link to="/home">Explore the modules</Link>
          </Button>
        </div>

        <p role="status" aria-live="polite" className="mt-6 text-base text-muted-foreground">
          {ready ? "Ready when you are." : "Preparing your accessible workspace…"}
        </p>
      </section>

      <section aria-labelledby="pillars-heading">
        <h2 id="pillars-heading" className="text-3xl font-semibold">
          One platform, four ways to be understood
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, copy }) => (
            <li key={title} className="surface-panel p-6">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground"
              >
                <Icon className="size-7" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-lg text-muted-foreground">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-panel p-8" aria-labelledby="honesty-heading">
        <h2 id="honesty-heading" className="text-3xl font-semibold">
          Honest about what works today
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
          Voice recognition, speech output, Braille conversion and haptics run live in your browser
          where supported. Sign-to-text ships as a working camera interface, ready for a recognition
          model — we never present an animation as computer vision. Everything you create stays on
          your device.
        </p>
      </section>
    </div>
  );
}
