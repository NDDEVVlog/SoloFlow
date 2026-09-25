import type { ViewMode } from '@/store/useTaskStore'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-base-700 bg-base-800 p-0.5">
      {(['kanban', 'list'] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
            value === mode ? 'bg-accent text-white' : 'text-base-400 hover:text-base-100'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
