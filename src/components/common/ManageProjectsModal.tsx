import { useState } from 'react'
import { Modal } from './Modal'
import { useTaskStore } from '@/store/useTaskStore'

interface Props {
  onClose: () => void
}

export function ManageProjectsModal({ onClose }: Props) {
  const { projects, updateProject, deleteProject } = useTaskStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleEditInit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleSave = (id: string) => {
    updateProject(id, editName)
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (projects.length <= 1) {
      alert('Hệ thống yêu cầu ít nhất 1 dự án tồn tại. Không thể xóa!')
      return
    }
    
    if (confirm('CẢNH BÁO: Xóa dự án sẽ xóa toàn bộ Task và Sprint bên trong nó. Bạn có chắc chắn?')) {
      deleteProject(id)
    }
  }

  return (
    <Modal onClose={onClose} widthClassName="max-w-xl">
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-base-50">Quản lý dự án</h2>
        
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
              {editingId === p.id ? (
                <div className="flex flex-1 items-center gap-2 mr-4">
                  <input
                    autoFocus
                    className="flex-1 rounded-md border border-base-600 bg-base-900 px-3 py-1.5 text-sm text-base-50 outline-none focus:border-accent"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(p.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <button onClick={() => handleSave(p.id)} className="text-sm font-medium text-accent hover:text-accent-bright">Lưu</button>
                  <button onClick={() => setEditingId(null)} className="text-sm font-medium text-base-400 hover:text-base-200">Hủy</button>
                </div>
              ) : (
                <span className="text-sm font-medium text-base-50 truncate flex-1">{p.name}</span>
              )}

              {editingId !== p.id && (
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEditInit(p.id, p.name)} className="text-xs font-medium text-base-400 hover:text-base-100 transition">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs font-medium text-signal-high hover:text-red-400 transition">
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-base-800 px-5 py-2 text-sm font-medium text-base-200 hover:bg-base-700 transition">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}