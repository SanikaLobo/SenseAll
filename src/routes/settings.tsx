import { createFileRoute } from "@tanstack/react-router";
import { Volume2, Key } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_PREFS, usePrefs, type Modality } from "@/lib/prefs";
import { speak } from "@/lib/speech";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Accessibility settings — SenseAll" },
      {
        name: "description",
        content:
          "Set text size, contrast, motion, speech speed, haptics and your preferred interaction methods. SenseAll adapts to you.",
      },
      { property: "og:title", content: "Accessibility settings — SenseAll" },
      {
        property: "og:description",
        content: "Text size, contrast, motion, speech and haptics — tuned to how you communicate.",
      },
    ],
  }),
  component: SettingsPage,
});

const MODALITIES: { id: Modality; label: string; detail: string }[] = [
  { id: "voice", label: "Voice", detail: "Speak and listen" },
  { id: "visual", label: "Visual", detail: "Read large, high-contrast text" },
  { id: "isl", label: "Indian Sign Language", detail: "Sign-first communication" },
  { id: "braille", label: "Braille", detail: "Braille cells and keyboard" },
  { id: "haptic", label: "Haptics", detail: "Feel feedback through vibration" },
];

function SettingsPage() {
  const { prefs, update } = usePrefs();

  const toggleModality = (id: Modality) => {
    const next = prefs.modalities.includes(id)
      ? prefs.modalities.filter((m) => m !== id)
      : [...prefs.modalities, id];
    update({ modalities: next });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Make SenseAll fit you."
        description="No medical questions — just tell us which interaction methods work best for you. Preferences are saved on this device."
      />

      <section className="surface-panel p-6" aria-labelledby="you-heading">
        <h2 id="you-heading" className="text-2xl font-semibold">
          About you
        </h2>
        <label htmlFor="name" className="mt-4 block text-lg font-semibold">
          What should we call you? (optional)
        </label>
        <Input
          id="name"
          className="mt-2 h-14 max-w-sm text-lg"
          value={prefs.name}
          onChange={(event) => update({ name: event.target.value })}
          placeholder="Your name"
        />
      </section>

      <section className="surface-panel p-6" aria-labelledby="modality-heading">
        <h2 id="modality-heading" className="text-2xl font-semibold">
          Which interaction methods work best for you?
        </h2>
        <p className="mt-1 text-lg text-muted-foreground">Choose as many as you like.</p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {MODALITIES.map(({ id, label, detail }) => {
            const selected = prefs.modalities.includes(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleModality(id)}
                  className={`min-h-24 w-full rounded-2xl border-2 p-5 text-left transition-colors ${
                    selected
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <span className="block text-xl font-semibold">{label}</span>
                  <span className="block text-base text-muted-foreground">{detail}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="surface-panel p-6" aria-labelledby="visual-heading">
        <h2 id="visual-heading" className="text-2xl font-semibold">
          Visual
        </h2>

        <label htmlFor="scale" className="mt-5 block text-lg font-semibold">
          Text size: {prefs.textScale}%
        </label>
        <Slider
          id="scale"
          className="mt-4 max-w-md"
          min={90}
          max={160}
          step={5}
          value={[prefs.textScale]}
          onValueChange={([value]) => update({ textScale: value ?? 100 })}
        />

        <div className="mt-6 space-y-4">
          <ToggleRow
            id="theme"
            label="Dark mode"
            detail="Deep navy background with warm amber accents."
            checked={prefs.theme === "dark"}
            onChange={(checked) => update({ theme: checked ? "dark" : "light" })}
          />
          <ToggleRow
            id="contrast"
            label="High contrast"
            detail="Maximum contrast between text, controls and background."
            checked={prefs.highContrast}
            onChange={(checked) => update({ highContrast: checked })}
          />
          <ToggleRow
            id="motion"
            label="Reduce motion"
            detail="Removes animation and transitions across the app."
            checked={prefs.reduceMotion}
            onChange={(checked) => update({ reduceMotion: checked })}
          />
        </div>
      </section>

      <section className="surface-panel p-6" aria-labelledby="audio-heading">
        <h2 id="audio-heading" className="text-2xl font-semibold">
          Audio
        </h2>
        <label htmlFor="speech-rate" className="mt-4 block text-lg font-semibold">
          Speech speed: {prefs.speechRate.toFixed(1)}×
        </label>
        <Slider
          id="speech-rate"
          className="mt-4 max-w-md"
          min={0.5}
          max={1.8}
          step={0.1}
          value={[prefs.speechRate]}
          onValueChange={([value]) => update({ speechRate: value ?? 1 })}
        />
        <Button
          variant="outline"
          size="lg"
          className="mt-5 min-h-14"
          onClick={() => speak("SenseAll will read your messages at this speed.", prefs.speechRate)}
        >
          <Volume2 aria-hidden="true" />
          Test speech
        </Button>
      </section>

      <section className="surface-panel p-6" aria-labelledby="touch-heading">
        <h2 id="touch-heading" className="text-2xl font-semibold">
          Touch
        </h2>
        <div className="mt-4 space-y-4">
          <ToggleRow
            id="haptics-pref"
            label="Haptic feedback"
            detail="Vibration for confirmations, errors and Braille cells where supported."
            checked={prefs.haptics}
            onChange={(checked) => update({ haptics: checked })}
          />
        </div>
        <label htmlFor="haptic-strength" className="mt-6 block text-lg font-semibold">
          Pulse strength: {["Gentle", "Standard", "Strong"][prefs.hapticIntensity - 1]}
        </label>
        <Slider
          id="haptic-strength"
          className="mt-4 max-w-md"
          min={1}
          max={3}
          step={1}
          value={[prefs.hapticIntensity]}
          onValueChange={([value]) => update({ hapticIntensity: value ?? 2 })}
        />
      </section>

      <section className="surface-panel p-6" aria-labelledby="gemini-heading">
        <h2 id="gemini-heading" className="text-2xl font-semibold">
          Gemini API key
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          Required for Sign → Text: the detected ISL signs are sent to Gemini to form a natural
          sentence. Get a free key at{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            aistudio.google.com
          </a>
          .
        </p>
        <label htmlFor="gemini-key" className="mt-4 block text-lg font-semibold">
          API key
        </label>
        <div className="mt-2 flex max-w-lg gap-3">
          <div className="relative flex-1">
            <Key
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
              aria-hidden="true"
            />
            <Input
              id="gemini-key"
              type="password"
              className="h-14 pl-9 text-base"
              value={prefs.geminiApiKey}
              onChange={(e) => update({ geminiApiKey: e.target.value })}
              placeholder="AIza…"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          {prefs.geminiApiKey && (
            <Button
              variant="outline"
              size="lg"
              className="min-h-14"
              onClick={() => {
                update({ geminiApiKey: "" });
                toast.success("API key removed.");
              }}
            >
              Remove
            </Button>
          )}
        </div>
        {prefs.geminiApiKey && (
          <p className="mt-2 text-sm text-muted-foreground">Key saved — ISL Sign → Text is active.</p>
        )}
      </section>

      <section className="surface-panel p-6" aria-labelledby="reset-heading">
        <h2 id="reset-heading" className="text-2xl font-semibold">
          Reset
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Restore every accessibility preference to its default value. Your history is not deleted.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="mt-4 min-h-14"
          onClick={() => {
            update({ ...DEFAULT_PREFS, onboarded: true, name: prefs.name });
            toast.success("Preferences reset to defaults.");
          }}
        >
          Reset preferences
        </Button>
      </section>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  detail,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  detail: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted p-5">
      <div>
        <label htmlFor={id} className="text-lg font-semibold">
          {label}
        </label>
        <p className="text-base text-muted-foreground">{detail}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
