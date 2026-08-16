export function vibrationSupported() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export type HapticKind = "tap" | "success" | "error" | "warning" | "long";

const PATTERNS: Record<HapticKind, number[]> = {
  tap: [30],
  success: [40, 60, 40],
  error: [120, 80, 120, 80, 120],
  warning: [80, 60, 80],
  long: [300],
};

/** intensity 1-3 scales pulse duration (browsers expose no amplitude control). */
export function vibrate(kind: HapticKind, intensity = 2, enabled = true) {
  if (!enabled || !vibrationSupported()) return false;
  const scale = [0.6, 1, 1.6][intensity - 1] ?? 1;
  const pattern = PATTERNS[kind].map((ms) => Math.round(ms * scale));
  return navigator.vibrate(pattern);
}

export function vibratePattern(pattern: number[], intensity = 2, enabled = true) {
  if (!enabled || !vibrationSupported()) return false;
  const scale = [0.6, 1, 1.6][intensity - 1] ?? 1;
  return navigator.vibrate(pattern.map((ms) => Math.round(ms * scale)));
}

export function stopVibration() {
  if (vibrationSupported()) navigator.vibrate(0);
}
