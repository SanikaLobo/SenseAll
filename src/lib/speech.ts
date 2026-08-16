import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------- Text to speech ---------------- */

// Keep a global reference to prevent the utterance from being garbage collected mid-speech,
// which is a known bug in Safari and Chrome.
let activeUtterance: SpeechSynthesisUtterance | null = null;

// Cloud TTS fallback for browsers where native SpeechSynthesis is completely broken
function playCloudFallback(text: string) {
  try {
    console.log("[TTS] Attempting cloud TTS fallback...");
    // Public TTS endpoint (often used for simple translation audio, limited to ~200 chars)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text.slice(0, 200))}`;
    const audio = new Audio(url);
    audio.play().catch((e) => console.error("[TTS] Cloud fallback failed:", e));
  } catch (e) {
    console.error("[TTS] Fallback error:", e);
  }
}

export function speak(text: string, rate = 1) {
  if (typeof window === "undefined") return false;
  
  if (!("speechSynthesis" in window)) {
    console.warn("[TTS] Speech Synthesis API not supported. Using fallback.");
    playCloudFallback(text);
    return true;
  }
  
  let fallbackTimer: ReturnType<typeof setTimeout>;

  const play = () => {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();
      
      activeUtterance = new SpeechSynthesisUtterance(text);
      activeUtterance.rate = rate;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const defaultVoice = voices.find((v) => v.default) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (defaultVoice) {
          activeUtterance.voice = defaultVoice;
        }
      }
      
      activeUtterance.onstart = () => {
        clearTimeout(fallbackTimer); // Successfully started native TTS
      };

      activeUtterance.onerror = (e) => {
        console.error("[TTS] Native error:", e);
        clearTimeout(fallbackTimer);
        playCloudFallback(text);
      };

      activeUtterance.onend = () => {
        activeUtterance = null;
      };
      
      window.speechSynthesis.speak(activeUtterance);
    } catch (err) {
      console.error("[TTS] Native API crash:", err);
      playCloudFallback(text);
    }
  };

  // If the browser's native TTS doesn't trigger 'onstart' within 1.5 seconds,
  // we assume it's permanently broken/stuck and trigger the cloud fallback.
  fallbackTimer = setTimeout(() => {
    console.warn("[TTS] Native TTS timed out (stuck in queue). Triggering fallback.");
    playCloudFallback(text);
  }, 1500);

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      play();
      window.speechSynthesis.onvoiceschanged = null;
    };
    play();
  } else {
    play();
  }
  
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function speechSynthesisSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/* ---------------- Speech recognition ---------------- */

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function useSpeechRecognition(lang = "en-IN") {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<RecognitionLike | null>(null);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setError(null);
    setInterim("");
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) setTranscript((prev) => (prev ? `${prev} ${finalText.trim()}` : finalText.trim()));
      setInterim(interimText);
    };
    recognition.onerror = (event: any) => {
      setError(
        event?.error === "not-allowed"
          ? "Microphone permission was denied. Allow microphone access or type instead."
          : "We couldn't hear that clearly. Try again or type your message.",
      );
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };
    ref.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang]);

  const stop = useCallback(() => {
    ref.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterim("");
    setError(null);
  }, []);

  return { supported, listening, transcript, interim, error, start, stop, reset, setTranscript };
}

/* ---------------- Context-aware correction ---------------- */

export type Suggestion = {
  original: string;
  corrected: string;
  reason: string;
  confidence: number;
};

type Rule = { pattern: RegExp; replace: string; reason: string; confidence: number };

const RULES: Rule[] = [
  {
    pattern: /\bmedical stool\b/gi,
    replace: "medical store",
    reason: '"stool" is unlikely after "medical" in a travel sentence.',
    confidence: 0.93,
  },
  {
    pattern: /\bbus tand\b|\bbus stant\b/gi,
    replace: "bus stand",
    reason: "Common recognition slip for a place name.",
    confidence: 0.9,
  },
  {
    pattern: /\bwater bottel\b|\bwater bottal\b/gi,
    replace: "water bottle",
    reason: "Spelling variant detected.",
    confidence: 0.88,
  },
  {
    pattern: /\bi need help lease\b/gi,
    replace: "I need help please",
    reason: '"lease" is likely "please" in a request.',
    confidence: 0.86,
  },
  {
    pattern: /\bdoctor appointment at\b(?=\s*$)/gi,
    replace: "doctor appointment at ",
    reason: "Sentence appears incomplete.",
    confidence: 0.55,
  },
  {
    pattern: /\bcall my mother board\b/gi,
    replace: "call my mother now",
    reason: "Phrase looks contextually inconsistent.",
    confidence: 0.72,
  },
  {
    pattern: /\bpolice tation\b/gi,
    replace: "police station",
    reason: "Missing consonant detected in a place name.",
    confidence: 0.91,
  },
  {
    pattern: /\bthank ew\b|\bthank u\b/gi,
    replace: "thank you",
    reason: "Recognized fragment expanded.",
    confidence: 0.9,
  },
];

/**
 * Suggests a contextual correction. Never rewrites silently — the UI must
 * always ask the user to confirm.
 */
export function analyzeContext(text: string): Suggestion | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    if (rule.pattern.test(trimmed)) {
      rule.pattern.lastIndex = 0;
      const corrected = trimmed.replace(rule.pattern, rule.replace).replace(/\s+/g, " ").trim();
      if (corrected.toLowerCase() !== trimmed.toLowerCase()) {
        return {
          original: trimmed,
          corrected,
          reason: rule.reason,
          confidence: rule.confidence,
        };
      }
    }
  }
  // Sentence-casing suggestion as a low-confidence fallback.
  const cased = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const punctuated = /[.?!]$/.test(cased) ? cased : `${cased}.`;
  if (punctuated !== trimmed) {
    return {
      original: trimmed,
      corrected: punctuated,
      reason: "Added sentence capitalisation and punctuation for clarity.",
      confidence: 0.6,
    };
  }
  return null;
}
