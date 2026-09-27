import { useMemo } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { calculateDashboardKPIs } from '@/store/selectors'
import { TimeProgressChart } from '@/components/dashboard/TimeProgressChart'
import { WorkloadByRole } from '@/components/dashboard/WorkloadByRole'
import { EstVsActualTable } from '@/components/dashboard/EstVsActualTable'
import { FinanceWidget } from '@/components/dashboard/FinanceWidget'
import { PageHeader } from './OverviewPage'

export function DashboardPage() {
  const { tasks, sprints, currentSprintId, activeProjectId } = useTaskStore()
  
  // Lọc task thuộc Project hiện tại
  const projectTasks = useMemo(() => tasks.filter(t => t.projectId === activeProjectId), [tasks, activeProjectId])
  
  // Lọc task thuộc Sprint hiện tại
  const sprintTasks = useMemo(
    () => projectTasks.filter((t) => (currentSprintId ? t.sprintId === currentSprintId : true)),
    [projectTasks, currentSprintId]
  )
  
  const currentSprint = sprints.find((s) => s.id === currentSprintId)
  
  // Tính KPIs
  const kpis = useMemo(() => calculateDashboardKPIs(sprintTasks, currentSprint?.capacityHours ?? 40), [sprintTasks, currentSprint])

  return (
    <div>
      <PageHeader
        title="Performance Dashboard"
        subtitle={currentSprint ? `Hiệu suất của ${currentSprint.name}` : 'Toàn bộ dự án. Chọn sprint ở My Work để xem chi tiết.'}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard 
          title="Tỷ lệ hoàn thành" 
          value={`${kpis.completionRate}%`} 
          subtitle="Số task đã Done"
          color={kpis.completionRate >= 80 ? 'text-signal-ok' : 'text-accent-bright'}
        />
        <KpiCard 
          title="Tỷ lệ Hiệu suất (Efficiency)" 
          value={`${kpis.efficiency}%`} 
          subtitle=">100% là làm nhanh hơn Estimate"
          color={kpis.efficiency >= 100 ? 'text-signal-ok' : kpis.efficiency < 80 ? 'text-signal-high' : 'text-accent-bright'}
        />
        <KpiCard 
          title="Story Points Đạt được" 
          value={`${kpis.donePoints} / ${kpis.totalPoints}`} 
          subtitle="Đo lường bằng Độ Khó công việc"
          color="text-base-50"
        />
        <KpiCard 
          title="Mức ngốn Resource" 
          value={`${kpis.capacityUtilization}%`} 
          subtitle="So với Sức chứa Sprint"
          color={kpis.capacityUtilization > 100 ? 'text-signal-high' : 'text-base-50'}
        />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
          <TimeProgressChart tasks={projectTasks} />
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
            <h3 className="mb-4 text-sm font-semibold text-base-50">Workload by Role</h3>
            <WorkloadByRole tasks={sprintTasks} />
          </div>

          <div className="rounded-xl border border-base-700 bg-base-800/40 p-4 overflow-hidden flex flex-col">
             <h3 className="mb-4 text-sm font-semibold text-base-50">Cảnh báo lố giờ (Est vs Actual)</h3>
            <EstVsActualTable tasks={projectTasks} />
          </div>
        </div>

        <FinanceWidget />
      </div>
    </div>
  )
}

function KpiCard({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-base-700 bg-base-800/40 p-5 shadow-sm transition hover:bg-base-800/60">
      <h4 className="text-xs font-medium uppercase tracking-wider text-base-400">{title}</h4>
      <div className={`mt-2 text-3xl font-bold ${color}`}>{value}</div>
      <p className="mt-1 text-xs text-base-500">{subtitle}</p>
    </div>
  )
}