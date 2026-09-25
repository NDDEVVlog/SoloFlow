import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { TASK_STATUSES, type TaskStatus } from '@/models/enums'
import type { Task } from '@/models'
import { useTaskStore } from '@/store/useTaskStore'
import { KanbanColumn } from './KanbanColumn'
import { TaskDetailModal } from '@/components/overview/TaskDetailModal'

interface KanbanBoardProps {
  tasks: Task[]
}

/** The drag-and-drop board: one droppable column per TaskStatus, one
 * draggable card per task. Dropping a card on a column just calls
 * `setTaskStatus` — the store is the only thing that knows how a status
 * change should ripple into workload/overload numbers. */
export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const setTaskStatus = useTaskStore((s) => s.setTaskStatus)
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as TaskStatus
    if (TASK_STATUSES.includes(newStatus)) {
      setTaskStatus(active.id as string, newStatus)
    }
  }

  const openTask = tasks.find((t) => t.id === openTaskId)

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onCardClick={setOpenTaskId}
          />
        ))}
      </div>
      {openTask && <TaskDetailModal task={openTask} onClose={() => setOpenTaskId(null)} />}
    </DndContext>
  )
}
