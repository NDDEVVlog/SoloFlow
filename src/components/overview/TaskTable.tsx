import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { TaskDetailModal } from './TaskDetailModal'
import { colorForRole, STATUS_STYLES } from '@/models/enums'
import type { Task } from '@/models'

export function TaskTable({ tasks, emptyLabel }: { tasks: Task[]; emptyLabel?: string }) {
  const { sprints, updateTask } = useTaskStore()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-base-700 bg-base-900 p-10 text-center text-sm text-base-500">
        {emptyLabel || 'No tasks found.'}
      </div>
    )
  }

  return (
    <>
      <div className="mt-4 overflow-x-auto rounded-xl border border-base-700 bg-base-900 shadow-sm">
        <table className="w-full text-left text-sm text-base-300">
          <thead className="border-b border-base-700 bg-base-800/50 text-xs font-semibold uppercase tracking-wider text-base-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Task Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Point</th> {/* NEW COLUMN */}
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Est / Actual</th>
              <th className="px-4 py-3">Sprint</th>
              <th className="px-4 py-3">Checklist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-800">
            {tasks.map((task) => {
              const sprintName = sprints.find((s) => s.id === task.sprintId)?.name || '-'
              const isDone = task.status === 'Done'
              return (
                <tr
                  key={task.id}
                  className="group cursor-pointer transition hover:bg-base-800/40"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-base-500 font-mono">{task.id}</td>
                  <td className={`px-4 py-3 font-medium ${isDone ? 'text-base-500 line-through' : 'text-base-50'}`}>
                    {task.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-base-950"
                      style={{ backgroundColor: colorForRole(task.role) }}
                    >
                      {task.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-base-400">{task.type}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {/* HIỂN THỊ ĐIỂM (POINT) */}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-base-800 text-xs font-bold text-accent-bright border border-base-700">
                      {task.complexity || 2}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={`text-xs font-semibold ${task.priority === 'High' ? 'text-signal-high' : task.priority === 'Medium' ? 'text-signal-medium' : 'text-signal-low'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <select
                        className={`rounded px-2 py-1 text-xs font-medium border border-transparent outline-none transition focus:border-base-500 ${STATUS_STYLES[task.status]}`}
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Todo" className="bg-base-900 text-base-200">Todo</option>
                        <option value="In Progress" className="bg-base-900 text-base-200">In Progress</option>
                        <option value="Done" className="bg-base-900 text-base-200">Done</option>
                      </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    <span className={task.estHours > 0 ? '' : 'text-base-600'}>{task.estHours}h</span> 
                    <span className="text-base-600"> / </span> 
                    <span className={task.actualHours > task.estHours ? 'text-signal-high font-bold' : (task.actualHours > 0 ? 'text-signal-ok' : 'text-base-600')}>
                      {task.actualHours}h
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-base-400">{sprintName}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-base-800">
                          <div className="h-full bg-accent transition-all" style={{ width: `${task.checklistProgress()}%` }}></div>
                        </div>
                        <span className="text-xs text-base-500">{task.checklist.items.filter(i=>i.done).length}/{task.checklist.items.length}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {selectedTask && (
        <TaskDetailModal
          taskId={selectedTask.id}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}