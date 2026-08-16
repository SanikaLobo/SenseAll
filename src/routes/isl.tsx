import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Play, Pause, RotateCcw, Camera, CameraOff, Grid2x2,
  Volume2, Copy, BookOpen, Zap, RefreshCw, CheckCircle2, Hand,
} from "lucide-react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
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

// ── Sign player motion classes ───────────────────────────────────────────────
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

// ── Constants ─────────────────────────────────────────────────────────────────
const ROBOFLOW_API_KEY = "rf_c7rnF41caQUNdCaF2OOuzwzExHS2";
const ROBOFLOW_PROJECT = "isl-actions";
const ROBOFLOW_VERSION = 3;

// ── Detection pipeline constants ───────────────────────────────────────────
const DETECT_INTERVAL_MS   = 250;  // 250ms between inference runs
const CONFIDENCE_THRESHOLD = 0.50; // 50% confidence minimum for Roboflow
const VOTE_WINDOW          = 8;    // sliding window size (frames)
const VOTE_REQUIRED        = 5;    // frames that must agree (62.5%)
const CONFIRM_COOLDOWN_MS  = 2000; // 2s cooldown after confirmation
const BUFFER_TARGET        = 4;    // signs before Gemini call
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// MediaPipe model URL (CDN hosted WASM)
const MEDIAPIPE_WASM =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

// All 18 gestures in the Roboflow isl-actions v3 model.
// Keys are lowercased versions of the class names the model returns.
const SUPPORTED_GESTURES: Record<string, { emoji: string; description: string }> = {
  "hello":       { emoji: "👋", description: "Wave with open palm" },
  "namaste":     { emoji: "🙏", description: "Both palms pressed together" },
  "thank you":   { emoji: "🤲", description: "Open hand moved from chin forward" },
  "good":        { emoji: "👍", description: "Thumbs up gesture" },
  "yes":         { emoji: "✅", description: "Fist nodded up and down" },
  "sorry":       { emoji: "🙇", description: "Fist circles over chest" },
  "bye":         { emoji: "🫡", description: "Wave goodbye" },
  "morning":     { emoji: "🌅", description: "Arm raised from horizon upward" },
  "name":        { emoji: "🏷️", description: "Two fingers tapped on wrist" },
  "i am fine":   { emoji: "😊", description: "Hand moved outward from chest" },
  "afternoon":   { emoji: "☀️", description: "Midday greeting gesture" },
  "deaf":        { emoji: "🦻", description: "Point to ear then mouth" },
  "home":        { emoji: "🏠", description: "Fingertips touching, forming a roof" },
  "how are you": { emoji: "🤔", description: "Combined question gesture" },
  "i":           { emoji: "🫵", description: "Point to self" },
  "indian":      { emoji: "🇮🇳", description: "Salute gesture" },
  "live":        { emoji: "🌱", description: "Hands moving upward" },
  "time":        { emoji: "⏰", description: "Tap wrist like a watch" },
};

// Helper: normalise a raw class string from the model
const normaliseClass = (raw: string): string => raw.toLowerCase().trim();

// Get emoji for a normalised class name
const gestureEmoji = (cls: string): string => SUPPORTED_GESTURES[cls]?.emoji ?? "🤟";

// ── MediaPipe landmark-based gesture classifier ────────────────────────────
// Uses the 21 hand landmarks from MediaPipe HandLandmarker to classify ISL
// gestures directly — much more reliable than Roboflow for these gestures.
//
// Landmark indices:
//   0 = wrist
//   1-4 = thumb (MCP, IP, tip at 4)
//   5-8 = index  (MCP at 5, PIP at 6, tip at 8)
//   9-12 = middle (MCP at 9, PIP at 10, tip at 12)
//   13-16 = ring  (MCP at 13, PIP at 14, tip at 16)
//   17-20 = pinky (MCP at 17, PIP at 18, tip at 20)
//
// Coordinate system: x=0-1 left→right, y=0-1 top→bottom

type Landmark = { x: number; y: number; z: number };
type HandLandmarks = Landmark[];

type FingerState = {
  thumb: boolean; index: boolean; middle: boolean; ring: boolean; pinky: boolean;
  count: number;  // number of extended fingers
};

type GestureResult = { label: string; confidence: number } | null;

/** Returns which fingers are extended on a hand */
function fingerState(hand: HandLandmarks): FingerState {
  // Use distance from wrist (0) to tip vs PIP joint to determine if extended.
  // This is completely rotation-invariant and robust to camera angles.
  const index  = dist(hand[0], hand[8])  > dist(hand[0], hand[6]);
  const middle = dist(hand[0], hand[12]) > dist(hand[0], hand[10]);
  const ring   = dist(hand[0], hand[16]) > dist(hand[0], hand[14]);
  const pinky  = dist(hand[0], hand[20]) > dist(hand[0], hand[18]);
  
  // Thumb folds across the palm. Compare tip (4) distance to pinky base (17).
  // When extended, tip is far from pinky base. When folded, it's close.
  const thumb = dist(hand[4], hand[17]) > dist(hand[3], hand[17]);

  const count = [thumb, index, middle, ring, pinky].filter(Boolean).length;
  return { thumb, index, middle, ring, pinky, count };
}

/** Euclidean distance between two landmarks (normalised 0-1) */
function dist(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Classify ISL gesture from MediaPipe hand landmarks.
 * Returns { label, confidence } or null if the gesture is uncertain.
 * Confidence represents how cleanly the landmark pattern matches.
 */
function classifyFromLandmarks(hands: HandLandmarks[]): GestureResult {
  if (hands.length === 0) return null;

  const h1 = hands[0];
  const h2 = hands[1] ?? null;
  const f1 = fingerState(h1);

  // ── TWO-HAND GESTURES ────────────────────────────────────────────────────
  if (h2) {
    const f2          = fingerState(h2);
    const wristDist   = dist(h1[0], h2[0]);

    // Namaste 🙏: both wrists very close together, both hands open fingers
    // Hands are pressed palm-to-palm, so wrists nearly overlap
    if (wristDist < 0.22 && f1.count >= 3 && f2.count >= 3) {
      // Extra check: wrists are in the middle of the frame (not at extremes)
      const wristMidX = (h1[0].x + h2[0].x) / 2;
      if (wristMidX > 0.25 && wristMidX < 0.75) {
        return { label: "namaste", confidence: 0.88 };
      }
    }

    // Home 🏠: wrists apart but FINGERTIPS close (forming a triangle/roof)
    // The tips of index+middle fingers of both hands meet at the top
    const avgTip1 = { x: (h1[8].x + h1[12].x) / 2, y: (h1[8].y + h1[12].y) / 2, z: 0 };
    const avgTip2 = { x: (h2[8].x + h2[12].x) / 2, y: (h2[8].y + h2[12].y) / 2, z: 0 };
    const tipDist = dist(avgTip1, avgTip2 as Landmark);
    if (tipDist < 0.18 && wristDist > 0.18 && f1.count >= 3 && f2.count >= 3) {
      return { label: "home", confidence: 0.87 };
    }

    // Live 🌱: both wrists raised (y < 0.45 = upper half of frame), open hands, wrists apart
    if (
      h1[0].y < 0.5 && h2[0].y < 0.5 &&
      f1.count >= 3 && f2.count >= 3 &&
      wristDist > 0.25
    ) {
      return { label: "live", confidence: 0.75 };
    }

    // How are you 🤔: two hands in mid-frame, one open one with pointing gesture
    if ((f1.count >= 4 && f2.count === 1) || (f1.count === 1 && f2.count >= 4)) {
      return { label: "how are you", confidence: 0.72 };
    }
  }

  // ── SINGLE-HAND GESTURES ─────────────────────────────────────────────────

  // Thumbs up 👍 (good / i am fine): only thumb extended, all others curled
  if (f1.thumb && !f1.index && !f1.middle && !f1.ring && !f1.pinky) {
    // Thumb pointing up (tip above wrist y)
    if (h1[4].y < h1[0].y) {
      return { label: "good", confidence: 0.92 };
    }
  }

  // Point to self 🫵 (I): ONLY index finger extended
  if (!f1.thumb && f1.index && !f1.middle && !f1.ring && !f1.pinky) {
    return { label: "i", confidence: 0.90 };
  }

  // V-sign / two fingers (name 🏷️): index + middle extended, others curled
  if (!f1.thumb && f1.index && f1.middle && !f1.ring && !f1.pinky) {
    return { label: "name", confidence: 0.85 };
  }

  // Fist 👊 (yes ✅ / sorry 🙇): all fingers curled, count 0-1
  if (f1.count <= 1 && !f1.thumb) {
    // Sorry: wrist in upper half of frame (chest area) + circular motion not detectable
    // Just classify as "yes" (more common confirmation sign)
    return { label: "yes", confidence: 0.82 };
  }

  // Three fingers pointing (deaf 🦻): thumb + index + middle
  if (f1.thumb && f1.index && f1.middle && !f1.ring && !f1.pinky) {
    return { label: "deaf", confidence: 0.78 };
  }

  // Open hand / flat palm (hello 👋 / bye / thank you / morning / afternoon / indian)
  if (f1.count >= 4) {
    const isHorizontal = Math.abs(h1[12].x - h1[0].x) > Math.abs(h1[12].y - h1[0].y);
    const isHigh = h1[0].y < 0.4; // Wrist in upper portion of frame
    
    // Salute (Indian) 🇮🇳: Hand is open, horizontal, and brought up to the head
    if (isHorizontal && isHigh) {
      return { label: "indian", confidence: 0.86 };
    }
    
    // Morning 🌅: Open hand raised upward (but vertical, not horizontal salute)
    if (isHigh) return { label: "morning", confidence: 0.74 };
    
    // Default open hand
    return { label: "hello", confidence: 0.78 };
  }

  // Time ⏰ (tap wrist): index pointing down toward other wrist area
  if (f1.index && !f1.middle && !f1.ring && !f1.pinky && h1[8].y > h1[0].y) {
    return { label: "time", confidence: 0.73 };
  }

  return null; // Couldn't classify — let Roboflow try
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roboflow: any;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RoboflowModel = any;

// ── Main component ────────────────────────────────────────────────────────────
function SignToText() {
  const { prefs } = usePrefs();

  // Refs — video / canvas / streams
  const videoRef  = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef  = useRef<RoboflowModel | null>(null);
  const inferIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // MediaPipe hand landmarker — used as a pre-gate for Roboflow
  const handDetectorRef = useRef<HandLandmarker | null>(null);

  // Pipeline state refs (mutated in tight loop, no re-render needed)
  const voteWindowRef    = useRef<string[]>([]);
  const bufferRef        = useRef<string[]>([]);
  const lastAddedRef     = useRef<string>("");
  const cooldownUntilRef = useRef<number>(0);
  const voteProgressRef  = useRef<{ cls: string; count: number }>({ cls: "", count: 0 });

  // UI state
  type Status = "idle" | "loading-model" | "running" | "stopped" | "error";
  const [status, setStatus]           = useState<Status>("idle");
  const [liveLabel, setLiveLabel]     = useState<string>("");
  const [liveConf, setLiveConf]       = useState<number>(0);
  const [voteProgress, setVoteProgress] = useState<number>(0);
  const [handsDetected, setHandsDetected] = useState<number>(0); // 0, 1 or 2 hands
  const [bufferDisplay, setBufferDisplay] = useState<string[]>([]);
  const [recognised, setRecognised]   = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [sdkReady, setSdkReady]       = useState(false);
  const [mpReady, setMpReady]         = useState(false); // MediaPipe loaded

  // Check Roboflow SDK readiness
  useEffect(() => {
    const check = () => { if (window.roboflow) setSdkReady(true); };
    check();
    const id = setInterval(check, 500);
    return () => clearInterval(id);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const stopEverything = useCallback(() => {
    if (inferIntervalRef.current) {
      clearInterval(inferIntervalRef.current);
      inferIntervalRef.current = null;
    }
    if (modelRef.current) {
      try { modelRef.current.teardown(); } catch { /* ignore */ }
      modelRef.current = null;
    }
    if (handDetectorRef.current) {
      try { handDetectorRef.current.close(); } catch { /* ignore */ }
      handDetectorRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const resetAccumulation = () => {
    voteWindowRef.current    = [];
    bufferRef.current        = [];
    lastAddedRef.current     = "";
    cooldownUntilRef.current = 0;
    voteProgressRef.current  = { cls: "", count: 0 };
  };

  // ── Camera ───────────────────────────────────────────────────────────────

  const startCamera = async (): Promise<boolean> => {
    if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
      setStatus("error");
      toast.error("Camera requires HTTPS or localhost. Open http://localhost:8081 instead.", { duration: 8000 });
      return false;
    }
    if (!navigator?.mediaDevices?.getUserMedia) {
      setStatus("error");
      toast.error("Camera API unavailable. Please open via http://localhost:8081", { duration: 8000 });
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 800 }, height: { ideal: 600 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return true;
    } catch (err) {
      setStatus("error");
      const name = err instanceof Error ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        toast.error("Camera access denied. Grant permission in browser settings.", { duration: 7000 });
      } else if (name === "NotFoundError") {
        toast.error("No camera found on this device.", { duration: 7000 });
      } else {
        toast.error("Camera error. Please reload and try again.", { duration: 7000 });
      }
      return false;
    }
  };

  // ── MediaPipe hand detector initialisation ───────────────────────────────
  const initHandDetector = async (): Promise<void> => {
    try {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM);
      handDetectorRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      setMpReady(true);
      console.log("[SenseAll] MediaPipe HandLandmarker ready");
    } catch (err) {
      console.warn("[SenseAll] MediaPipe init failed — will still run Roboflow without gate:", err);
      setMpReady(true); // fall-through: operate without MP gate
    }
  };

  // ── Roboflow model ────────────────────────────────────────────────────────

  const loadModel = (): Promise<RoboflowModel> =>
    new Promise((resolve, reject) => {
      if (!window.roboflow) {
        reject(new Error("Roboflow SDK not loaded. Refresh the page and try again."));
        return;
      }
      window.roboflow
        .auth({ publishable_key: ROBOFLOW_API_KEY })
        .load({
          model: ROBOFLOW_PROJECT,
          version: ROBOFLOW_VERSION,
          onMetadata: () => console.log("[SenseAll] ISL model loaded"),
        })
        .then(resolve)
        .catch(reject);
    });

  // ── Canvas helpers ────────────────────────────────────────────────────────

  const adjustCanvas = (w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.getContext("2d")?.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  // Draw MediaPipe hand skeleton onto canvas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawHandLandmarks = (landmarks: any[][], ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],   // thumb
      [0,5],[5,6],[6,7],[7,8],   // index
      [0,9],[9,10],[10,11],[11,12], // middle
      [0,13],[13,14],[14,15],[15,16], // ring
      [0,17],[17,18],[18,19],[19,20], // pinky
      [5,9],[9,13],[13,17],       // palm
    ];
    for (const hand of landmarks) {
      // Draw connections
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth   = 2;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur  = 4;
      for (const [a, b] of CONNECTIONS) {
        const p1 = hand[a], p2 = hand[b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      // Draw keypoints
      for (const pt of hand) {
        ctx.beginPath();
        ctx.arc(pt.x * w, pt.y * h, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawBoxes = (detections: any[], ctx: CanvasRenderingContext2D) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detections.forEach((raw: any) => {
      const d = { ...raw.bbox, class: raw.class, color: raw.color ?? "#f59e0b", confidence: raw.confidence };
      const x = d.x - d.width / 2;
      const y = d.y - d.height / 2;
      const fontSize = 13;
      const label = `${d.class} ${Math.round(d.confidence * 100)}%`;

      ctx.beginPath();
      ctx.lineWidth   = 2.5;
      ctx.strokeStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur  = 8;
      ctx.rect(x, y, d.width, d.height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle   = d.color;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(x, y, d.width, d.height);
      ctx.globalAlpha = 1;

      const labelW = ctx.measureText(label).width + 12;
      ctx.fillStyle = d.color;
      ctx.fillRect(x - 1, y - fontSize - 6, labelW, fontSize + 6);
      ctx.font      = `bold ${fontSize}px monospace`;
      ctx.fillStyle = "#000";
      ctx.textAlign = "left";
      ctx.fillText(label, x + 4, y - 2);
    });
  };

  // ── Gemini API ────────────────────────────────────────────────────────────

  const callGemini = async (signs: string[]) => {
    const apiKey = prefs.geminiApiKey.trim();
    const rawText = signs.join(" ");

    if (!apiKey) {
      setRecognised(rawText);
      addHistory({ kind: "isl", text: rawText, detail: "Sign → Text (raw, no Gemini key)" });
      toast.warning("Add a Gemini API key in Settings for natural sentences.", { duration: 6000 });
      return;
    }

    setGeminiLoading(true);
    const prompt =
      `You are an expert Indian Sign Language (ISL) interpreter. ` +
      `The following are ISL gloss labels detected by a computer vision model in sequence: "${rawText}". ` +
      `Convert them into a natural, grammatically correct, concise English sentence. ` +
      `Reply with ONLY the sentence — no explanation, no quotes, no commentary.`;

    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
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
      toast.success("Gesture sentence ready!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setRecognised(rawText);
      toast.error(`Gemini error: ${msg}. Showing raw signs.`, { duration: 7000 });
    } finally {
      setGeminiLoading(false);
    }
  };

  // ── Detection loop ────────────────────────────────────────────────────────
  //
  // TWO-STAGE PIPELINE:
  //   Stage 1 — MediaPipe HandLandmarker: detect if real hands are present.
  //             If no hands found → clear everything, no Roboflow call.
  //             Draw hand skeleton on canvas.
  //   Stage 2 — Roboflow ISL model: classify the gesture. Only runs when
  //             Stage 1 confirms ≥1 hand.
  //   Voting  — Sliding window majority vote (VOTE_REQUIRED / VOTE_WINDOW)
  //             prevents noisy single-frame confirmations.

  const detect = async (model: RoboflowModel) => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== 4) return;

    const frameW = video.videoWidth;
    const frameH = video.videoHeight;
    video.width  = frameW;
    video.height = frameH;
    adjustCanvas(frameW, frameH);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── Stage 1: MediaPipe hand presence check ────────────────────────────
    let numHands = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handLandmarks: any[][] = [];

    if (handDetectorRef.current) {
      try {
        const mpResult = handDetectorRef.current.detectForVideo(video, Date.now());
        handLandmarks = mpResult.landmarks ?? [];
        numHands = handLandmarks.length;
      } catch {
        // MediaPipe failed — fall through and still try Roboflow
      }
    }

    setHandsDetected(numHands);

    // If MediaPipe is loaded but finds NO hands → push empty into vote window
    // and skip Roboflow entirely (this eliminates face/background FP)
    if (handDetectorRef.current && numHands === 0) {
      // Draw hand skeleton (nothing to draw, just clear)
      // Push empty vote to window so the bar drains down
      const win = voteWindowRef.current;
      win.push("");
      if (win.length > VOTE_WINDOW) win.shift();
      setLiveLabel("");
      setLiveConf(0);

      // Recount votes
      const counts: Record<string, number> = {};
      for (const cls of win) { if (cls) counts[cls] = (counts[cls] ?? 0) + 1; }
      let leadCount = 0;
      for (const cnt of Object.values(counts)) { if (cnt > leadCount) leadCount = cnt; }
      setVoteProgress(leadCount);
      return;
    }

    // Draw hand skeleton when hands are present
    if (handLandmarks.length > 0) {
      drawHandLandmarks(handLandmarks, ctx, frameW, frameH);
    }

    // ── Stage 2: Classify gesture ─────────────────────────────────────────
    //
    // PRIMARY: MediaPipe landmark classifier (fast, no network, works on actual
    //          hand shapes — doesn't depend on Roboflow model quality).
    // FALLBACK: Roboflow model for gestures that landmark rules can't cover.

    // Helper to draw a synthetic bounding box around MediaPipe landmarks
    const createSyntheticBox = (label: string, conf: number) => {
      let minX = 1, minY = 1, maxX = 0, maxY = 0;
      for (const hand of handLandmarks) {
        for (const p of hand) {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
      }
      minX = Math.max(0, minX - 0.05);
      maxX = Math.min(1, maxX + 0.05);
      minY = Math.max(0, minY - 0.05);
      maxY = Math.min(1, maxY + 0.05);
      return {
        bbox: {
          x: ((minX + maxX) / 2) * frameW,
          y: ((minY + maxY) / 2) * frameH,
          width: (maxX - minX) * frameW,
          height: (maxY - minY) * frameH
        },
        class: label,
        confidence: conf / 100,
        color: "#34d399" // Green indicating MediaPipe high-confidence
      };
    };

    // Step 2a: Try landmark classifier first
    const mpGesture = classifyFromLandmarks(handLandmarks as HandLandmarks[]);

    let topClass = "";
    let topConf  = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let finalBoxes: any[] = [];

    if (mpGesture && mpGesture.confidence >= 0.70) {
      // Landmark classifier gave a confident answer → use it
      topClass = mpGesture.label;
      topConf  = Math.round(mpGesture.confidence * 100);
      finalBoxes = [createSyntheticBox(topClass, topConf)];
    } else {
      // Step 2b: Fall back to Roboflow for gestures landmarks can't classify
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let allDetections: any[] = [];
      try {
        allDetections = await model.detect(video);
      } catch {
        // Roboflow failed — use landmark result even if low confidence
        if (mpGesture) { 
          topClass = mpGesture.label; 
          topConf = Math.round(mpGesture.confidence * 100);
          finalBoxes = [createSyntheticBox(topClass, topConf)];
        }
      }

      if (allDetections.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filtered = allDetections.filter((d: any) => (d.confidence ?? 0) >= CONFIDENCE_THRESHOLD);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filtered.sort((a: any, b: any) => (b.confidence ?? 0) - (a.confidence ?? 0));
        const top = filtered[0];
        if (top) {
          const rfClass = normaliseClass(top.class as string);
          const rfConf  = Math.round((top.confidence ?? 0) * 100);
          // Use Roboflow result only if it's meaningfully more confident
          // than the landmark result (or landmark gave nothing)
          if (!mpGesture || rfConf > topConf + 10) {
            topClass = rfClass;
            topConf  = rfConf;
            finalBoxes = filtered; // Draw Roboflow's native bounding boxes
          } else {
            // Keep landmark result
            topClass = mpGesture.label;
            topConf  = Math.round(mpGesture.confidence * 100);
            finalBoxes = [createSyntheticBox(topClass, topConf)];
          }
        } else if (mpGesture) {
          topClass = mpGesture.label;
          topConf  = Math.round(mpGesture.confidence * 100);
          finalBoxes = [createSyntheticBox(topClass, topConf)];
        }
      } else if (mpGesture) {
        topClass = mpGesture.label;
        topConf  = Math.round(mpGesture.confidence * 100);
        finalBoxes = [createSyntheticBox(topClass, topConf)];
      }
    }

    setLiveLabel(topClass);
    setLiveConf(topConf);

    if (finalBoxes.length > 0) drawBoxes(finalBoxes, ctx);

    // ── Sliding window majority vote ─────────────────────────────────────
    const win = voteWindowRef.current;
    win.push(topClass);
    if (win.length > VOTE_WINDOW) win.shift();

    const counts: Record<string, number> = {};
    for (const cls of win) { if (cls) counts[cls] = (counts[cls] ?? 0) + 1; }

    let leadCls = ""; let leadCount = 0;
    for (const [cls, cnt] of Object.entries(counts)) {
      if (cnt > leadCount) { leadCls = cls; leadCount = cnt; }
    }

    voteProgressRef.current = { cls: leadCls, count: leadCount };
    setVoteProgress(leadCount);

    // ── Confirm when majority + cooldown passed ───────────────────────────
    const now = Date.now();
    if (leadCls && leadCount >= VOTE_REQUIRED && leadCls !== lastAddedRef.current && now > cooldownUntilRef.current) {
      lastAddedRef.current     = leadCls;
      cooldownUntilRef.current = now + CONFIRM_COOLDOWN_MS;
      voteWindowRef.current    = [];
      setVoteProgress(0);

      bufferRef.current = [...bufferRef.current, leadCls];
      setBufferDisplay([...bufferRef.current]);
      vibrate("tap", prefs.hapticIntensity, prefs.haptics);
      toast.info(`✅ Confirmed: ${gestureEmoji(leadCls)} ${leadCls}`, { duration: 1500 });

      if (bufferRef.current.length >= BUFFER_TARGET) {
        const captured = [...bufferRef.current];
        bufferRef.current    = [];
        lastAddedRef.current = "";
        setLiveLabel("");
        setLiveConf(0);
        setBufferDisplay([]);
        await callGemini(captured);
      }
    }
  };

  // ── Start / stop ──────────────────────────────────────────────────────────

  const startRecognition = async () => {
    resetAccumulation();
    setRecognised("");
    setLiveLabel("");
    setLiveConf(0);
    setHandsDetected(0);
    setBufferDisplay([]);
    setStatus("loading-model");

    const cameraOk = await startCamera();
    if (!cameraOk) return;

    // Initialise MediaPipe hand detector (runs in parallel with model load)
    initHandDetector().catch(console.warn);

    try {
      const model = await loadModel();
      modelRef.current = model;
      setStatus("running");
      inferIntervalRef.current = setInterval(() => { detect(model); }, DETECT_INTERVAL_MS);
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
    setLiveLabel("");
    setLiveConf(0);
  };

  // ── Status label ─────────────────────────────────────────────────────────
  const statusLabel = {
    idle: "Camera off — ready to start",
    "loading-model": "Loading ISL model…",
    running: "Recognising signs — perform gestures in front of camera",
    stopped: "Stopped",
    error: "Error — see instructions below",
  }[status];

  const isActive = status === "running";
  const isIdle = status === "idle" || status === "stopped" || status === "error";

  return (
    <div className="space-y-6">
      {/* ── Header info panel ─────────────────────────────────────── */}
      <section className="surface-panel p-6" aria-labelledby="s2t-heading">
        <h2 id="s2t-heading" className="text-2xl font-semibold">Sign to text</h2>
        <p className="mt-2 rounded-xl border border-border bg-muted p-4 text-base">
          <strong>Powered by Roboflow ISL model (isl-actions v3) + Gemini.</strong>{" "}
          Hold each ISL gesture clearly in frame. The system uses a{" "}
          <strong>majority-vote window</strong> — a gesture must appear in{" "}
          <strong>{VOTE_REQUIRED} of {VOTE_WINDOW} recent frames</strong> at{" "}
          <strong>≥{Math.round(CONFIDENCE_THRESHOLD * 100)}% confidence</strong> to be confirmed.
          After <strong>{BUFFER_TARGET} confirmed signs</strong> they are sent to Gemini.
          There is a <strong>{CONFIRM_COOLDOWN_MS / 1000}s cooldown</strong> after each confirm to prevent duplicates.
        </p>

        {/* SDK not loaded warning */}
        {!sdkReady && (
          <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
            ⚠️ Roboflow SDK loading… If this persists after 5 seconds, refresh the page.
          </p>
        )}

        {/* No Gemini key warning */}
        {!prefs.geminiApiKey && (
          <p className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-base text-amber-700 dark:text-amber-400">
            ⚠️ No Gemini API key set — signs will be shown as raw labels.{" "}
            <Link to="/settings" className="underline underline-offset-2">
              Add key in Settings
            </Link>
            .
          </p>
        )}

        {/* ── Video + canvas ───────────────────────────────────────── */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-muted">
          {/* Placeholder when not running */}
          {!isActive && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-muted/90">
              <Camera className="size-14 text-muted-foreground/40" />
              <p className="text-lg text-muted-foreground">Camera preview will appear here</p>
            </div>
          )}
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

        {/* ── Live detection indicator ─────────────────────────────── */}
        {isActive && (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Hand detection status badge */}
              <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
                handsDetected > 0
                  ? "bg-green-500/20 text-green-500"
                  : "bg-destructive/20 text-destructive"
              }`}>
                <Hand className="size-3.5" aria-hidden="true" />
                {handsDetected > 0 ? `${handsDetected} hand${handsDetected > 1 ? "s" : ""} detected` : "No hands in frame"}
              </span>
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <p className="text-base font-medium text-muted-foreground">
                {liveLabel ? (
                  <>
                    Seeing:{" "}
                    <strong className="text-foreground">
                      {gestureEmoji(liveLabel)} {liveLabel}
                    </strong>
                    <span className="ml-2 text-sm text-muted-foreground">({liveConf}%)</span>
                  </>
                ) : (
                  "Waiting for gesture — show hands clearly in frame…"
                )}
              </p>
            </div>

            {/* Confidence bar */}
            {liveLabel && (
              <div className="flex items-center gap-3">
                <span className="w-24 text-right text-sm text-muted-foreground">Confidence</span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${liveConf}%` }}
                  />
                </div>
                <span className="w-10 text-sm font-semibold text-primary">{liveConf}%</span>
              </div>
            )}

            {/* Vote progress bar — shows accumulation toward confirmation */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right text-sm text-muted-foreground">Vote progress</span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    voteProgress >= VOTE_REQUIRED ? "bg-green-500" : "bg-amber-400"
                  }`}
                  style={{ width: `${Math.min((voteProgress / VOTE_WINDOW) * 100, 100)}%` }}
                />
              </div>
              <span className="w-16 text-xs font-semibold text-muted-foreground">
                {voteProgress}/{VOTE_REQUIRED} votes
              </span>
            </div>
          </div>
        )}

        {/* ── Buffer display ───────────────────────────────────────── */}
        {bufferDisplay.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">Confirmed signs:</span>
            {bufferDisplay.map((sign, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary"
              >
                <CheckCircle2 className="size-3.5" />
                {gestureEmoji(sign)} {sign}
              </span>
            ))}
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
              {bufferDisplay.length}/{BUFFER_TARGET}
            </span>
          </div>
        )}

        {/* Status line */}
        <p role="status" aria-live="polite" className="mt-4 flex items-center gap-2 text-base">
          {isActive && <Zap className="size-4 text-primary animate-pulse" />}
          {status === "loading-model" && <RefreshCw className="size-4 animate-spin text-primary" />}
          <span>{statusLabel}</span>
        </p>

        {/* Error guidance */}
        {status === "error" && (
          <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            <p className="font-semibold text-destructive dark:text-red-400">Camera access failed</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90">
              <li>
                <strong>Using network IP?</strong> Browsers block camera on plain HTTP IP URLs (e.g. 192.168.x.x). Open{" "}
                <code className="rounded bg-muted px-1">http://localhost:8081</code> on this device.
              </li>
              <li>
                <strong>Permission denied?</strong> Click the camera icon in the browser address bar and grant camera access.
              </li>
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex flex-wrap gap-3">
          {isIdle ? (
            <Button
              size="lg"
              className="min-h-16 px-8 text-lg"
              onClick={startRecognition}
              disabled={!sdkReady}
            >
              <Camera aria-hidden="true" />
              {sdkReady ? "Start recognition" : "SDK loading…"}
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="min-h-16 px-8 text-lg"
                disabled={status === "loading-model"}
                onClick={startRecognition}
              >
                {status === "loading-model" ? (
                  <><RefreshCw className="animate-spin" /> Loading model…</>
                ) : (
                  <><RotateCcw /> Restart</>
                )}
              </Button>
              <Button size="lg" variant="outline" className="min-h-16 text-lg" onClick={stopRecognition}>
                <CameraOff aria-hidden="true" />
                Stop camera
              </Button>
            </>
          )}
        </div>
      </section>

      {/* ── Gesture reference panel ───────────────────────────────────────── */}
      <section className="surface-panel p-6" aria-labelledby="gesture-ref-heading">
        <h2 id="gesture-ref-heading" className="text-2xl font-semibold">
          All 18 Supported Gestures
        </h2>
        <p className="mt-1 text-base text-muted-foreground">
          These are all ISL gestures recognised by the Roboflow model. Hold each pose
          steady — highlighted when actively detected.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Object.entries(SUPPORTED_GESTURES).map(([label, info]) => {
            const isLive = liveLabel === label && isActive;
            const isInBuffer = bufferDisplay.includes(label);
            return (
              <div
                key={label}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-300 ${
                  isInBuffer
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : isLive
                    ? "border-primary/60 bg-primary/5 scale-105"
                    : "border-border bg-card"
                }`}
              >
                {isInBuffer && (
                  <span className="absolute right-2 top-2">
                    <CheckCircle2 className="size-4 text-primary" />
                  </span>
                )}
                <span className="text-4xl">{info.emoji}</span>
                <span className="text-sm font-bold capitalize text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground leading-tight">{info.description}</span>
                {isLive && (
                  <span className="mt-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground animate-pulse">
                    LIVE {liveConf}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ── Recognised text output ────────────────────────────────────────── */}
      <section className="surface-panel p-6" aria-labelledby="s2t-result-heading">
        <h2 id="s2t-result-heading" className="text-2xl font-semibold">Recognised text</h2>
        {geminiLoading && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <RefreshCw className="size-4 animate-spin" />
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
          placeholder={`Recognised phrase appears here after ${BUFFER_TARGET} gestures are confirmed`}
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
