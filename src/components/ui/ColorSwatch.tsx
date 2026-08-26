const SIZE_CLASSES = {
  sm: "w-4 h-4 rounded-md",
  md: "w-5 h-5 rounded",
  lg: "w-10 h-10 rounded-md",
} as const;

interface ColorSwatchProps {
  hex: string;
  size: keyof typeof SIZE_CLASSES;
}

export function ColorSwatch({ hex, size }: ColorSwatchProps) {
  return (
    <div
      className={`${SIZE_CLASSES[size]} shrink-0`}
      style={{ backgroundColor: `#${hex}` }}
    />
  );
}
