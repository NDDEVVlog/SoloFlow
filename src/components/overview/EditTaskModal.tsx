import { useState, useEffect } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { Modal } from '@/components/common/Modal'
import { PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@/models/enums'

interface Props {
  taskId: string
  onClose: () => void
}

export function EditTaskModal({ taskId, onClose }: Props) {
  const { tasks, sprints, roles, updateTask, activeProjectId } = useTaskStore()
  
  const task = tasks.find((t) => t.id === taskId)
  const projectSprints = sprints.filter((s) => s.projectId === activeProjectId)

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [type, setType] = useState<any>('Task')
  const [priority, setPriority] = useState<any>('Medium')
  const [status, setStatus] = useState<any>('Todo')
  const [estHours, setEstHours] = useState(0)
  const [actualHours, setActualHours] = useState(0)
  const [complexity, setComplexity] = useState(2)
  const [sprintId, setSprintId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (task) {
      setName(task.name)
      setRole(task.role)
      setType(task.type)
      setPriority(task.priority)
      setStatus(task.status)
      setEstHours(task.estHours)
      setActualHours(task.actualHours)
      setComplexity(task.complexity)
      setSprintId(task.sprintId || '')
      setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
      setDescription(task.description || '')
    }
  }, [task])

  if (!task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !role.trim()) return

    updateTask(taskId, {
      name: name.trim(),
      role: role.trim(),
      type,
      priority,
      status,
      estHours: Number(estHours),
      actualHours: Number(actualHours),
      complexity: Number(complexity),
      sprintId: sprintId || null,
      dueDate: dueDate || null,
      description: description.trim(),
    })
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-5 text-xl font-semibold text-base-50">Cập nhật Task: {task.id}</h2>
      <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Tên công việc</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Role</label>
            <input type="text" list="role-options" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" required />
            <datalist id="role-options">{roles.map((r) => <option key={r} value={r} />)}</datalist>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Sprint</label>
            <select value={sprintId} onChange={(e) => setSprintId(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none">
              <option value="">Backlog (Không có Sprint)</option>
              {projectSprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Loại</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none">
              {TASK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Độ ưu tiên</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Trạng thái</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none">
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Est. Hours</label>
            <input type="number" min="0" step="0.5" value={estHours} onChange={(e) => setEstHours(Number(e.target.value))} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Actual Hours</label>
            <input type="number" min="0" step="0.5" value={actualHours} onChange={(e) => setActualHours(Number(e.target.value))} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-base-300">Story Point</label>
            <select value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none">
              <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={5}>5</option><option value={8}>8</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Deadline (Due Date)</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Mô tả</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none" />
        </div>

        <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-base-700">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-base-400 transition hover:bg-base-800 hover:text-base-50">Hủy</button>
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dim">Lưu thay đổi</button>
        </div>
      </form>
    </Modal>
  )
}