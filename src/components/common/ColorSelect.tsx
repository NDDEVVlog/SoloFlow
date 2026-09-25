export interface ColorSelectOption {
  value: string
  label: string
  fg?: string
  bg?: string
}

interface ColorSelectProps {
  value: string
  options: ColorSelectOption[]
  onChange: (value: string) => void
  /** Trailing action item (e.g. "+ New role…") rendered as a plain option
   * with no color — selecting it is handled by the caller in onChange. */
  actionOption?: { value: string; label: string }
  placeholder?: string
}

/**
 * A `<select>` styled to look like the read-only Badge it replaces, so a
 * list row can go from "click to open the modal" to "edit right here"
 * without changing the row's visual language. Native <select> is used
 * (rather than a custom dropdown) to keep keyboard/accessibility behaviour
 * for free — the trade-off is that the open dropdown's own option list
 * can't be recolored cross-browser, only the closed control can.
 */
export function ColorSelect({ value, options, onChange, actionOption, placeholder = 'Unassigned' }: ColorSelectProps) {
  const current = options.find((o) => o.value === value)
  const fg = current?.fg ?? '#94A0B3'
  const bg = current?.bg ?? '#242C39'

  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border-none px-2.5 py-1 text-xs font-medium outline-none ring-0 transition focus:ring-2 focus:ring-accent"
      style={{ color: fg, backgroundColor: bg }}
    >
      {/* Only synthesize a blank "Unassigned" option when the field is
          actually optional (current value is '' and no option already
          covers it) — required fields like Role/Priority/Status never
          hit this, so they don't gain a spurious blank choice. */}
      {value === '' && !options.some((o) => o.value === '') && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
      {actionOption && (
        <option value={actionOption.value} className="text-accent">
          {actionOption.label}
        </option>
      )}
    </select>
  )
}
