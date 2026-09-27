import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { useTaskStore } from '@/store/useTaskStore'
import type { Sprint } from '@/models'

interface Props {
  onClose: () => void
}

export function ManageSprintsModal({ onClose }: Props) {
  const { sprints, activeProjectId, updateSprint, deleteSprint, tasks } = useTaskStore()
  
  const projectSprints = sprints.filter(s => s.projectId === activeProjectId)
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)

  const [editName, setEditName] = useState('')
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')
  const [editCap, setEditCap] = useState(40)

  const handleEditInit = (sp: Sprint) => {
    setEditingSprint(sp)
    setEditName(sp.name)
    setEditStart(sp.startDate.slice(0, 10))
    setEditEnd(sp.endDate.slice(0, 10))
    setEditCap(sp.capacityHours)
  }

  const handleSave = () => {
    if (!editingSprint || !editName.trim()) return
    updateSprint(editingSprint.id, {
      name: editName.trim(),
      startDate: new Date(editStart).toISOString(),
      endDate: new Date(editEnd).toISOString(),
      capacityHours: editCap
    })
    setEditingSprint(null)
  }

  const handleDelete = (id: string, name: string) => {
    const count = tasks.filter(t => t.sprintId === id).length
    const msg = count > 0 
      ? `Sprint "${name}" đang chứa ${count} tasks. Xóa Sprint sẽ KHÔNG xóa tasks, mà đẩy chúng về Backlog. Bạn chắc chắn chứ?`
      : `Bạn có chắc muốn xóa Sprint "${name}"?`
      
    if (confirm(msg)) {
      deleteSprint(id)
    }
  }

  return (
    <Modal onClose={onClose} widthClassName="max-w-2xl">
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-base-50">Quản lý Sprints</h2>
        
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {projectSprints.map((sp) => (
            <div key={sp.id} className="rounded-lg border border-base-700 bg-base-800/50 p-4">
              {editingSprint?.id === sp.id ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="col-span-2 sm:col-span-4">
                    <label className="mb-1 block text-xs text-base-400">Tên Sprint</label>
                    <input className="w-full rounded border border-base-600 bg-base-900 px-2 py-1 text-sm text-base-50 outline-none focus:border-accent" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-base-400">Start Date</label>
                    <input type="date" className="w-full rounded border border-base-600 bg-base-900 px-2 py-1 text-sm text-base-50 outline-none focus:border-accent" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-base-400">End Date</label>
                    <input type="date" className="w-full rounded border border-base-600 bg-base-900 px-2 py-1 text-sm text-base-50 outline-none focus:border-accent" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-base-400">Capacity (h)</label>
                    <input type="number" min="0" className="w-full rounded border border-base-600 bg-base-900 px-2 py-1 text-sm text-base-50 outline-none focus:border-accent" value={editCap} onChange={(e) => setEditCap(Number(e.target.value))} />
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={handleSave} className="flex-1 rounded bg-accent py-1.5 text-sm font-medium text-white hover:bg-accent-dim transition">Lưu</button>
                    <button onClick={() => setEditingSprint(null)} className="flex-1 rounded border border-base-600 bg-transparent py-1.5 text-sm text-base-300 hover:text-base-100 transition">Hủy</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-base-50">{sp.name}</div>
                    <div className="text-xs text-base-400 mt-1">
                      {new Date(sp.startDate).toLocaleDateString('vi-VN')} → {new Date(sp.endDate).toLocaleDateString('vi-VN')} &nbsp;•&nbsp; Sức chứa: {sp.capacityHours}h
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEditInit(sp)} className="text-sm font-medium text-base-300 hover:text-base-100 transition">Sửa</button>
                    <button onClick={() => handleDelete(sp.id, sp.name)} className="text-sm font-medium text-signal-high hover:text-red-400 transition">Xóa</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {projectSprints.length === 0 && (
            <div className="text-center text-sm text-base-500 py-4">Dự án này chưa có Sprint nào.</div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-base-800 px-5 py-2 text-sm font-medium text-base-200 hover:bg-base-700 transition">Đóng</button>
        </div>
      </div>
    </Modal>
  )
}