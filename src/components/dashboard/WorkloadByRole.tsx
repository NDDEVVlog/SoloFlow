import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Task } from '@/models'
import { workloadByRole } from '@/store/selectors'
import { ProgressBar } from '@/components/common/ProgressBar'
import { EmptyState } from './TimeProgressChart'

interface WorkloadByRoleProps {
  tasks: Task[]
}

/** Pie + Jira-style bars showing where active (Todo/In Progress) hours are
 * concentrated — e.g. "Code 60% / UI-UX 30% / Marketing 10%" from the brief. */
export function WorkloadByRole({ tasks }: WorkloadByRoleProps) {
  const rows = workloadByRole(tasks, true)

  return (
    <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
      <h3 className="mb-3 text-sm font-semibold text-base-100">Workload by role (active tasks)</h3>
      {rows.length === 0 ? (
        <EmptyState label="No active workload for this sprint yet." />
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={rows} dataKey="hours" nameKey="role" innerRadius={45} outerRadius={72} paddingAngle={2}>
                {rows.map((r) => (
                  <Cell key={r.role} fill={r.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1B212C', border: '1px solid #333D4D', borderRadius: 8, fontSize: 13 }}
                formatter={(value: number, _name, entry) => [`${value}h`, entry.payload.role]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="w-full flex-1 space-y-2.5">
            {rows.map((r) => (
              <div key={r.role}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-base-100">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    {r.role}
                  </span>
                  <span className="text-base-400">{r.hours}h · {r.percent}%</span>
                </div>
                <ProgressBar percent={r.percent} color={r.color} height={6} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
