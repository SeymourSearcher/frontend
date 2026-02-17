"use client";

import { ReactNode, useEffect, useState } from "react";

interface StatItemProps {
  label: ReactNode;
  value: number;
  duration?: number;
}

function useCountUp(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const steps = 30;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

export function StatItem({ label, value, duration = 500 }: StatItemProps) {
  const animatedValue = useCountUp(value, duration);

  return (
    <div className="flex flex-col items-center">
      <span className="text-[14px]">{label}</span>
      <span className="text-[14px]">{animatedValue.toLocaleString()}</span>
    </div>
  );
}

