import { ReactNode } from "react";

interface StatItemProps {
  label: ReactNode;
  value: number;
}

export function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[14px]">{label}</span>
      <span className="text-[14px]">{value}</span>
    </div>
  );
}

