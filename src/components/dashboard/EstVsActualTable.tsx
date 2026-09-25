// Gợi ý cho file src/components/dashboard/EstVsActualTable.tsx
import { estVsActualRows } from '@/store/selectors'
import type { Task } from '@/models'

export function EstVsActualTable({ tasks }: { tasks: Task[] }) {
  const rows = estVsActualRows(tasks)

  if (rows.length === 0) return <p className="text-sm text-base-500">Chưa có task nào hoàn thành hoặc log giờ.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-base-300">
        <thead className="border-b border-base-700 text-xs font-semibold text-base-400">
          <tr>
            <th className="pb-2">Task</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Point</th>
            <th className="pb-2 text-right">Est</th>
            <th className="pb-2 text-right">Actual</th>
            <th className="pb-2 text-right">Variance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-800">
          {rows.map((row) => (
            <tr key={row.id} className={row.isDanger ? 'bg-signal-high/10' : ''}>
              <td className="py-3 font-medium text-base-100">
                <span className="text-xs text-base-500 mr-2">{row.id}</span>
                {row.name}
              </td>
              <td className="py-3">{row.role}</td>
              <td className="py-3 font-medium">{row.complexity}</td>
              <td className="py-3 text-right">{row.estHours}h</td>
              <td className="py-3 text-right">{row.actualHours}h</td>
              <td className={`py-3 text-right font-bold ${row.varianceHours > 0 ? 'text-signal-high' : 'text-signal-ok'}`}>
                {row.varianceHours > 0 ? '+' : ''}{row.varianceHours}h
                {row.variancePercent !== null && ` (${row.variancePercent}%)`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}