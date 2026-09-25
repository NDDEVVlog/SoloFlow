import { useMemo, useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { TaskTable } from '@/components/overview/TaskTable'
import { OverviewToolbar, useOverviewFilters } from '@/components/overview/OverviewToolbar'
import { NewTaskModal } from '@/components/overview/NewTaskModal'
import type { Task } from '@/models'

export function OverviewPage() {
  const { tasks, activeProjectId } = useTaskStore()
  const [filters, setFilters] = useOverviewFilters()
  const [showNewTask, setShowNewTask] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Chỉ lấy task thuộc Project hiện tại
      if (t.projectId && t.projectId !== activeProjectId) return false

      // 2. Lọc theo các bộ lọc Toolbar
      if (filters.search && !t.name.toLowerCase().includes(filters.search.toLowerCase()) && !t.id.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.role && t.role !== filters.role) return false
      if (filters.priority && t.priority !== filters.priority) return false
      if (filters.status && t.status !== filters.status) return false
      if (filters.sprintId && t.sprintId !== filters.sprintId) return false
      
      // LỌC THEO COMPLEXITY (POINT)
      if (filters.complexity && t.complexity.toString() !== filters.complexity) return false
      
      return true
    })
  }, [tasks, filters, activeProjectId])

  return (
    <div>
      <PageHeader
        title="Project overview"
        subtitle="The master backlog. Author every task here, then pull it into a sprint for My Work."
      />

      <div className="mb-5 flex items-center gap-2">
        <button 
          onClick={() => setViewMode('table')} 
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${viewMode === 'table' ? 'bg-accent text-white shadow' : 'bg-base-800 text-base-400 hover:text-base-100'}`}
        >
          Table View
        </button>
        <button 
          onClick={() => setViewMode('calendar')} 
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${viewMode === 'calendar' ? 'bg-accent text-white shadow' : 'bg-base-800 text-base-400 hover:text-base-100'}`}
        >
          Deadline Calendar
        </button>
      </div>

      <OverviewToolbar filters={filters} onChange={setFilters} onNewTask={() => setShowNewTask(true)} />
      
      {viewMode === 'table' ? (
        <TaskTable tasks={filtered} emptyLabel="No tasks match your filters." />
      ) : (
        <DeadlineCalendar tasks={filtered} />
      )}

      {showNewTask && <NewTaskModal onClose={() => setShowNewTask(false)} />}
    </div>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-base-50">{title}</h1>
      <p className="mt-1 text-sm text-base-400">{subtitle}</p>
    </div>
  )
}

function DeadlineCalendar({ tasks }: { tasks: Task[] }) {
  const upcoming = useMemo(() => {
    return tasks
      .filter((t) => t.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  }, [tasks])

  if (upcoming.length === 0) return (
    <div className="mt-4 rounded-xl border border-base-700 bg-base-900 p-10 text-center text-sm text-base-500">
      Không có task nào được đặt Deadline. Hãy vào Table View để cập nhật cột "Due".
    </div>
  )

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {upcoming.map(t => {
        const isOverdue = t.isOverdue()
        return (
          <div key={t.id} className={`flex flex-col justify-between rounded-xl border p-4 shadow-sm transition hover:bg-base-800/50 ${isOverdue ? 'border-signal-high/50 bg-signal-high/10' : 'border-base-700 bg-base-800/40'}`}>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isOverdue ? 'text-signal-high' : 'text-accent-bright'}`}>
                  {new Date(t.dueDate!).toLocaleDateString('vi-VN')}
                </span>
                <span className="text-xs text-base-400">{t.id}</span>
              </div>
              <div className="mb-2 line-clamp-2 text-sm font-semibold text-base-50">{t.name}</div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="rounded bg-base-800 px-2 py-1 text-base-300 border border-base-700">{t.role}</span>
              <span className={`rounded px-2 py-1 font-medium ${t.status === 'Done' ? 'bg-signal-ok/20 text-signal-ok' : 'bg-base-800 text-base-400'}`}>
                {t.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}