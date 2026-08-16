import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Vibrate, Check, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BrailleDots } from "@/components/BrailleCells";
import { cellToVibration, textToCells } from "@/lib/braille";
import { addHistory, usePrefs } from "@/lib/prefs";
import { vibrate, vibratePattern, vibrationSupported, stopVibration } from "@/lib/haptics";

export const Route = createFileRoute("/haptics")({
  head: () => ({
    meta: [
      { title: "SenseTouch — Haptic feedback on SenseAll" },
      {
        name: "description",
        content:
          "Feel confirmations, errors and Braille cell patterns through vibration, with visual alternatives whenever haptics are unavailable.",
      },
      { property: "og:title", content: "SenseTouch — Haptic feedback" },
      {
        property: "og:description",
        content: "Vibration patterns for confirmation, errors and Braille cells.",
      },
    ],
  }),
  component: HapticsPage,
});

const SIGNALS = [
  { kind: "success", label: "Success", detail: "Two short pulses", icon: Check },
  { kind: "warning", label: "Warning", detail: "Two medium pulses", icon: AlertTriangle },
  { kind: "error", label: "Error", detail: "Three firm pulses", icon: X },
  { kind: "tap", label: "Tap", detail: "One light pulse", icon: Vibrate },
] as const;

function HapticsPage() {
  const { prefs, update } = usePrefs();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [word, setWord] = useState("hi");
  const [activeCell, setActiveCell] = useState(0);

  useEffect(() => {
    setSupported(vibrationSupported());
    return () => stopVibration();
  }, []);

  const cells = textToCells(word).slice(0, 12);
  const current = cells[activeCell];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Module 4 · SenseTouch"
        title="Feel what matters."
        description="Haptic feedback turns confirmations, warnings and Braille cells into something you can feel. Every pattern also has a visual and audible alternative."
      />

      {supported === false && (
        <p role="status" className="surface-panel p-5 text-lg">
          Haptic feedback isn't supported on this device or browser. You can still use visual and
          audio feedback — patterns below are shown on screen.
        </p>
      )}

      <section className="surface-panel p-6" aria-labelledby="controls-heading">
        <h2 id="controls-heading" className="text-2xl font-semibold">
          Haptic controls
        </h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted p-5">
          <label htmlFor="haptics-toggle" className="text-lg font-semibold">
            Enable haptic feedback
          </label>
          <Switch
            id="haptics-toggle"
            checked={prefs.haptics}
            onCheckedChange={(checked) => update({ haptics: checked })}
          />
        </div>

        <label htmlFor="intensity" className="mt-6 block text-lg font-semibold">
          Pulse strength: {["Gentle", "Standard", "Strong"][prefs.hapticIntensity - 1]}
        </label>
        <p className="text-base text-muted-foreground">
          Browsers control vibration amplitude, so SenseAll adjusts pulse length instead.
        </p>
        <Slider
          id="intensity"
          className="mt-4 max-w-md"
          min={1}
          max={3}
          step={1}
          value={[prefs.hapticIntensity]}
          onValueChange={([value]) => update({ hapticIntensity: value ?? 2 })}
        />

        <Button
          size="lg"
          className="mt-6 min-h-16 px-8 text-lg"
          onClick={() => {
            const ok = vibrate("long", prefs.hapticIntensity, prefs.haptics);
            toast[ok ? "success" : "info"](
              ok ? "Test vibration sent." : "Haptic feedback isn't available right now.",
            );
          }}
        >
          <Vibrate aria-hidden="true" />
          Test vibration
        </Button>
      </section>

      <section className="surface-panel p-6" aria-labelledby="signals-heading">
        <h2 id="signals-heading" className="text-2xl font-semibold">
          Feedback signals
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {SIGNALS.map(({ kind, label, detail, icon: Icon }) => (
            <li key={kind}>
              <button
                type="button"
                onClick={() => {
                  const ok = vibrate(kind, prefs.hapticIntensity, prefs.haptics);
                  if (!ok) toast.info(`${label}: ${detail} (shown visually — haptics unavailable).`);
                }}
                className="flex min-h-28 w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:bg-accent"
              >
                <span
                  aria-hidden="true"
                  className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"
                >
                  <Icon className="size-7" />
                </span>
                <span>
                  <span className="block text-xl font-semibold">{label}</span>
                  <span className="block text-base text-muted-foreground">{detail}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="surface-panel p-6" aria-labelledby="pattern-heading">
        <h2 id="pattern-heading" className="text-2xl font-semibold">
          Braille pattern preview
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Each raised dot becomes a longer pulse, each empty dot a short one — so a cell can be felt
          in order.
        </p>

        <label htmlFor="pattern-word" className="mt-5 block text-lg font-semibold">
          Word to feel
        </label>
        <Input
          id="pattern-word"
          value={word}
          maxLength={24}
          className="mt-2 h-14 max-w-sm text-lg"
          onChange={(event) => {
            setWord(event.target.value);
            setActiveCell(0);
          }}
        />

        <div className="mt-6 flex flex-wrap items-center gap-8">
          <div className="rounded-2xl border border-border bg-muted p-8">
            <BrailleDots dots={current?.dots ?? []} size="lg" />
          </div>
          <div>
            <p className="text-xl font-semibold">
              Cell {cells.length ? activeCell + 1 : 0} of {cells.length}: {current?.label ?? "—"}
            </p>
            <p className="text-base text-muted-foreground">
              Raised dots: {current?.dots.length ? current.dots.join(", ") : "none"}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="min-h-16 px-8 text-lg"
                disabled={!current}
                onClick={() => {
                  if (!current) return;
                  const ok = vibratePattern(
                    cellToVibration(current.dots),
                    prefs.hapticIntensity,
                    prefs.haptics,
                  );
                  addHistory({
                    kind: "haptic",
                    text: `Felt Braille cell "${current.label}"`,
                    detail: `Dots ${current.dots.join(", ") || "none"}`,
                  });
                  if (!ok) toast.info("Haptics unavailable — the pattern is shown on screen.");
                }}
              >
                <Vibrate aria-hidden="true" />
                Feel this pattern
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-16 text-lg"
                disabled={cells.length < 2}
                onClick={() => setActiveCell((index) => (index + 1) % cells.length)}
              >
                Next cell
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
