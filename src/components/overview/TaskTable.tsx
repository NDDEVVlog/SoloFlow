import type { Task } from '@/models'

interface Props {
  tasks: Task[]
  emptyLabel?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function TaskTable({ tasks, emptyLabel = 'Không có dữ liệu.', onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-base-700 bg-base-800/40 p-10 text-center text-sm text-base-500">
        {emptyLabel}
      </div>
    )
  }

  const hasActions = !!onEdit || !!onDelete

  return (
    <div className="overflow-x-auto rounded-xl border border-base-700 bg-base-800/40">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-base-700 bg-base-900/50 text-xs uppercase text-base-400">
          <tr>
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">Tên công việc</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Tiến độ</th>
            <th className="px-4 py-3 font-medium text-right">Est. / Act.</th>
            {hasActions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-base-700">
          {tasks.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-base-800/60">
              <td className="px-4 py-3 font-medium text-base-400">{t.id}</td>
              <td className="px-4 py-3 text-base-50">{t.name}</td>
              <td className="px-4 py-3">
                <span className="rounded bg-base-900 px-2 py-1 text-xs text-base-300 border border-base-700">{t.role}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold ${t.status === 'Done' ? 'text-signal-ok' : 'text-base-400'}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-base-400">
                {t.checklistProgress()}%
              </td>
              <td className="px-4 py-3 text-right text-base-400">
                {t.estHours}h / <span className={t.actualHours > t.estHours ? 'text-signal-high font-medium' : ''}>{t.actualHours}h</span>
              </td>
              {hasActions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(t.id)} className="text-accent hover:text-accent-bright transition text-xs font-medium">
                        Sửa
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(t.id)} className="text-signal-high hover:text-red-400 transition text-xs font-medium">
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}