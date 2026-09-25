import { useTaskStore } from '@/store/useTaskStore'

export function ProjectSwitcher() {
  const { projects, activeProjectId, setActiveProject, addProject } = useTaskStore()

  const handleCreateProject = () => {
    // Dùng prompt cho nhanh, hoặc bạn có thể thay bằng Modal xịn xò của bạn
    const projectName = window.prompt('Nhập tên dự án mới:')
    if (projectName && projectName.trim()) {
      addProject(projectName.trim())
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-base-700 bg-base-900 p-2 shadow-sm">
      <div className="flex flex-col">
        <label className="mb-1 text-[10px] font-bold uppercase tracking-wider text-base-500">
          Dự án hiện tại
        </label>
        <select
          value={activeProjectId}
          onChange={(e) => setActiveProject(e.target.value)}
          className="cursor-pointer appearance-none bg-transparent text-sm font-semibold text-base-50 outline-none focus:text-accent-bright"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-base-900 text-base-50">
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="h-6 w-px bg-base-700"></div>

      <button
        onClick={handleCreateProject}
        className="flex h-8 w-8 items-center justify-center rounded bg-base-800 text-base-300 transition hover:bg-accent hover:text-white"
        title="Tạo dự án mới"
      >
        +
      </button>
    </div>
  )
}