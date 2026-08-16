import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Camera, CameraOff, Grid2x2, Volume2, Copy, BookOpen } from "lucide-react";
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
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {SIGN_LIBRARY.map((sign) => (
                <div
                  key={sign.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
                    <h3 className="font-display text-base font-semibold tracking-wide text-foreground">
                      {sign.gloss}
                    </h3>
                    <span className="rounded-full bg-accent/60 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                      {sign.category}
                    </span>
                  </div>
                  <div className="relative flex aspect-video w-full items-center justify-center bg-muted/60 p-4 transition-colors group-hover:bg-muted/90">
                    <span className="text-6xl transition-transform duration-300 group-hover:scale-110">
                      {sign.keyframes[0]?.glyph}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-3 p-4 pt-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {sign.description}
                    </p>
                    <button
                      onClick={() => {
                        setInput(sign.gloss.toLowerCase());
                        translate(sign.gloss.toLowerCase());
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <BookOpen className="size-4" aria-hidden="true" />
                      CLICK TO LEARN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="sign-to-text" className="mt-6">
          <SignToText />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Roboflow ISL model constants (from Ishaara-Website-2.0)
// ---------------------------------------------------------------------------
const ROBOFLOW_API_KEY = "rf_c7rnF41caQUNdCaF2OOuzwzExHS2";
const ROBOFLOW_PROJECT = "isl-actions";
const ROBOFLOW_VERSION = 3;

// Accuracy tuning constants
const DETECT_INTERVAL_MS = 200;   // Run inference every 200ms (was 10ms — too noisy)
const CONFIDENCE_THRESHOLD = 0.5; // Ignore detections below 50% confidence
const HOLD_REQUIRED = 5;          // Sign must appear in N consecutive frames to count
const BUFFER_TARGET = 4;          // Collect N confirmed signs before calling Gemini
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Minimal type shim for the globally injected Roboflow SDK
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roboflow: any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RoboflowModel = any;

function SignToText() {
  const { prefs } = usePrefs();

  // Camera / video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Roboflow model ref
  const modelRef = useRef<RoboflowModel | null>(null);
  const inferIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Improved sign accumulation ────────────────────────────────────────────
  // Strategy: "hold" debounce — a sign must be the top detection for
  // HOLD_REQUIRED consecutive frames before it is accepted into the buffer.
  // This eliminates single-frame noise spikes that plagued the old 10ms loop.
  const holdClassRef = useRef<string>("");  // current candidate sign
  const holdCountRef = useRef<number>(0);   // how many consecutive frames it's held
  const bufferRef = useRef<string[]>([]);   // confirmed signs waiting for Gemini
  const lastAddedRef = useRef<string>("");  // avoid duplicating the same sign back-to-back

  // UI state
  const [status, setStatus] = useState<
    "idle" | "loading-model" | "running" | "stopped" | "error"
  >("idle");
  const [liveDetection, setLiveDetection] = useState<string>("");
  const [recognised, setRecognised] = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [bufferDisplay, setBufferDisplay] = useState<string[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEverything();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── helpers ──────────────────────────────────────────────────────────────

  const stopEverything = () => {
    if (inferIntervalRef.current) {
      clearInterval(inferIntervalRef.current);
      inferIntervalRef.current = null;
    }
    if (modelRef.current) {
      try {
        modelRef.current.teardown();
      } catch {
        // ignore teardown errors
      }
      modelRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const resetAccumulation = () => {
    holdClassRef.current = "";
    holdCountRef.current = 0;
    bufferRef.current = [];
    lastAddedRef.current = "";
  };

  // ── camera ────────────────────────────────────────────────────────────────

  const startCamera = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 800, height: 600 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return true;
    } catch {
      setStatus("error");
      toast.error("Camera access denied. Check browser permissions.");
      return false;
    }
  };

  // ── Roboflow model ────────────────────────────────────────────────────────

  const loadModel = async () => {
    return new Promise<RoboflowModel>((resolve, reject) => {
      if (!window.roboflow) {
        reject(new Error("Roboflow SDK not loaded yet. Please wait a moment and try again."));
        return;
      }
      window.roboflow
        .auth({ publishable_key: ROBOFLOW_API_KEY })
        .load({
          model: ROBOFLOW_PROJECT,
          version: ROBOFLOW_VERSION,
          onMetadata: () => {
            console.log("[SenseAll] Roboflow ISL model loaded");
          },
        })
        .then(resolve)
        .catch(reject);
    });
  };

  // ── detection loop ────────────────────────────────────────────────────────

  const adjustCanvas = (w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.getContext("2d")?.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawBoxes = (detections: any[], ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detections.forEach((raw: any) => {
      const row = { ...raw.bbox, class: raw.class, color: raw.color, confidence: raw.confidence };
      if (row.confidence < 0) return;

      const x = row.x - row.width / 2;
      const y = row.y - row.height / 2;
      const w = row.width;
      const h = row.height;
      const fontSize = 13;

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = row.color ?? "#f59e0b";
      ctx.rect(x, y, w, h);
      ctx.stroke();

      ctx.fillStyle = row.color ?? "#f59e0b";
      ctx.globalAlpha = 0.18;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;

      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.fillStyle = row.color ?? "#f59e0b";
      ctx.fillRect(x - ctx.lineWidth / 2, y - fontSize - ctx.lineWidth, w + ctx.lineWidth, fontSize + ctx.lineWidth);
      ctx.fillStyle = "#000";
      ctx.fillText(row.class, x + w / 2, y - 2);
    });
  };

  const callGemini = async (signs: string[]) => {
    const apiKey = prefs.geminiApiKey.trim();
    const rawText = signs.join(" ");

    if (!apiKey) {
      // No key — show raw signs and tell user how to fix it
      setRecognised(rawText);
      addHistory({ kind: "isl", text: rawText, detail: "Sign → Text (raw, no Gemini key)" });
      toast.warning(
        "Add your Gemini API key in Settings to get natural sentences.",
        { duration: 6000 },
      );
      return;
    }

    setGeminiLoading(true);
    const prompt =
      `You are an Indian Sign Language interpreter. ` +
      `The following words are ISL gloss labels detected by a computer vision model: "${rawText}". ` +
      `Convert them into a natural, grammatically correct English sentence. ` +
      `Reply with only the sentence, no explanation.`;
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        throw new Error((err as any)?.error?.message ?? `HTTP ${res.status}`);
      }
      const json = await res.json();
      const sentence: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? rawText;
      setRecognised(sentence);
      addHistory({ kind: "isl", text: sentence, detail: "Sign → Text via Gemini" });
      vibrate("success", prefs.hapticIntensity, prefs.haptics);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setRecognised(rawText);
      toast.error(`Gemini error: ${msg}. Showing raw signs.`, { duration: 7000 });
    } finally {
      setGeminiLoading(false);
    }
  };

  const detect = async (model: RoboflowModel) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== 4) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    video.width = vw;
    video.height = vh;
    adjustCanvas(vw, vh);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allDetections: any[] = await model.detect(video);

    // Filter by confidence threshold — ignore weak/noisy detections
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detections: any[] = allDetections.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (d: any) => (d.confidence ?? 0) >= CONFIDENCE_THRESHOLD,
    );

    // Top confident detection this frame
    const topClass: string = detections.length > 0 ? detections[0].class : "";
    const topConf: number = detections.length > 0 ? Math.round((detections[0].confidence ?? 0) * 100) : 0;

    // ── Hold debounce ─────────────────────────────────────────────────────
    // Only increment hold counter when SAME class appears consecutively.
    // Reset when class changes. Accept when hold reaches HOLD_REQUIRED.
    if (topClass) {
      if (topClass === holdClassRef.current) {
        holdCountRef.current += 1;
      } else {
        holdClassRef.current = topClass;
        holdCountRef.current = 1;
      }

      setLiveDetection(`${topClass} (${topConf}%)`);

      // Accept the sign once it's been held long enough AND is different from last added
      if (
        holdCountRef.current >= HOLD_REQUIRED &&
        topClass !== lastAddedRef.current
      ) {
        lastAddedRef.current = topClass;
        holdCountRef.current = 0;  // reset so same sign can be repeated after a gap
        bufferRef.current = [...bufferRef.current, topClass];
        setBufferDisplay([...bufferRef.current]);

        // Once we have enough signs, fire Gemini
        if (bufferRef.current.length >= BUFFER_TARGET) {
          const captured = [...bufferRef.current];
          resetAccumulation();
          setLiveDetection("");
          setBufferDisplay([]);
          await callGemini(captured);
        }
      }
    } else {
      // No confident detection this frame — reset hold so noise doesn't accumulate
      holdClassRef.current = "";
      holdCountRef.current = 0;
      setLiveDetection("");
    }

    // Draw boxes for confident detections only
    const ctx = canvas.getContext("2d");
    if (ctx) drawBoxes(detections, ctx);
  };

  // ── main action ───────────────────────────────────────────────────────────

  const startRecognition = async () => {
    resetAccumulation();
    setRecognised("");
    setLiveDetection("");
    setStatus("loading-model");

    const cameraOk = await startCamera();
    if (!cameraOk) return;

    try {
      const model = await loadModel();
      modelRef.current = model;
      setStatus("running");

      inferIntervalRef.current = setInterval(() => {
        detect(model);
      }, DETECT_INTERVAL_MS);
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to load ISL model.";
      toast.error(msg);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    }
  };

  const stopRecognition = () => {
    stopEverything();
    setStatus("stopped");
    setLiveDetection("");
  };

  // ── render ─────────────────────────────────────────────────────────────────

  const statusLabel = {
    idle: "Camera off",
    "loading-model": "Loading ISL model…",
    running: "Recognising signs — perform ISL gestures",
    stopped: "Stopped",
    error: "Error — check permissions or try again",
  }[status];

  return (
    <div className="space-y-6">
      <section className="surface-panel p-6" aria-labelledby="s2t-heading">
        <h2 id="s2t-heading" className="text-2xl font-semibold">
          Sign to text
        </h2>
        <p className="mt-2 rounded-xl border border-border bg-muted p-4 text-base">
          <strong>Powered by Roboflow ISL model.</strong> Perform ISL gestures in front of your
          camera. Every {BUFFER_TARGET} confirmed signs are sent to Gemini and converted to a
          natural sentence. A sign is confirmed after being detected for {HOLD_REQUIRED} consecutive
          frames at ≥{Math.round(CONFIDENCE_THRESHOLD * 100)}% confidence.
        </p>

        {/* Gemini key warning */}
        {!prefs.geminiApiKey && (
          <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-base text-amber-700 dark:text-amber-400">
            ⚠️ No Gemini API key set — signs will be shown as raw labels.{" "}
            <Link to="/settings" className="underline underline-offset-2">
              Add key in Settings
            </Link>
            .
          </p>
        )}

        {/* Video + canvas overlay — stacked with relative/absolute positioning */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-muted">
          <video
            ref={videoRef}
            className="aspect-video w-full bg-muted object-cover"
            muted
            playsInline
            aria-label="Camera preview for ISL sign recognition"
          />
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        </div>

        {/* Live detection badge */}
        {status === "running" && (
          <div className="mt-3 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
            </span>
            <p className="text-base text-muted-foreground">
              {liveDetection ? (
                <>Detecting: <strong className="text-foreground">{liveDetection}</strong></>
              ) : (
                "Waiting for gesture…"
              )}
            </p>
          </div>
        )}
        {/* Buffer progress */}
        {status === "running" && bufferDisplay.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Confirmed signs:</span>
            {bufferDisplay.map((sign, i) => (
              <span
                key={i}
                className="rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary"
              >
                {sign}
              </span>
            ))}
            <span className="text-sm text-muted-foreground">
              ({bufferDisplay.length}/{BUFFER_TARGET})
            </span>
          </div>
        )}

        <p role="status" aria-live="polite" className="mt-3 text-lg">
          Status: {statusLabel}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {(status === "idle" || status === "stopped" || status === "error") ? (
            <Button size="lg" className="min-h-16 px-8 text-lg" onClick={startRecognition}>
              <Camera aria-hidden="true" />
              Start recognition
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="min-h-16 px-8 text-lg"
                disabled={status === "loading-model"}
                onClick={startRecognition}
              >
                {status === "loading-model" ? "Loading model…" : "Restart"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-16 text-lg"
                onClick={stopRecognition}
              >
                <CameraOff aria-hidden="true" />
                Stop camera
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="surface-panel p-6" aria-labelledby="s2t-result-heading">
        <h2 id="s2t-result-heading" className="text-2xl font-semibold">
          Recognised text
        </h2>
        {geminiLoading && (
          <p className="mt-2 text-sm text-muted-foreground animate-pulse">
            Sending signs to Gemini — generating sentence…
          </p>
        )}
        <label htmlFor="recognised" className="mt-3 block text-lg">
          You can also type or edit the phrase here.
        </label>
        <Textarea
          id="recognised"
          rows={3}
          className="mt-2 min-h-28 text-lg"
          value={recognised}
          onChange={(event) => setRecognised(event.target.value)}
          placeholder="Recognised phrase will appear here after 4 signs are detected"
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

