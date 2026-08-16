import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, MicOff, Volume2, Copy, Trash2, Check, X, Hand, Grid2x2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { analyzeContext, speak, speechSynthesisSupported, stopSpeaking, useSpeechRecognition, type Suggestion } from "@/lib/speech";
import { addHistory, usePrefs } from "@/lib/prefs";
import { vibrate } from "@/lib/haptics";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "SenseVoice — Context-aware speech on SenseAll" },
      {
        name: "description",
        content:
          "Speak naturally and let SenseAll suggest contextual corrections before you send, speak, sign or emboss your message.",
      },
      { property: "og:title", content: "SenseVoice — Context-aware speech" },
      {
        property: "og:description",
        content: "Speech to text with contextual correction suggestions you always confirm.",
      },
    ],
  }),
  component: VoicePage,
});

function VoicePage() {
  const { prefs, update } = usePrefs();
  const recognition = useSpeechRecognition();
  const [draft, setDraft] = useState("");
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const text = draft || recognition.transcript;

  const runAnalysis = (value: string) => {
    const result = analyzeContext(value);
    if (result) {
      setSuggestion(result);
      setConfirmed(null);
    } else {
      setSuggestion(null);
      finalise(value.trim());
    }
  };

  const finalise = (value: string) => {
    if (!value) return;
    setConfirmed(value);
    setSuggestion(null);
    addHistory({ kind: "voice", text: value });
    vibrate("success", prefs.hapticIntensity, prefs.haptics);
  };

  const clearAll = () => {
    setDraft("");
    setSuggestion(null);
    setConfirmed(null);
    recognition.reset();
    stopSpeaking();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Module 1 · SenseVoice"
        title="Speak naturally. We suggest, never assume."
        description="SenseAll listens, checks the sentence for contextual slips, and asks you to confirm before anything is used."
      />

      <section className="surface-panel p-6" aria-labelledby="capture-heading">
        <h2 id="capture-heading" className="text-2xl font-semibold">
          Capture your message
        </h2>

        {recognition.supported === false && (
          <p role="status" className="mt-4 rounded-xl border border-border bg-muted p-4 text-lg">
            Voice input isn't available in this browser. You can type your message instead — every
            other feature still works.
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            size="lg"
            variant={recognition.listening ? "destructive" : "default"}
            className="min-h-16 px-8 text-lg"
            disabled={recognition.supported === false}
            onClick={() => {
              if (recognition.listening) {
                recognition.stop();
              } else {
                vibrate("tap", prefs.hapticIntensity, prefs.haptics);
                recognition.start();
              }
            }}
          >
            {recognition.listening ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
            {recognition.listening ? "Stop listening" : "Start speaking"}
          </Button>

          <span
            role="status"
            aria-live="polite"
            className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-muted px-4 py-2 text-lg"
          >
            <span
              aria-hidden="true"
              className={`size-3 rounded-full ${recognition.listening ? "animate-pulse bg-destructive" : "bg-muted-foreground/50"}`}
            />
            {recognition.listening ? "Listening — microphone is on" : "Microphone is off"}
          </span>

          <Button variant="outline" size="lg" className="min-h-14" onClick={clearAll}>
            <Trash2 aria-hidden="true" />
            Clear
          </Button>
        </div>

        {recognition.error && (
          <p role="alert" className="mt-4 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-lg">
            {recognition.error}
          </p>
        )}

        <label htmlFor="voice-text" className="mt-6 block text-lg font-semibold">
          Recognised or typed text
        </label>
        <Textarea
          id="voice-text"
          value={text}
          rows={4}
          className="mt-2 min-h-32 text-lg"
          placeholder="Speak, or type your message here…"
          onChange={(event) => {
            setDraft(event.target.value);
            recognition.setTranscript("");
          }}
        />
        {recognition.interim && (
          <p className="mt-2 text-lg italic text-muted-foreground" aria-live="polite">
            {recognition.interim}…
          </p>
        )}

        <Button
          size="lg"
          className="mt-5 min-h-16 px-8 text-lg"
          disabled={!text.trim()}
          onClick={() => runAnalysis(text)}
        >
          Check and confirm my message
        </Button>
      </section>

      {suggestion && (
        <section
          className="surface-panel border-primary/60 p-6"
          aria-labelledby="suggestion-heading"
          aria-live="polite"
        >
          <h2 id="suggestion-heading" className="text-2xl font-semibold">
            Did you mean something slightly different?
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">{suggestion.reason}</p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted p-4">
              <dt className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
                What we heard
              </dt>
              <dd className="mt-2 text-xl">{suggestion.original}</dd>
            </div>
            <div className="rounded-xl border border-primary bg-accent p-4">
              <dt className="text-base font-semibold uppercase tracking-wide text-accent-foreground">
                Suggestion ({Math.round(suggestion.confidence * 100)}% confidence)
              </dt>
              <dd className="mt-2 text-xl text-accent-foreground">{suggestion.corrected}</dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button size="lg" className="min-h-16 px-8 text-lg" onClick={() => finalise(suggestion.corrected)}>
              <Check aria-hidden="true" />
              Yes, use the suggestion
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-16 px-8 text-lg"
              onClick={() => finalise(suggestion.original)}
            >
              <X aria-hidden="true" />
              No, keep what I said
            </Button>
          </div>
        </section>
      )}

      {confirmed && (
        <section className="surface-panel p-6" aria-labelledby="final-heading" aria-live="polite">
          <h2 id="final-heading" className="text-2xl font-semibold">
            Your confirmed message
          </h2>
          <p className="mt-3 rounded-xl border border-border bg-muted p-5 text-2xl">{confirmed}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              size="lg"
              className="min-h-16 text-lg"
              onClick={() => {
                if (!speak(confirmed, prefs.speechRate)) {
                  toast.error("Speech output isn't available in this browser.");
                }
              }}
              disabled={!speechSynthesisSupported()}
            >
              <Volume2 aria-hidden="true" />
              Speak it
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-16 text-lg"
              onClick={async () => {
                await navigator.clipboard.writeText(confirmed);
                toast.success("Message copied to your clipboard.");
              }}
            >
              <Copy aria-hidden="true" />
              Copy text
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-16 text-lg">
              <Link to="/isl" search={{ text: confirmed }}>
                <Hand aria-hidden="true" />
                Convert to ISL
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-16 text-lg">
              <Link to="/braille" search={{ text: confirmed }}>
                <Grid2x2 aria-hidden="true" />
                Convert to Braille
              </Link>
            </Button>
          </div>
        </section>
      )}

      <section className="surface-panel p-6" aria-labelledby="voice-settings-heading">
        <h2 id="voice-settings-heading" className="text-2xl font-semibold">
          Speech output settings
        </h2>
        <label htmlFor="rate" className="mt-4 block text-lg font-semibold">
          Speech speed: {prefs.speechRate.toFixed(1)}×
        </label>
        <Slider
          id="rate"
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
          onClick={() => speak("This is how SenseAll will read your messages.", prefs.speechRate)}
        >
          <Volume2 aria-hidden="true" />
          Test the voice
        </Button>
      </section>
    </div>
  );
}
