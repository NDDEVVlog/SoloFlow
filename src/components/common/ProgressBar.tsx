interface ProgressBarProps {
  percent: number
  color?: string
  trackClassName?: string
  height?: number
}

export function ProgressBar({ percent, color = '#7C6CF6', trackClassName = 'bg-base-700', height = 6 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className={`w-full overflow-hidden rounded-full ${trackClassName}`} style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
