import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { colorForRole } from '@/models/enums'

export function TaskDetailModal({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const { tasks, sprints, updateTask, deleteTask, addChecklistItem, toggleChecklistItem, removeChecklistItem, addComment } = useTaskStore()
  const task = tasks.find(t => t.id === taskId)
  
  const [newChecklist, setNewChecklist] = useState('')
  const [newComment, setNewComment] = useState('')

  if (!task) return null

  const isDone = task.status === 'Done'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-xl border border-base-700 bg-base-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="mb-1 text-xs font-medium text-base-500 font-mono">
              {task.id} • Updated {new Date(task.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
            <h2 className="text-2xl font-bold text-base-50">{task.name}</h2>
          </div>
          <button onClick={onClose} className="text-base-400 hover:text-white">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CÁC THUỘC TÍNH (GRID 1) */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Role</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.role}
              onChange={(e) => updateTask(task.id, { role: e.target.value })}
            >
              <option value="Developer">Developer</option>
              <option value="Game Design">Game Design</option>
              <option value="UI/UX">UI/UX</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Type</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.type}
              onChange={(e) => updateTask(task.id, { type: e.target.value as any })}
            >
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Priority</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as any })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Status</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* CÁC THUỘC TÍNH (GRID 2 - BAO GỒM ĐIỂM POINT) */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Est. Time (h)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.estHours}
              onChange={(e) => updateTask(task.id, { estHours: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Actual Time (h)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.actualHours}
              onChange={(e) => updateTask(task.id, { actualHours: Number(e.target.value) })}
            />
          </div>
          
          {/* Ô CHỌN STORY POINTS */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Story Points</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.complexity || 2}
              onChange={(e) => updateTask(task.id, { complexity: Number(e.target.value) })}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Sprint / Tuần</label>
            <select
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.sprintId || ''}
              onChange={(e) => updateTask(task.id, { sprintId: e.target.value || null })}
            >
              <option value="">Backlog (Unassigned)</option>
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Due Date</label>
            <input
              type="date"
              className="rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={task.dueDate || ''}
              onChange={(e) => updateTask(task.id, { dueDate: e.target.value || null })}
            />
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-signal-high/10 px-2.5 py-0.5 text-xs font-semibold text-signal-high border border-signal-high/20">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-high"></div>
            {task.priority}
          </span>
          <span 
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-base-950"
            style={{ backgroundColor: colorForRole(task.role) }}
          >
            {task.role}
          </span>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-base-500">Description</label>
          <textarea
            className="w-full rounded-lg border border-base-700 bg-base-900 p-3 text-sm text-base-50 outline-none focus:border-accent min-h-[100px]"
            placeholder="Describe the work..."
            value={task.description}
            onChange={(e) => updateTask(task.id, { description: e.target.value })}
          />
        </div>

        {/* CHECKLIST */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-base-500">Checklist</label>
            <span className="text-xs text-base-500">{task.checklist.items.filter(i=>i.done).length}/{task.checklist.items.length}</span>
          </div>
          
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-base-800">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${task.checklistProgress()}%` }}></div>
          </div>

          <div className="mb-3 space-y-2">
            {task.checklist.items.map(item => (
              <div key={item.id} className="group flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={item.done} 
                    onChange={() => toggleChecklistItem(task.id, item.id)}
                    className="h-4 w-4 rounded border-base-700 bg-base-900 text-accent focus:ring-0 focus:ring-offset-0"
                  />
                  <span className={`text-sm ${item.done ? 'text-base-600 line-through' : 'text-base-300'}`}>{item.label}</span>
                </label>
                <button 
                  onClick={() => removeChecklistItem(task.id, item.id)}
                  className="hidden text-base-600 hover:text-signal-high group-hover:block"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add checklist item..."
              className="flex-1 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
              value={newChecklist}
              onChange={(e) => setNewChecklist(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newChecklist.trim()) {
                  addChecklistItem(task.id, newChecklist.trim())
                  setNewChecklist('')
                }
              }}
            />
            <button
              onClick={() => {
                if (newChecklist.trim()) {
                  addChecklistItem(task.id, newChecklist.trim())
                  setNewChecklist('')
                }
              }}
              className="rounded-lg bg-base-800 px-4 py-2 text-sm font-medium text-base-200 transition hover:bg-base-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-auto flex items-center justify-between border-t border-base-800 pt-5">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(task.id)
                onClose()
              }
            }}
            className="text-sm font-medium text-base-500 transition hover:text-signal-high"
          >
            Delete task
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-base-800 px-6 py-2.5 text-sm font-semibold text-base-50 transition hover:bg-base-700"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  )
}