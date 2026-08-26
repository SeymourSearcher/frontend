const TONE_CLASSES = {
  muted: "text-[#888]",
  error: "text-red-400",
} as const;

interface StatusMessageProps {
  tone?: keyof typeof TONE_CLASSES;
  children: React.ReactNode;
}

export function StatusMessage({ tone = "muted", children }: StatusMessageProps) {
  return <p className={`${TONE_CLASSES[tone]} text-center`}>{children}</p>;
}
