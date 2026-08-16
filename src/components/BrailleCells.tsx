import type { BrailleCell } from "@/lib/braille";

export function BrailleDots({
  dots,
  size = "md",
}: {
  dots: number[];
  size?: "sm" | "md" | "lg";
}) {
  const dotSize = size === "lg" ? "size-5" : size === "sm" ? "size-2.5" : "size-3.5";
  const gap = size === "lg" ? "gap-2" : "gap-1.5";
  return (
    <span className={`grid grid-cols-2 grid-rows-3 ${gap}`} aria-hidden="true">
      {[1, 4, 2, 5, 3, 6].map((dot) => (
        <span
          key={dot}
          className={`${dotSize} rounded-full ${
            dots.includes(dot) ? "bg-primary" : "bg-muted-foreground/25"
          }`}
        />
      ))}
    </span>
  );
}

export function BrailleCellGrid({
  cells,
  onCellActivate,
  size = "md",
}: {
  cells: BrailleCell[];
  onCellActivate?: (cell: BrailleCell) => void;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <ul className="flex flex-wrap gap-3">
      {cells.map((cell, index) => {
        const content = (
          <>
            <BrailleDots dots={cell.dots} size={size} />
            <span className="mt-2 block text-sm text-muted-foreground">
              {cell.label === "space" ? "␣" : cell.label}
            </span>
          </>
        );
        return (
          <li key={`${cell.label}-${index}`}>
            {onCellActivate ? (
              <button
                type="button"
                onClick={() => onCellActivate(cell)}
                className="flex min-h-24 min-w-16 flex-col items-center rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:bg-accent"
                aria-label={`Braille cell for ${cell.label}. Dots ${cell.dots.join(", ") || "none"}. Activate to feel the pattern.`}
              >
                {content}
              </button>
            ) : (
              <span className="flex min-h-24 min-w-16 flex-col items-center rounded-xl border border-border bg-card px-3 py-3">
                {content}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
