import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Camera, CameraOff, Grid2x2, Volume2, Copy } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIGN_LIBRARY, textToSigns, type Sign } from "@/lib/isl";
import { addHistory, usePrefs } from "@/lib/prefs";
import { speak } from "@/lib/speech";
import { vibrate } from "@/lib/haptics";

export const Route = createFileRoute("/isl")({
  validateSearch: z.object({ text: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "SenseSign — Indian Sign Language on SenseAll" },
      {
        name: "description",
        content:
          "Turn text into Indian Sign Language with a curated sign library, and use the sign-to-text camera interface built for future recognition models.",
      },
      { property: "og:title", content: "SenseSign — Indian Sign Language" },
      {
        property: "og:description",
        content: "Text to ISL playback plus a camera interface ready for ISL recognition.",
      },
    ],
  }),
  component: ISLPage,
});

const MOTION_CLASS: Record<Sign["keyframes"][number]["motion"], string> = {
  still: "",
  up: "-translate-y-3",
  down: "translate-y-3",
  left: "-translate-x-3",
  right: "translate-x-3",
  circle: "rotate-12",
};

function SignPlayer({ signs }: { signs: Sign[] }) {
  const frames = useMemo(
    () => signs.flatMap((sign) => sign.keyframes.map((frame) => ({ ...frame, gloss: sign.gloss }))),
    [signs],
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIndex(0);
    setPlaying(frames.length > 0);
  }, [frames]);

  useEffect(() => {
    if (!playing || frames.length === 0) return;
    timer.current = setInterval(() => {
      setIndex((current) => {
        if (current + 1 >= frames.length) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1100);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, frames]);

  if (frames.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-muted p-6 text-lg text-muted-foreground">
        Enter a phrase to see its sign sequence.
      </p>
    );
  }

  const frame = frames[index]!;

  return (
    <div>
      <div className="grid min-h-64 place-items-center rounded-2xl border border-border bg-muted p-8">
        <span
          aria-hidden="true"
          className={`text-8xl transition-transform duration-500 ${MOTION_CLASS[frame.motion]}`}
        >
          {frame.glyph}
        </span>
        <p className="mt-4 text-center text-2xl font-semibold">{frame.gloss}</p>
        <p aria-live="polite" className="mt-1 text-center text-lg text-muted-foreground">
          {frame.caption} · step {index + 1} of {frames.length}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button size="lg" className="min-h-14" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="min-h-14"
          onClick={() => {
            setIndex(0);
            setPlaying(true);
          }}
        >
          <RotateCcw aria-hidden="true" />
          Replay
        </Button>
      </div>
    </div>
  );
}

function ISLPage() {
  const { text: incoming } = Route.useSearch();
  const { prefs } = usePrefs();
  const [input, setInput] = useState(incoming ?? "");
  const [signs, setSigns] = useState<Sign[]>(incoming ? textToSigns(incoming) : []);

  const translate = (value: string) => {
    if (!value.trim()) return;
    setSigns(textToSigns(value));
    addHistory({ kind: "isl", text: value, detail: "Text translated to ISL" });
    vibrate("success", prefs.hapticIntensity, prefs.haptics);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Module 2 · SenseSign"
        title="Indian Sign Language, both directions."
        description="Text to sign uses a curated ISL library. Sign to text provides the camera interface and architecture for a recognition model — it is not pretending to be one."
      />

      <Tabs defaultValue="text-to-sign">
        <TabsList className="h-auto flex-wrap gap-2 p-2">
          <TabsTrigger value="text-to-sign" className="min-h-14 px-6 text-lg">
            Text → Sign
          </TabsTrigger>
          <TabsTrigger value="sign-to-text" className="min-h-14 px-6 text-lg">
            Sign → Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text-to-sign" className="mt-6 space-y-6">
          <section className="surface-panel p-6" aria-labelledby="t2s-heading">
            <h2 id="t2s-heading" className="text-2xl font-semibold">
              Enter what you want to sign
            </h2>
            <label htmlFor="isl-input" className="sr-only">
              Text to translate into Indian Sign Language
            </label>
            <Textarea
              id="isl-input"
              rows={3}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="For example: hello, I need water please"
              className="mt-4 min-h-28 text-lg"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="lg" className="min-h-16 px-8 text-lg" onClick={() => translate(input)}>
                Translate to ISL
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-16 text-lg"
                onClick={() => {
                  setInput("");
                  setSigns([]);
                }}
              >
                Clear
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-16 text-lg">
                <Link to="/braille" search={{ text: input }}>
                  <Grid2x2 aria-hidden="true" />
                  Send to Braille
                </Link>
              </Button>
            </div>
          </section>

          <section className="surface-panel p-6" aria-labelledby="player-heading">
            <h2 id="player-heading" className="text-2xl font-semibold">
              Sign playback
            </h2>
            <p className="mt-1 text-base text-muted-foreground">
              Prototype representation from a curated sign library — replaceable by generated ISL
              animation later.
            </p>
            <div className="mt-5">
              <SignPlayer signs={signs} />
            </div>
            {signs.length > 0 && (
              <ol className="mt-6 space-y-3">
                {signs.map((sign, index) => (
                  <li key={`${sign.id}-${index}`} className="rounded-xl border border-border bg-muted p-4">
                    <p className="text-xl font-semibold">{sign.gloss}</p>
                    <p className="text-base text-muted-foreground">
                      {sign.category} — {sign.description}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="surface-panel p-6" aria-labelledby="library-heading">
            <h2 id="library-heading" className="text-2xl font-semibold">
              Sign library
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {SIGN_LIBRARY.map((sign) => (
                <li key={sign.id}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-14 text-lg"
                    onClick={() => {
                      setInput(sign.gloss.toLowerCase());
                      translate(sign.gloss.toLowerCase());
                    }}
                  >
                    {sign.gloss}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="sign-to-text" className="mt-6">
          <SignToText />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SignToText() {
  const { prefs } = usePrefs();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "scanning" | "result" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [recognised, setRecognised] = useState<string>("");

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState("ready");
      setMessage(null);
    } catch {
      setState("error");
      setMessage(
        "We couldn't open the camera. Check camera permissions, or use Text → Sign instead.",
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setState("idle");
  };

  const scan = () => {
    setState("scanning");
    setMessage(null);
    window.setTimeout(() => {
      // Demo stand-in: no recognition model is connected yet, and we say so.
      setState("result");
      setRecognised("");
      setMessage(
        "No ISL recognition model is connected in this prototype, so nothing was recognised. The camera pipeline and result flow below are ready for a model to plug into.",
      );
      vibrate("warning", prefs.hapticIntensity, prefs.haptics);
    }, 1600);
  };

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6" aria-labelledby="s2t-heading">
        <h2 id="s2t-heading" className="text-2xl font-semibold">
          Sign to text
        </h2>
        <p className="mt-2 rounded-xl border border-border bg-muted p-4 text-lg">
          <strong>Prototype interface.</strong> The camera preview and recognition flow are real;
          the ISL recognition model is not connected yet. Nothing is recorded or uploaded — video
          stays in your browser and the preview is always visible while the camera is on.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-muted">
          <video
            ref={videoRef}
            className="aspect-video w-full bg-muted object-cover"
            muted
            playsInline
            aria-label="Camera preview for sign recognition"
          />
        </div>

        <p role="status" aria-live="polite" className="mt-3 text-lg">
          Status:{" "}
          {state === "idle"
            ? "Camera off"
            : state === "ready"
              ? "Camera on — ready to scan"
              : state === "scanning"
                ? "Scanning for signs…"
                : state === "result"
                  ? "Scan finished"
                  : "Camera error"}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {state === "idle" || state === "error" ? (
            <Button size="lg" className="min-h-16 px-8 text-lg" onClick={startCamera}>
              <Camera aria-hidden="true" />
              Start camera
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="min-h-16 px-8 text-lg"
                disabled={state === "scanning"}
                onClick={scan}
              >
                {state === "scanning" ? "Scanning…" : "Start recognition"}
              </Button>
              <Button size="lg" variant="outline" className="min-h-16 text-lg" onClick={stopCamera}>
                <CameraOff aria-hidden="true" />
                Stop camera
              </Button>
            </>
          )}
        </div>

        {message && (
          <p role="alert" className="mt-4 rounded-xl border border-border bg-muted p-4 text-lg">
            {message}
          </p>
        )}
      </section>

      <section className="surface-panel p-6" aria-labelledby="s2t-result-heading">
        <h2 id="s2t-result-heading" className="text-2xl font-semibold">
          Recognised text
        </h2>
        <label htmlFor="recognised" className="mt-3 block text-lg">
          You can also type or edit the phrase here while recognition is unavailable.
        </label>
        <Textarea
          id="recognised"
          rows={3}
          className="mt-2 min-h-28 text-lg"
          value={recognised}
          onChange={(event) => setRecognised(event.target.value)}
          placeholder="Recognised phrase will appear here"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Button
            size="lg"
            className="min-h-16 text-lg"
            disabled={!recognised.trim()}
            onClick={() => speak(recognised, prefs.speechRate)}
          >
            <Volume2 aria-hidden="true" />
            Speak
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-16 text-lg">
            <Link to="/braille" search={{ text: recognised }}>
              <Grid2x2 aria-hidden="true" />
              Braille
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-h-16 text-lg"
            disabled={!recognised.trim()}
            onClick={async () => {
              await navigator.clipboard.writeText(recognised);
              toast.success("Copied to your clipboard.");
            }}
          >
            <Copy aria-hidden="true" />
            Copy
          </Button>
        </div>
      </section>
    </div>
  );
}
