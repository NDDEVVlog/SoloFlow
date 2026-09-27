import { useMemo, useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { OverloadIndicator } from '@/components/mywork/OverloadIndicator'
import { ViewToggle } from '@/components/mywork/ViewToggle'
import { KanbanBoard } from '@/components/mywork/KanbanBoard'
import { TaskTable } from '@/components/overview/TaskTable'
import { NewTaskModal } from '@/components/overview/NewTaskModal'
import { NewSprintModal } from '@/components/sprints/NewSprintModal'
import { ManageSprintsModal } from '@/components/sprints/ManageSprintsModal'
import { TaskDetailModal } from '@/components/overview/TaskDetailModal'
import { PageHeader } from './OverviewPage'

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export function MyWorkPage() {
  const { tasks, sprints, currentSprintId, setCurrentSprint, viewMode, setViewMode, activeProjectId, deleteTask } = useTaskStore()
  
  const [showNewTask, setShowNewTask] = useState(false)
  const [showNewSprint, setShowNewSprint] = useState(false)
  const [showManageSprints, setShowManageSprints] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const projectSprints = useMemo(() => sprints.filter(s => s.projectId === activeProjectId), [sprints, activeProjectId])

  const sprintTasks = useMemo(() => {
    return tasks.filter(t => {
      if (t.projectId !== activeProjectId) return false
      if (currentSprintId && t.sprintId !== currentSprintId) return false
      return true
    })
  }, [tasks, activeProjectId, currentSprintId])

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Task này không? Dữ liệu không thể phục hồi.')) {
      deleteTask(id)
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="My work" subtitle="What's actually on your plate this sprint." />
        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-lg border border-base-700 bg-base-800 focus-within:border-accent">
            <select
              className="bg-transparent px-2.5 py-1.5 text-sm text-base-200 outline-none cursor-pointer"
              value={currentSprintId ?? ''}
              onChange={(e) => setCurrentSprint(e.target.value || null)}
            >
              <option value="">All sprints</option>
              {projectSprints.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowManageSprints(true)}
              className="border-l border-base-700 px-2 py-1.5 text-base-400 hover:bg-base-700 hover:text-base-100 transition"
              title="Quản lý Sprints (Sửa/Xóa)"
            >
              <SettingsIcon />
            </button>
            <button
              onClick={() => setShowNewSprint(true)}
              className="border-l border-base-700 px-2.5 py-1.5 text-sm font-medium text-accent hover:bg-base-700 hover:text-accent-bright transition"
              title="Tạo Sprint mới"
            >
              +
            </button>
          </div>
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <button
            onClick={() => setShowNewTask(true)}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-accent-dim"
          >
            + New task
          </button>
        </div>
      </div>

      <OverloadIndicator tasks={sprintTasks} />

      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={sprintTasks} />
      ) : (
        <TaskTable 
          tasks={sprintTasks} 
          emptyLabel="Nothing scheduled in this sprint yet." 
          onEdit={setEditingTaskId}
          onDelete={handleDeleteTask}
        />
      )}

      {showNewTask && <NewTaskModal onClose={() => setShowNewTask(false)} />}
      {showNewSprint && <NewSprintModal onClose={() => setShowNewSprint(false)} />}
      {showManageSprints && <ManageSprintsModal onClose={() => setShowManageSprints(false)} />}
      
      {/* Modal chi tiết Task để update trạng thái & tiến độ */}
      {editingTaskId && (
        <TaskDetailModal 
          taskId={editingTaskId} 
          onClose={() => setEditingTaskId(null)} 
        />
      )}
    </div>
  )
}