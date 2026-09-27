import { useState } from 'react'
import { Modal } from './Modal'
import { useTaskStore } from '@/store/useTaskStore'
import { colorForRole } from '@/models/enums'

interface Props {
  onClose: () => void
}

export function ManageRolesModal({ onClose }: Props) {
  const { roles, tasks, addRole, updateRole, deleteRole } = useTaskStore()
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newRole, setNewRole] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRole.trim()) {
      addRole(newRole)
      setNewRole('')
    }
  }

  const handleEditInit = (currentName: string) => {
    setEditingRole(currentName)
    setEditName(currentName)
  }

  const handleSave = (oldName: string) => {
    updateRole(oldName, editName)
    setEditingRole(null)
  }

  const handleDelete = (role: string, taskCount: number) => {
    if (taskCount > 0) {
      if (!confirm(`Role này đang được dùng bởi ${taskCount} tasks. Nếu xóa, các task này vẫn giữ nguyên tên role nhưng role sẽ biến mất khỏi danh sách chọn. Tiếp tục?`)) return
    }
    deleteRole(role)
  }

  return (
    <Modal onClose={onClose} widthClassName="max-w-xl">
      <div className="p-6">
        <h2 className="mb-2 text-lg font-semibold text-base-50">Quản lý Roles (Vai trò)</h2>
        <p className="mb-6 text-sm text-base-400">Đổi tên role ở đây sẽ tự động cập nhật tên ở tất cả các Task đang sử dụng.</p>

        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-base-700 bg-base-900 px-3 py-2 text-sm text-base-50 outline-none focus:border-accent"
            placeholder="Nhập tên Role mới..."
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dim transition">
            Thêm
          </button>
        </form>
        
        <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2">
          {roles.map((role) => {
            const taskCount = tasks.filter((t) => t.role === role).length

            return (
              <div key={role} className="flex items-center justify-between rounded-lg border border-base-700 bg-base-800/50 p-3">
                {editingRole === role ? (
                  <div className="flex flex-1 items-center gap-2 mr-4">
                    <input
                      autoFocus
                      className="flex-1 rounded-md border border-base-600 bg-base-900 px-3 py-1.5 text-sm text-base-50 outline-none focus:border-accent"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave(role)
                        if (e.key === 'Escape') setEditingRole(null)
                      }}
                    />
                    <button onClick={() => handleSave(role)} className="text-sm font-medium text-accent hover:text-accent-bright">Lưu</button>
                    <button onClick={() => setEditingRole(null)} className="text-sm font-medium text-base-400 hover:text-base-200">Hủy</button>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center gap-3 truncate">
                    <span 
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-base-950"
                      style={{ backgroundColor: colorForRole(role) }}
                    >
                      {role}
                    </span>
                    <span className="text-xs text-base-500">{taskCount} tasks</span>
                  </div>
                )}

                {editingRole !== role && (
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEditInit(role)} className="text-xs font-medium text-base-400 hover:text-base-100 transition">
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(role, taskCount)} className="text-xs font-medium text-signal-high hover:text-red-400 transition">
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )
          })}
          {roles.length === 0 && (
            <div className="text-center text-sm text-base-500 py-4">Chưa có Role nào.</div>
          )}
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