import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrefs, type Modality } from "@/lib/prefs";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up SenseAll — Choose how you communicate" },
      {
        name: "description",
        content:
          "A three-step setup that asks how you prefer to communicate — never for a medical diagnosis — and tunes SenseAll to you.",
      },
      { property: "og:title", content: "Set up SenseAll" },
      {
        property: "og:description",
        content: "Pick your interaction methods and reading comfort in three short steps.",
      },
    ],
  }),
  component: OnboardingPage,
});

const OPTIONS: { id: Modality; label: string; detail: string }[] = [
  { id: "voice", label: "Voice", detail: "I like to speak and listen" },
  { id: "visual", label: "Visual", detail: "I read text on screen" },
  { id: "isl", label: "Indian Sign Language", detail: "I communicate in ISL" },
  { id: "braille", label: "Braille", detail: "I read and write Braille" },
  { id: "haptic", label: "Haptics", detail: "I want to feel feedback" },
];

function OnboardingPage() {
  const { prefs, update } = usePrefs();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const toggle = (id: Modality) => {
    const next = prefs.modalities.includes(id)
      ? prefs.modalities.filter((m) => m !== id)
      : [...prefs.modalities, id];
    update({ modalities: next });
  };

  const finish = () => {
    update({ onboarded: true });
    navigate({ to: "/home" });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-base font-semibold uppercase tracking-[0.18em] text-primary">
        Step {step + 1} of 3
      </p>
      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label="Setup progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>

      {step === 0 && (
        <section className="mt-8" aria-labelledby="step1">
          <h1 id="step1" className="text-4xl font-semibold sm:text-5xl">
            Welcome to SenseAll.
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            SenseAll adapts to you — not the other way around. We'll ask two quick questions. You
            never have to share a diagnosis, and you can change everything later in Settings.
          </p>
          <label htmlFor="onb-name" className="mt-8 block text-lg font-semibold">
            What should we call you? (optional)
          </label>
          <Input
            id="onb-name"
            className="mt-2 h-14 max-w-sm text-lg"
            value={prefs.name}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Your name"
          />
        </section>
      )}

      {step === 1 && (
        <section className="mt-8" aria-labelledby="step2">
          <h1 id="step2" className="text-4xl font-semibold sm:text-5xl">
            Which interaction methods work best for you?
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">Choose as many as you like.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {OPTIONS.map(({ id, label, detail }) => {
              const selected = prefs.modalities.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle(id)}
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
      )}

      {step === 2 && (
        <section className="mt-8" aria-labelledby="step3">
          <h1 id="step3" className="text-4xl font-semibold sm:text-5xl">
            How would you like to read?
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Pick the combination that feels comfortable. This preview updates instantly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[100, 115, 130, 145].map((scale) => (
              <Button
                key={scale}
                size="lg"
                variant={prefs.textScale === scale ? "default" : "outline"}
                className="min-h-16 px-6 text-lg"
                onClick={() => update({ textScale: scale })}
              >
                {scale}% text
              </Button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant={prefs.theme === "dark" ? "default" : "outline"}
              className="min-h-16 px-6 text-lg"
              onClick={() => update({ theme: "dark" })}
            >
              Dark mode
            </Button>
            <Button
              size="lg"
              variant={prefs.theme === "light" ? "default" : "outline"}
              className="min-h-16 px-6 text-lg"
              onClick={() => update({ theme: "light" })}
            >
              Light mode
            </Button>
            <Button
              size="lg"
              variant={prefs.highContrast ? "default" : "outline"}
              className="min-h-16 px-6 text-lg"
              aria-pressed={prefs.highContrast}
              onClick={() => update({ highContrast: !prefs.highContrast })}
            >
              High contrast
            </Button>
          </div>
          <p className="surface-panel mt-6 p-6 text-xl">
            Sample text: "I need to go to the medical store."
          </p>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            size="lg"
            className="min-h-16 px-8 text-lg"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        )}
        {step < 2 ? (
          <Button size="lg" className="min-h-16 px-8 text-lg" onClick={() => setStep((s) => s + 1)}>
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button size="lg" className="min-h-16 px-8 text-lg" onClick={finish}>
            Start using SenseAll
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
        <Button variant="ghost" size="lg" className="min-h-16 px-6 text-lg" onClick={finish}>
          Skip setup
        </Button>
      </div>
    </div>
  );
}
