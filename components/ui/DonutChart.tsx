interface DonutSegment {
  label: string;
  value: number;
  colorClass: string; // tailwind stroke-* class
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

/**
 * Minimal dependency-free SVG donut chart. Built in-house rather than
 * pulling in a charting library for a single breakdown widget.
 */
export function DonutChart({ segments, size = 120, strokeWidth = 14, centerLabel, centerValue }: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offsetSoFar = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-neutral-100"
          strokeWidth={strokeWidth}
        />
        {segments.map((s, i) => {
          const fraction = s.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const dashoffset = -((offsetSoFar / total) * circumference);
          offsetSoFar += s.value;
          if (s.value === 0) return null;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              className={s.colorClass}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <p className="font-display font-bold text-neutral-900 text-lg leading-none">{centerValue}</p>}
          {centerLabel && <p className="text-[10px] text-neutral-400 mt-1">{centerLabel}</p>}
        </div>
      )}
    </div>
  );
}
