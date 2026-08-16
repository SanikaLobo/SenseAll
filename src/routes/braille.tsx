import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Copy, Trash2, Vibrate, Volume2, Delete, CornerDownLeft, Hand } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrailleCellGrid, BrailleDots } from "@/components/BrailleCells";
import { cellToVibration, dotsToChar, textToBraille, textToCells } from "@/lib/braille";
import { addHistory, usePrefs } from "@/lib/prefs";
import { speak } from "@/lib/speech";
import { vibrate, vibratePattern, vibrationSupported } from "@/lib/haptics";

export const Route = createFileRoute("/braille")({
  validateSearch: z.object({ text: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "SenseBraille — Text to Braille and Braille keyboard" },
      {
        name: "description",
        content:
          "Convert text to Grade 1 Braille cells with real dot mapping, then write back using the digital Braille keyboard with haptic feedback.",
      },
      { property: "og:title", content: "SenseBraille — Braille reading and writing" },
      {
        property: "og:description",
        content: "Grade 1 Braille conversion, dot visualisation and a six-dot digital keyboard.",
      },
    ],
  }),
  component: BraillePage,
});

function BraillePage() {
  const { text: incoming } = Route.useSearch();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Module 3 · SenseBraille"
        title="Read and write in Braille."
        description="A digital Braille interface with real Grade 1 cell mapping and haptic-enhanced interaction. Your phone does not raise physical dots — it represents them visually and through vibration."
      />

      <Tabs defaultValue="convert">
        <TabsList className="h-auto flex-wrap gap-2 p-2">
          <TabsTrigger value="convert" className="min-h-14 px-6 text-lg">
            Text → Braille
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="min-h-14 px-6 text-lg">
            Braille keyboard
          </TabsTrigger>
        </TabsList>
        <TabsContent value="convert" className="mt-6">
          <TextToBraille initial={incoming ?? ""} />
        </TabsContent>
        <TabsContent value="keyboard" className="mt-6">
          <BrailleKeyboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TextToBraille({ initial }: { initial: string }) {
  const { prefs } = usePrefs();
  const [text, setText] = useState(initial);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const cells = useMemo(() => textToCells(text), [text]);
  const glyphs = useMemo(() => textToBraille(text), [text]);

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6" aria-labelledby="convert-heading">
        <h2 id="convert-heading" className="text-2xl font-semibold">
          Enter your text
        </h2>
        <label htmlFor="braille-input" className="sr-only">
          Text to convert to Braille
        </label>
        <Textarea
          id="braille-input"
          rows={3}
          className="mt-4 min-h-28 text-lg"
          value={text}
          placeholder="Type anything — letters, numbers and punctuation are supported."
          onChange={(event) => setText(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="min-h-16 px-8 text-lg"
            disabled={!text.trim()}
            onClick={() => {
              addHistory({ kind: "braille", text, detail: textToBraille(text) });
              vibrate("success", prefs.hapticIntensity, prefs.haptics);
              toast.success("Saved to your history on this device.");
            }}
          >
            Save to history
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            disabled={!glyphs.trim()}
            onClick={async () => {
              await navigator.clipboard.writeText(glyphs);
              toast.success("Braille copied to your clipboard.");
            }}
          >
            <Copy aria-hidden="true" />
            Copy Braille
          </Button>
          <Button size="lg" variant="outline" className="min-h-16 text-lg" onClick={() => setText("")}>
            <Trash2 aria-hidden="true" />
            Clear
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-16 text-lg">
            <Link to="/isl" search={{ text }}>
              <Hand aria-hidden="true" />
              Send to ISL
            </Link>
          </Button>
        </div>
      </section>

      <section className="surface-panel p-6" aria-labelledby="output-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="output-heading" className="text-2xl font-semibold">
            Braille output
          </h2>
          <div className="flex gap-2" role="group" aria-label="Braille display size">
            {(["sm", "md", "lg"] as const).map((option) => (
              <Button
                key={option}
                variant={size === option ? "default" : "outline"}
                size="lg"
                className="min-h-12"
                onClick={() => setSize(option)}
              >
                {option === "sm" ? "Small" : option === "md" ? "Medium" : "Large"}
              </Button>
            ))}
          </div>
        </div>

        <p
          className="mt-4 break-words rounded-xl border border-border bg-muted p-5 text-4xl leading-relaxed"
          aria-label={`Braille for: ${text || "nothing yet"}`}
        >
          {glyphs || "⠿ Nothing to show yet"}
        </p>

        <h3 className="mt-6 text-xl font-semibold">Cell by cell</h3>
        <p className="text-base text-muted-foreground">
          Select a cell to feel its dot pattern as vibration.
        </p>
        <div className="mt-4">
          <BrailleCellGrid
            cells={cells}
            size={size}
            onCellActivate={(cell) => {
              const ok = vibratePattern(cellToVibration(cell.dots), prefs.hapticIntensity, prefs.haptics);
              if (!ok) toast.info("Haptic feedback isn't available here — the dots are shown visually.");
            }}
          />
        </div>
      </section>

      <section className="surface-panel p-6" aria-labelledby="help-heading">
        <h2 id="help-heading" className="text-2xl font-semibold">
          How this works
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Each Braille cell has six dot positions arranged in two columns of three. SenseAll uses
          Grade 1 (uncontracted) mapping, adding a capital sign before uppercase letters and a
          number sign before digits. The mapping layer is separate from the interface so contracted
          grades can be added later.
        </p>
      </section>
    </div>
  );
}

const DOT_LABELS = [1, 2, 3, 4, 5, 6];

function BrailleKeyboard() {
  const { prefs } = usePrefs();
  const [active, setActive] = useState<number[]>([]);
  const [output, setOutput] = useState("");

  const toggleDot = (dot: number) => {
    vibrate("tap", prefs.hapticIntensity, prefs.haptics);
    setActive((current) =>
      current.includes(dot) ? current.filter((d) => d !== dot) : [...current, dot].sort(),
    );
  };

  const commit = () => {
    const char = dotsToChar(active);
    if (!char) {
      vibrate("error", prefs.hapticIntensity, prefs.haptics);
      toast.error("That dot combination doesn't match a Grade 1 character. Try again.");
      return;
    }
    setOutput((current) => current + char);
    setActive([]);
    vibrate("success", prefs.hapticIntensity, prefs.haptics);
  };

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6" aria-labelledby="kb-heading">
        <h2 id="kb-heading" className="text-2xl font-semibold">
          Digital Braille keyboard
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Select the raised dots for a character, then confirm. Every key is large, keyboard
          reachable and haptic-enhanced where the device supports vibration.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-8">
          <div className="grid grid-cols-2 gap-4" role="group" aria-label="Braille dots">
            {[1, 4, 2, 5, 3, 6].map((dot) => (
              <button
                key={dot}
                type="button"
                aria-pressed={active.includes(dot)}
                onClick={() => toggleDot(dot)}
                className={`size-20 rounded-full border-2 text-xl font-semibold transition-colors ${
                  active.includes(dot)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                {dot}
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-base uppercase tracking-wide text-muted-foreground">Current cell</p>
            <div className="mt-3 grid place-items-center">
              <BrailleDots dots={active} size="lg" />
            </div>
            <p aria-live="polite" className="mt-3 text-2xl font-semibold">
              {dotsToChar(active) ?? "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Button size="lg" className="min-h-16 text-lg" onClick={commit}>
            <CornerDownLeft aria-hidden="true" />
            Add character
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            onClick={() => setOutput((current) => `${current} `)}
          >
            Space
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            onClick={() => setOutput((current) => current.slice(0, -1))}
          >
            <Delete aria-hidden="true" />
            Delete
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            onClick={() => setActive([])}
          >
            Reset dots
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            onClick={() => {
              setOutput("");
              setActive([]);
            }}
          >
            <Trash2 aria-hidden="true" />
            Clear all
          </Button>
        </div>
        <p className="mt-3 text-base text-muted-foreground">
          Dot positions: {DOT_LABELS.join(", ")} — left column 1-2-3, right column 4-5-6.
        </p>
      </section>

      <section className="surface-panel p-6" aria-labelledby="kb-output-heading">
        <h2 id="kb-output-heading" className="text-2xl font-semibold">
          What you wrote
        </h2>
        <p aria-live="polite" className="mt-3 min-h-16 rounded-xl border border-border bg-muted p-5 text-2xl">
          {output || "Nothing yet"}
        </p>
        <p className="mt-3 break-words text-3xl">{textToBraille(output)}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Button
            size="lg"
            className="min-h-16 text-lg"
            disabled={!output.trim()}
            onClick={() => speak(output, prefs.speechRate)}
          >
            <Volume2 aria-hidden="true" />
            Speak it
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            disabled={!output.trim()}
            onClick={async () => {
              await navigator.clipboard.writeText(output);
              toast.success("Copied to your clipboard.");
            }}
          >
            <Copy aria-hidden="true" />
            Copy text
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            onClick={() => {
              const ok = vibrate("long", prefs.hapticIntensity, prefs.haptics);
              if (!ok) toast.info("Haptic feedback isn't supported on this device.");
            }}
          >
            <Vibrate aria-hidden="true" />
            {vibrationSupported() ? "Feel confirmation" : "Haptics unavailable"}
          </Button>
        </div>
      </section>
    </div>
  );
}
