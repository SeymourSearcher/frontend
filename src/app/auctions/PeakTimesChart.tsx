"use client";

interface PeakTimesChartProps {
  hourlyData: number[];
}

function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export default function PeakTimesChart({ hourlyData }: PeakTimesChartProps) {
  const data = hourlyData.length === 24 ? hourlyData : Array(24).fill(0);
  const maxCount = Math.max(...data, 1);
  const totalActivity = data.reduce((sum, c) => sum + c, 0);

  if (totalActivity === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
        <h3 className="text-[13px] text-[#ccc] mb-4">Activity by Hour (UTC)</h3>
        <div className="flex items-center justify-center h-[140px] text-[#666] text-[12px]">
          No hourly data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#2a2a2a]">
      <h3 className="text-[13px] text-[#ccc] mb-4">Activity by Hour (UTC)</h3>
      <div className="flex items-end gap-[2px] h-[140px]">
        {data.map((count, hour) => {
          const heightPx = Math.max((count / maxCount) * 130, 4);
          const isPeak = count === maxCount && count > 0;
          return (
            <div
              key={hour}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  isPeak
                    ? "bg-gradient-to-t from-[#43B581] to-[#5BEA9D]"
                    : "bg-gradient-to-t from-[#5865F2] to-[#7289DA]"
                } hover:opacity-80`}
                style={{ height: `${heightPx}px` }}
                title={`${formatHour(hour)}: ${count} auctions`}
              />
            </div>
          );
        })}
      </div>
      <div className="flex mt-1">
        {data.map((_, hour) => (
          <div key={hour} className="flex-1 text-center">
            {hour % 4 === 0 && (
              <span className="text-[8px] text-[#666]">{hour}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[9px] text-[#666]">
        <span>12 AM</span>
        <span>12 PM</span>
        <span>11 PM</span>
      </div>
    </div>
  );
}
