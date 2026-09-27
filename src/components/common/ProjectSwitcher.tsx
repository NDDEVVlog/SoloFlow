import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { ManageProjectsModal } from './ManageProjectsModal'

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export function ProjectSwitcher() {
  const { projects, activeProjectId, setActiveProject, addProject } = useTaskStore()
  const [showManage, setShowManage] = useState(false)

  const handleCreateProject = () => {
    const projectName = window.prompt('Nhập tên dự án mới:')
    if (projectName && projectName.trim()) {
      addProject(projectName.trim())
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 rounded-lg border border-base-700 bg-base-900 p-2 shadow-sm">
        <div className="flex flex-col flex-1 overflow-hidden">
          <label className="mb-1 text-[10px] font-bold uppercase tracking-wider text-base-500">
            Dự án hiện tại
          </label>
          <select
            value={activeProjectId}
            onChange={(e) => setActiveProject(e.target.value)}
            className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-base-50 outline-none focus:text-accent-bright truncate"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-base-900 text-base-50">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-6 w-px bg-base-700 mx-1"></div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowManage(true)}
            className="flex h-7 w-7 items-center justify-center rounded bg-base-800 text-base-400 transition hover:bg-base-700 hover:text-base-100"
            title="Quản lý dự án (Sửa / Xóa)"
          >
            <SettingsIcon />
          </button>
          
          <button
            onClick={handleCreateProject}
            className="flex h-7 w-7 items-center justify-center rounded bg-base-800 text-base-300 font-bold transition hover:bg-accent hover:text-white"
            title="Tạo dự án mới"
          >
            +
          </button>
        </div>
      </div>

      {showManage && <ManageProjectsModal onClose={() => setShowManage(false)} />}
    </>
  )
}