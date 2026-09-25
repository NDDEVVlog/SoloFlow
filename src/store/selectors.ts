import type { Task } from '@/models'
import { colorForRole } from '@/models/enums'

export const OVERLOAD_CAP_HOURS = 40

export function activeWorkloadHours(tasks: Task[]): number {
  return round1(tasks.filter((t) => t.isActiveWorkload()).reduce((sum, t) => sum + t.estHours, 0))
}

export interface RoleWorkload {
  role: string
  hours: number
  percent: number
  color: string
}

export function workloadByRole(tasks: Task[], activeOnly = true): RoleWorkload[] {
  const pool = activeOnly ? tasks.filter((t) => t.isActiveWorkload()) : tasks
  const totals = new Map<string, number>()
  for (const t of pool) {
    totals.set(t.role, (totals.get(t.role) ?? 0) + t.estHours)
  }
  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0)
  return Array.from(totals.entries())
    .map(([role, hours]) => ({
      role,
      hours: round1(hours),
      percent: grandTotal ? Math.round((hours / grandTotal) * 100) : 0,
      color: colorForRole(role),
    }))
    .sort((a, b) => b.hours - a.hours)
}

/** Tính toán các chỉ số hiệu suất cho Dashboard */
export function calculateDashboardKPIs(tasks: Task[], sprintCapacity: number = 40) {
  const doneTasks = tasks.filter((t) => t.status === 'Done')
  
  // 1. Completion Rate
  const completionRate = tasks.length ? Math.round((doneTasks.length / tasks.length) * 100) : 0

  // 2. Efficiency Ratio
  const estDone = doneTasks.reduce((s, t) => s + t.estHours, 0)
  const actualDone = doneTasks.reduce((s, t) => s + t.actualHours, 0)
  const efficiency = actualDone > 0 ? Math.round((estDone / actualDone) * 100) : (estDone > 0 ? 100 : 0)

  // 3. Story Points
  const totalPoints = tasks.reduce((s, t) => s + t.complexity, 0)
  const donePoints = doneTasks.reduce((s, t) => s + t.complexity, 0)

  // 4. Capacity Utilization
  const totalActual = tasks.reduce((s, t) => s + t.actualHours, 0)
  const capacityUtilization = Math.round((totalActual / sprintCapacity) * 100)

  return { completionRate, efficiency, totalPoints, donePoints, capacityUtilization }
}

export interface VarianceRow {
  id: string
  name: string
  role: string
  estHours: number
  actualHours: number
  varianceHours: number
  variancePercent: number | null
  complexity: number
  isDanger: boolean
}

/** Est vs Actual detail */
export function estVsActualRows(tasks: Task[]): VarianceRow[] {
  return tasks
    .filter((t) => t.actualHours > 0 || t.status === 'Done')
    .map((t) => {
      const varianceHours = round1(t.varianceHours())
      const variancePercent = t.variancePercent()
      
      // Báo động đỏ nếu lố 20% estimate HOẶC lố hơn 3 tiếng
      const isDanger = (variancePercent !== null && variancePercent > 20) || varianceHours > 3

      return {
        id: t.id,
        name: t.name,
        role: t.role,
        estHours: t.estHours,
        actualHours: t.actualHours,
        varianceHours,
        variancePercent,
        complexity: t.complexity,
        isDanger,
      }
    })
    .sort((a, b) => b.varianceHours - a.varianceHours)
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}