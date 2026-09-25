interface BadgeProps {
  label: string
  fg: string
  bg: string
  dot?: string
  className?: string
}

/** Generic pill used for Priority, Status and Role tags — the three places
 * the spec calls for color-coded chips. Colors are passed in rather than
 * hard-coded so the same component serves all three vocabularies. */
export function Badge({ label, fg, bg, dot, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
      style={{ color: fg, backgroundColor: bg }}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />}
      {label}
    </span>
  )
}
