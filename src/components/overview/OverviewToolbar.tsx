import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'

export interface OverviewFilters {
  search: string
  role: string
  priority: string
  status: string
  sprintId: string
  complexity: string // NEW
}

export function useOverviewFilters() {
  const [filters, setFilters] = useState<OverviewFilters>({
    search: '',
    role: '',
    priority: '',
    status: '',
    sprintId: '',
    complexity: '',
  })
  return [filters, setFilters] as const
}

export function OverviewToolbar({
  filters,
  onChange,
  onNewTask,
}: {
  filters: OverviewFilters
  onChange: (f: OverviewFilters) => void
  onNewTask: () => void
}) {
  const { roles, sprints } = useTaskStore()

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search tasks..."
        className="min-w-[200px] flex-1 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <select
        className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-200 outline-none focus:border-accent"
        value={filters.role}
        onChange={(e) => onChange({ ...filters, role: e.target.value })}
      >
        <option value="">All roles</option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <select
        className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-200 outline-none focus:border-accent"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value })}
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-200 outline-none focus:border-accent"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">All statuses</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* FILTER MỚI CHO STORY POINTS */}
      <select
        className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-200 outline-none focus:border-accent"
        value={filters.complexity}
        onChange={(e) => onChange({ ...filters, complexity: e.target.value })}
      >
        <option value="">All points</option>
        <option value="1">1 Point</option>
        <option value="2">2 Points</option>
        <option value="3">3 Points</option>
        <option value="5">5 Points</option>
        <option value="8">8 Points</option>
      </select>

      <select
        className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-200 outline-none focus:border-accent"
        value={filters.sprintId}
        onChange={(e) => onChange({ ...filters, sprintId: e.target.value })}
      >
        <option value="">All sprints</option>
        {sprints.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <button
        onClick={onNewTask}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dim"
      >
        + New task
      </button>
    </div>
  )
}