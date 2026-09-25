import { useDroppable } from '@dnd-kit/core'
import type { Task, TaskStatus } from '@/models'
import { STATUS_STYLES } from '@/models/enums'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onCardClick: (taskId: string) => void
}

export function KanbanColumn({ status, tasks, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const style = STATUS_STYLES[status]
  const totalEst = Math.round(tasks.reduce((sum, t) => sum + t.estHours, 0) * 10) / 10

  return (
    <div
      ref={setNodeRef}
      className={`flex w-72 shrink-0 flex-col rounded-xl border bg-base-900/60 transition ${
        isOver ? 'border-accent' : 'border-base-700'
      }`}
    >
      <div className="flex items-center justify-between border-b border-base-700 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: style.dot }} />
          <span className="text-sm font-medium text-base-100">{status}</span>
          <span className="rounded-full bg-base-800 px-1.5 py-0.5 text-xs text-base-400">{tasks.length}</span>
        </div>
        <span className="text-xs text-base-500">{totalEst}h</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-2.5 py-2.5" style={{ minHeight: 120, maxHeight: 'calc(100vh - 320px)' }}>
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onClick={() => onCardClick(t.id)} />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-base-700 px-3 py-6 text-center text-xs text-base-600">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
