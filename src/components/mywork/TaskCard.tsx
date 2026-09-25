import { useDraggable } from '@dnd-kit/core'
import { Badge } from '@/components/common/Badge'
import { PRIORITY_STYLES, colorForRole } from '@/models/enums'
import type { Task } from '@/models'
import { formatDate } from '@/utils/time'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const p = PRIORITY_STYLES[task.priority]

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border border-base-700 bg-base-800 p-3 shadow-card transition hover:border-base-600 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] text-base-500">{task.id}</span>
        <Badge label={task.priority} fg={p.fg} bg={p.bg} dot={p.dot} className="!px-2 !py-0.5" />
      </div>
      <p className="mb-2.5 text-sm font-medium leading-snug text-base-100">{task.name}</p>
      <div className="flex items-center justify-between">
        <Badge label={task.role} fg="#fff" bg={colorForRole(task.role)} className="!px-2 !py-0.5" />
        <span className={`text-xs ${task.isOverdue() ? 'font-medium text-signal-high' : 'text-base-400'}`}>
          {formatDate(task.dueDate)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-base-400">
        <span>{task.estHours}h est</span>
        {task.checklist.total > 0 && (
          <span className="rounded-full bg-base-700 px-1.5 py-0.5 font-mono text-[11px]">
            {task.checklist.completed}/{task.checklist.total}
          </span>
        )}
      </div>
    </div>
  )
}
