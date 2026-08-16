// Grade 1 Unified English Braille mapping (dot-cell based, not decorative).
// Each cell is described by its raised dot numbers (1-6).

export type Cell = number[];

const LETTERS: Record<string, Cell> = {
  a: [1],
  b: [1, 2],
  c: [1, 4],
  d: [1, 4, 5],
  e: [1, 5],
  f: [1, 2, 4],
  g: [1, 2, 4, 5],
  h: [1, 2, 5],
  i: [2, 4],
  j: [2, 4, 5],
  k: [1, 3],
  l: [1, 2, 3],
  m: [1, 3, 4],
  n: [1, 3, 4, 5],
  o: [1, 3, 5],
  p: [1, 2, 3, 4],
  q: [1, 2, 3, 4, 5],
  r: [1, 2, 3, 5],
  s: [2, 3, 4],
  t: [2, 3, 4, 5],
  u: [1, 3, 6],
  v: [1, 2, 3, 6],
  w: [2, 4, 5, 6],
  x: [1, 3, 4, 6],
  y: [1, 3, 4, 5, 6],
  z: [1, 3, 5, 6],
};

const PUNCTUATION: Record<string, Cell> = {
  ",": [2],
  ";": [2, 3],
  ":": [2, 5],
  ".": [2, 5, 6],
  "?": [2, 3, 6],
  "!": [2, 3, 5],
  "'": [3],
  "-": [3, 6],
  "(": [1, 2, 3, 5, 6],
  ")": [2, 3, 4, 5, 6],
  "/": [3, 4],
  "&": [1, 2, 3, 4, 6],
  "#": [3, 4, 5, 6],
  "*": [1, 6],
  "+": [3, 4, 6],
  "=": [1, 2, 3, 4, 5, 6],
};

const NUMBER_SIGN: Cell = [3, 4, 5, 6];
const CAPITAL_SIGN: Cell = [6];
const DIGIT_TO_LETTER = "jabcdefghi";

export type BrailleCell = {
  /** Raised dots 1-6 */
  dots: Cell;
  /** Unicode braille glyph */
  glyph: string;
  /** Source character or indicator label */
  label: string;
  indicator?: "number" | "capital";
};

export function cellToGlyph(dots: Cell): string {
  const bit = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20];
  let code = 0x2800;
  for (const dot of dots) code |= bit[dot - 1] ?? 0;
  return String.fromCharCode(code);
}

export const BLANK_GLYPH = "\u2800";

export function textToCells(text: string): BrailleCell[] {
  const cells: BrailleCell[] = [];
  let inNumberRun = false;

  for (const char of text) {
    const lower = char.toLowerCase();

    if (char === " ") {
      inNumberRun = false;
      cells.push({ dots: [], glyph: BLANK_GLYPH, label: "space" });
      continue;
    }
    if (char === "\n") {
      inNumberRun = false;
      cells.push({ dots: [], glyph: "\n", label: "new line" });
      continue;
    }

    if (/[0-9]/.test(char)) {
      if (!inNumberRun) {
        inNumberRun = true;
        cells.push({
          dots: NUMBER_SIGN,
          glyph: cellToGlyph(NUMBER_SIGN),
          label: "number sign",
          indicator: "number",
        });
      }
      const letter = DIGIT_TO_LETTER[Number(char)] ?? "a";
      const digitCell = LETTERS[letter] ?? [1];
      cells.push({ dots: digitCell, glyph: cellToGlyph(digitCell), label: char });
      continue;
    }

    inNumberRun = false;

    if (LETTERS[lower]) {
      if (char !== lower) {
        cells.push({
          dots: CAPITAL_SIGN,
          glyph: cellToGlyph(CAPITAL_SIGN),
          label: "capital sign",
          indicator: "capital",
        });
      }
      cells.push({ dots: LETTERS[lower], glyph: cellToGlyph(LETTERS[lower]), label: char });
      continue;
    }

    if (PUNCTUATION[char]) {
      cells.push({ dots: PUNCTUATION[char], glyph: cellToGlyph(PUNCTUATION[char]), label: char });
      continue;
    }

    cells.push({ dots: [], glyph: BLANK_GLYPH, label: `unsupported: ${char}` });
  }

  return cells;
}

export function textToBraille(text: string): string {
  return textToCells(text)
    .map((c) => c.glyph)
    .join("");
}

/** Reverse mapping for the Braille keyboard: dots -> character. */
export function dotsToChar(dots: Cell): string | null {
  const key = [...dots].sort((a, b) => a - b).join("");
  for (const [char, cell] of Object.entries(LETTERS)) {
    if (cell.join("") === key) return char;
  }
  for (const [char, cell] of Object.entries(PUNCTUATION)) {
    if (cell.join("") === key) return char;
  }
  return null;
}

/** Vibration pattern derived from a cell: long pulse per raised dot. */
export function cellToVibration(dots: Cell): number[] {
  if (dots.length === 0) return [40];
  const pattern: number[] = [];
  for (let dot = 1; dot <= 6; dot++) {
    pattern.push(dots.includes(dot) ? 110 : 25);
    pattern.push(70);
  }
  return pattern;
}
