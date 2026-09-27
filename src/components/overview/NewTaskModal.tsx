import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { useTaskStore } from '@/store/useTaskStore'
import { PRIORITIES, TASK_TYPES } from '@/models/enums'
import type { Priority, TaskType } from '@/models'

const inputCls =
  'w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-base-100 placeholder-base-400 outline-none focus:border-accent'
const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-base-400'

interface NewTaskModalProps {
  onClose: () => void
  onCreated?: (taskId: string) => void
}

export function NewTaskModal({ onClose, onCreated }: NewTaskModalProps) {
  const { createTask, addChecklistItem, roles, sprints, currentSprintId } = useTaskStore()
  const [name, setName] = useState('')
  const [role, setRole] = useState(roles[0] ?? '')
  const [type, setType] = useState<TaskType>('Task')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [estHours, setEstHours] = useState(1)
  const [sprintId, setSprintId] = useState<string>(currentSprintId ?? '')
  
  const [checklistItems, setChecklistItems] = useState<string[]>([])
  const [newChecklist, setNewChecklist] = useState('')

  const submit = () => {
    if (!name.trim() || !role) return
    const task = createTask({ name: name.trim(), role, type, priority, estHours, sprintId: sprintId || null })
    
    checklistItems.forEach((item) => {
      addChecklistItem(task.id, item)
    })

    onCreated?.(task.id)
    onClose()
  }

  const handleAddChecklist = () => {
    if (newChecklist.trim()) {
      setChecklistItems((prev) => [...prev, newChecklist.trim()])
      setNewChecklist('')
    }
  }

  return (
    <Modal onClose={onClose} widthClassName="max-w-md">
      <form
        className="p-6"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <h2 className="mb-4 text-base font-semibold text-base-50">New task</h2>
        <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-2">
          <div>
            <label className={labelCls}>Task name</label>
            <input autoFocus className={inputCls} placeholder="e.g. Balance boss HP curve" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Role</label>
              <input 
                className={inputCls} 
                list="role-options" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="Chọn hoặc gõ role mới..." 
              />
              <p className="mt-1 text-[10px] text-base-500">Gõ tên mới để tự động tạo Role.</p>
              <datalist id="role-options">
                {roles.map((r) => <option key={r} value={r} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as TaskType)}>
                {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Est. hours</label>
              <input type="number" step="0.5" min="0" className={inputCls} value={estHours} onChange={(e) => setEstHours(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Sprint / Tuần</label>
              <select className={inputCls} value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
                <option value="">Unassigned</option>
                {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            
            <div className="col-span-2 mt-2 border-t border-base-700 pt-4">
              <label className={labelCls}>Checklist (Tùy chọn)</label>
              
              {checklistItems.length > 0 && (
                <div className="mb-3 space-y-2">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded bg-base-900 px-3 py-1.5 text-sm border border-base-700">
                      <span className="text-base-300">{item}</span>
                      <button 
                        type="button" 
                        onClick={() => setChecklistItems((prev) => prev.filter((_, i) => i !== idx))} 
                        className="text-base-500 hover:text-signal-high"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Thêm mục checklist mới..."
                  value={newChecklist}
                  onChange={(e) => setNewChecklist(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddChecklist()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddChecklist}
                  className="rounded-lg bg-base-800 px-4 py-2 text-sm font-medium text-base-200 transition hover:bg-base-700"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2 pt-4 border-t border-base-700">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-base-400 hover:text-base-100">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim">
            Create task
          </button>
        </div>
      </form>
    </Modal>
  )
}