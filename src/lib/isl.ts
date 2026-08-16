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
    id: "help",
    gloss: "HELP",
    category: "Urgent",
    description: "Closed fist resting on the open opposite palm, lifted together.",
    keyframes: [
      { caption: "Fist on open palm", glyph: "✊", motion: "still" },
      { caption: "Lift both hands", glyph: "🙌", motion: "up" },
    ],
  },
  {
    id: "water",
    gloss: "WATER",
    category: "Needs",
    description: "Three fingers tapped at the side of the mouth.",
    keyframes: [
      { caption: "Fingers near mouth", glyph: "🤟", motion: "still" },
      { caption: "Tap twice", glyph: "👋", motion: "down" },
    ],
  },
  {
    id: "food",
    gloss: "FOOD",
    category: "Needs",
    description: "Fingertips brought together toward the mouth.",
    keyframes: [
      { caption: "Fingertips together", glyph: "🤌", motion: "still" },
      { caption: "Move to mouth", glyph: "🤏", motion: "up" },
    ],
  },
  {
    id: "doctor",
    gloss: "DOCTOR",
    category: "Health",
    description: "Two fingers placed on the opposite wrist, as if checking a pulse.",
    keyframes: [
      { caption: "Fingers to wrist", glyph: "✌️", motion: "still" },
      { caption: "Press gently", glyph: "🤝", motion: "down" },
    ],
  },
  {
    id: "medicine",
    gloss: "MEDICINE",
    category: "Health",
    description: "Middle finger circled in the opposite open palm.",
    keyframes: [
      { caption: "Finger in palm", glyph: "🖖", motion: "still" },
      { caption: "Circle motion", glyph: "🤲", motion: "circle" },
    ],
  },
  {
    id: "yes",
    gloss: "YES",
    category: "Responses",
    description: "Fist nodding forward from the wrist.",
    keyframes: [{ caption: "Fist nods forward", glyph: "👍", motion: "down" }],
  },
  {
    id: "no",
    gloss: "NO",
    category: "Responses",
    description: "Index and middle finger tapping the thumb.",
    keyframes: [{ caption: "Fingers tap thumb", glyph: "👎", motion: "left" }],
  },
  {
    id: "please",
    gloss: "PLEASE",
    category: "Greetings",
    description: "Flat palm circled over the chest.",
    keyframes: [{ caption: "Palm circles chest", glyph: "🤲", motion: "circle" }],
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
    id: "store",
    gloss: "STORE",
    category: "Places",
    description: "Both bent hands swinging forward from the shoulders.",
    keyframes: [
      { caption: "Bent hands at shoulders", glyph: "🫱", motion: "still" },
      { caption: "Swing forward", glyph: "🫲", motion: "right" },
    ],
  },
  {
    id: "sorry",
    gloss: "SORRY",
    category: "Responses",
    description: "Fist circled over the chest.",
    keyframes: [{ caption: "Fist circles chest", glyph: "✊", motion: "circle" }],
  },
  {
    id: "name",
    gloss: "NAME",
    category: "Conversation",
    description: "Two fingers of each hand tapped together twice.",
    keyframes: [{ caption: "Fingers tap twice", glyph: "✌️", motion: "down" }],
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
