import { cn } from '@/lib/utils';

interface ProgressRingProps {
  percentage: number;
  label: string;
  color?: 'accent' | 'primary' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

const colorMap = {
  accent: {
    stroke: 'stroke-accent-500',
    fill: 'text-accent-600',
  },
  primary: {
    stroke: 'stroke-primary-600',
    fill: 'text-primary-700',
  },
  warning: {
    stroke: 'stroke-warning-500',
    fill: 'text-warning-600',
  },
  success: {
    stroke: 'stroke-accent-500',
    fill: 'text-accent-600',
  },
};

const sizeMap = {
  sm: { size: 60, strokeWidth: 3, textSize: 'text-sm' },
  md: { size: 100, strokeWidth: 4, textSize: 'text-xl' },
  lg: { size: 140, strokeWidth: 5, textSize: 'text-3xl' },
};

export function ProgressRing({
  percentage,
  label,
  color = 'accent',
  size = 'md',
  showPercentage = true,
}: ProgressRingProps) {
  const config = sizeMap[size];
  const colors = colorMap[color];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: config.size, height: config.size }}>
        <svg width={config.size} height={config.size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            className="stroke-neutral-150"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.size / 2}
            cy={config.size / 2}
            r={radius}
            fill="none"
            className={cn(colors.stroke, 'transition-all duration-500')}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center content */}
        {showPercentage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('font-display font-bold', colors.fill, config.textSize)}>
              {percentage}%
            </span>
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-neutral-600 text-center max-w-20">
        {label}
      </p>
    </div>
  );
}
