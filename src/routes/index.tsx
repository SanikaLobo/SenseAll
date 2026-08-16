import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Hand, Grid2x2, Vibrate, ArrowRight, Users, HandMetal, BookOpen } from "lucide-react";
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

const STATS = [
  { icon: Users, value: 63000000, label: "People in India with hearing disability", color: "text-primary" },
  { icon: HandMetal, value: 84350000, label: "Indian Sign Language users", color: "text-primary" },
  { icon: BookOpen, value: 250, label: "Certified ISL translators in India", color: "text-primary" },
];

const USE_CASES = [
  { front: "Education", back: ["Schools for the Deaf", "Inclusive Education"] },
  { front: "Digital Communication", back: ["Conversations", "Social Gatherings"] },
  { front: "Quick Communication", back: ["Quickly Communicate without Latency"] },
  { front: "Healthcare", back: ["Medical Consultations", "Health Education"] },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration, start]);
  return count;
}

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K+`;
  return `${n}`;
}

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Users; value: number; label: string; color: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 2200, visible);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="surface-panel flex flex-col items-center gap-3 p-8 text-center">
      <span aria-hidden="true" className={`grid size-16 place-items-center rounded-2xl bg-primary/10 ${color}`}>
        <Icon className="size-8" />
      </span>
      <p className={`font-display text-5xl font-semibold tabular-nums ${color}`}>{formatCount(count)}</p>
      <p className="text-lg text-muted-foreground">{label}</p>
    </div>
  );
}

function UseCaseCard({ front, back }: { front: string; back: string[] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative h-40 cursor-pointer"
      style={{ perspective: "800px" }}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
      tabIndex={0}
      role="button"
      aria-label={`${front} — click to reveal`}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-2xl font-semibold px-4 text-center">{front}</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-primary bg-accent px-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back.map((item) => (
            <p key={item} className="text-lg font-medium text-accent-foreground text-center">{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Landing() {
  const { prefs, hydrated } = usePrefs();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const destination = hydrated && prefs.onboarded ? "/home" : "/onboarding";

  return (
    <div className="space-y-20">
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

      {/* ── ISL Impact Stats (from Ishaara) ─────────────────────────────── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-3xl font-semibold">
          The scale of the problem
        </h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          India's deaf and hard-of-hearing community is one of the largest in the world — yet vastly underserved.
        </p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-3">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <StatCard {...stat} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Use Cases (from Ishaara) ─────────────────────────────────────── */}
      <section aria-labelledby="usecases-heading">
        <h2 id="usecases-heading" className="text-3xl font-semibold">
          Who benefits from SenseAll?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">Click a card to see where we make a difference.</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((uc) => (
            <li key={uc.front}>
              <UseCaseCard {...uc} />
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
