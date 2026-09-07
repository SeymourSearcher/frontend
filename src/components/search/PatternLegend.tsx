const LITERALS = "0123456789ABCDEF";

// Repeated variables are the one thing a reader cannot infer from the text, so
// each distinct letter gets its own colour and the repeat becomes visible.
const VARIABLE_COLORS = ["#5865F2", "#43B581", "#FAA61A", "#F04747", "#B57EDC", "#00B0F4"];

const SLOT = "w-8 h-9 rounded flex items-center justify-center text-[14px] border";

type SlotKind = { kind: "literal" } | { kind: "wildcard" } | { kind: "variable"; index: number };

function classify(pattern: string): SlotKind[] {
  const seen = new Map<string, number>();
  return [...pattern].map((char) => {
    if (LITERALS.includes(char)) return { kind: "literal" };
    if (char === "?") return { kind: "wildcard" };
    if (!seen.has(char)) seen.set(char, seen.size);
    return { kind: "variable", index: seen.get(char)! };
  });
}

export function PatternLegend({ pattern }: { pattern: string }) {
  const slots = classify(pattern);
  const repeated = new Set(
    [...pattern].filter((c, i) => !LITERALS.includes(c) && c !== "?" && pattern.indexOf(c) !== i)
  );

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-1">
        {slots.map((slot, i) => {
          const color =
            slot.kind === "variable"
              ? VARIABLE_COLORS[slot.index % VARIABLE_COLORS.length]
              : undefined;
          return (
            <div
              key={i}
              className={`${SLOT} ${
                slot.kind === "literal"
                  ? "bg-[#252525] border-[#3a3a3a] text-[#eee]"
                  : slot.kind === "wildcard"
                    ? "bg-[#1a1a1a] border-dashed border-[#444] text-[#666]"
                    : "bg-[#1a1a1a] text-white"
              }`}
              style={color ? { borderColor: color, color } : undefined}
            >
              {pattern[i]}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-[#888]">
        Solid slots are fixed digits, dashed slots are any digit
        {repeated.size > 0 && (
          <>
            , and matching colours must hold the same digit (
            {[...repeated].join(", ")})
          </>
        )}
        .
      </p>
    </div>
  );
}
