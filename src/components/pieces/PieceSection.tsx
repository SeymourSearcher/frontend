import type { ReactNode } from "react";

export const LINK_CLASS = "text-[#5865F2] no-underline hover:underline";

interface PieceSectionProps {
  title: string;
  note?: string;
  children: ReactNode;
}

export function PieceSection({ title, note, children }: PieceSectionProps) {
  return (
    <section className="mt-8">
      <h2 className="text-[#f0f0f0] text-[14px] mb-1">{title}</h2>
      {note && <p className="text-[#666] text-[11px] mb-3">{note}</p>}
      {children}
    </section>
  );
}
