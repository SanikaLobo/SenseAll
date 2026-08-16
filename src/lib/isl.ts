/**
 * Curated Indian Sign Language phrase library for the prototype.
 * Each entry describes the sign in words plus a simple keyframe script that the
 * SignPlayer renders. This is a demo representation, NOT machine-generated
 * signing, and the UI must label it as such.
 *
 * The shape is intentionally data-driven so a future ML-powered ISL generation
 * service can supply the same structure.
 */

export type SignKeyframe = {
  /** Short caption shown while this keyframe plays */
  caption: string;
  /** Hand glyph used by the prototype player */
  glyph: string;
  /** Movement hint used for the animation */
  motion: "still" | "up" | "down" | "left" | "right" | "circle";
};

export type Sign = {
  id: string;
  gloss: string;
  category: string;
  description: string;
  keyframes: SignKeyframe[];
};

export const SIGN_LIBRARY: Sign[] = [
  {
    id: "i",
    gloss: "I",
    category: "Pronouns",
    description: "Index finger pointing to the chest.",
    keyframes: [{ caption: "Point to chest", glyph: "☝️", motion: "still" }],
  },
  {
    id: "afternoon",
    gloss: "AFTERNOON",
    category: "Time",
    description: "Flat hand moving forward and down, representing the sun setting.",
    keyframes: [{ caption: "Hand moves down", glyph: "🫳", motion: "down" }],
  },
  {
    id: "bye",
    gloss: "BYE",
    category: "Greetings",
    description: "Hand raised, waving side to side.",
    keyframes: [{ caption: "Wave hand", glyph: "👋", motion: "left" }],
  },
  {
    id: "hello",
    gloss: "HELLO",
    category: "Greetings",
    description: "Open palm near the forehead, moved outward in a small arc.",
    keyframes: [
      { caption: "Open palm at forehead", glyph: "🖐️", motion: "still" },
      { caption: "Move outward", glyph: "🤚", motion: "right" },
    ],
  },
  {
    id: "home",
    gloss: "HOME",
    category: "Places",
    description: "Fingertips touched to the cheek, then to the ear.",
    keyframes: [
      { caption: "Fingertips to cheek", glyph: "🤏", motion: "still" },
      { caption: "Move to ear", glyph: "🤙", motion: "right" },
    ],
  },
  {
    id: "how-are-you",
    gloss: "HOW ARE YOU",
    category: "Conversation",
    description: "Both hands point forward, then tilt up.",
    keyframes: [
      { caption: "Hands forward", glyph: "👉", motion: "still" },
      { caption: "Tilt up", glyph: "👐", motion: "up" },
    ],
  },
  {
    id: "i-am-fine",
    gloss: "I AM FINE",
    category: "Conversation",
    description: "Thumb touching the chest, fingers spread outward.",
    keyframes: [{ caption: "Thumb on chest", glyph: "🖐️", motion: "still" }],
  },
  {
    id: "indian",
    gloss: "INDIAN",
    category: "General",
    description: "Thumb touching the center of the forehead (like a bindi).",
    keyframes: [{ caption: "Thumb on forehead", glyph: "👍", motion: "still" }],
  },
  {
    id: "live",
    gloss: "LIVE",
    category: "General",
    description: "Both thumbs up, moving upward from the waist.",
    keyframes: [{ caption: "Thumbs up moving", glyph: "👍", motion: "up" }],
  },
  {
    id: "morning",
    gloss: "MORNING",
    category: "Time",
    description: "Flat hand moving upward, representing the sun rising.",
    keyframes: [{ caption: "Hand moves up", glyph: "🫴", motion: "up" }],
  },
  {
    id: "namaste",
    gloss: "NAMASTE",
    category: "Greetings",
    description: "Both palms pressed together in front of the chest.",
    keyframes: [{ caption: "Palms together", glyph: "🙏", motion: "still" }],
  },
  {
    id: "name",
    gloss: "NAME",
    category: "Conversation",
    description: "Two fingers of each hand tapped together twice.",
    keyframes: [{ caption: "Fingers tap twice", glyph: "✌️", motion: "down" }],
  },
  {
    id: "sorry",
    gloss: "SORRY",
    category: "Responses",
    description: "Fist circled over the chest.",
    keyframes: [{ caption: "Fist circles chest", glyph: "✊", motion: "circle" }],
  },
  {
    id: "thank-you",
    gloss: "THANK YOU",
    category: "Greetings",
    description: "Flat hand from the chin moving forward and down.",
    keyframes: [
      { caption: "Flat hand at chin", glyph: "🤲", motion: "still" },
      { caption: "Move forward and down", glyph: "🙏", motion: "down" },
    ],
  },
  {
    id: "time",
    gloss: "TIME",
    category: "Time",
    description: "Index finger tapping the wrist (as if pointing to a watch).",
    keyframes: [{ caption: "Tap wrist", glyph: "👇", motion: "down" }],
  },
];

const FINGERSPELL_GLYPH = "🫳";

/** Translate free text into a sequence of signs, falling back to fingerspelling. */
export function textToSigns(text: string): Sign[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const output: Sign[] = [];
  let index = 0;
  while (index < words.length) {
    const pair = `${words[index]} ${words[index + 1] ?? ""}`.trim();
    const pairMatch = SIGN_LIBRARY.find((s) => s.id.replace("-", " ") === pair);
    if (pairMatch) {
      output.push(pairMatch);
      index += 2;
      continue;
    }
    const word = words[index] as string;
    const match = SIGN_LIBRARY.find((s) => s.id === word || s.gloss.toLowerCase() === word);
    if (match) {
      output.push(match);
    } else {
      output.push({
        id: `spell-${word}-${index}`,
        gloss: word.toUpperCase(),
        category: "Fingerspelled",
        description: `Not in the curated library — fingerspelled letter by letter.`,
        keyframes: word.split("").map((letter) => ({
          caption: `Letter ${letter.toUpperCase()}`,
          glyph: FINGERSPELL_GLYPH,
          motion: "still" as const,
        })),
      });
    }
    index += 1;
  }
  return output;
}
