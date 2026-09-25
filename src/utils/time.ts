import type { Task } from '@/models'

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export type Granularity = 'day' | 'week' | 'month'

/** Buckets a task's `updatedAt` into a Y-axis-friendly key for the velocity chart. */
export function bucketKey(iso: string, granularity: Granularity): string {
  const d = new Date(iso)
  if (granularity === 'day') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  if (granularity === 'month') {
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  // week: label by the Monday of that week
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return `Wk of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

/**
 * Aggregates est/actual hours and completion count per bucket for the
 * Time & Progress chart. Buckets are ordered by first occurrence in the
 * (already chronological) task list.
 */
export function aggregateByPeriod(tasks: Task[], granularity: Granularity) {
  const order: string[] = []
  const map = new Map<string, { est: number; actual: number; completed: number; total: number }>()

  const sorted = [...tasks].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
  for (const t of sorted) {
    const key = bucketKey(t.updatedAt, granularity)
    if (!map.has(key)) {
      map.set(key, { est: 0, actual: 0, completed: 0, total: 0 })
      order.push(key)
    }
    const bucket = map.get(key)!
    bucket.est += t.estHours
    bucket.actual += t.actualHours
    bucket.total += 1
    if (t.status === 'Done') bucket.completed += 1
  }

  return order.map((key) => {
    const b = map.get(key)!
    return {
      period: key,
      estHours: Math.round(b.est * 10) / 10,
      actualHours: Math.round(b.actual * 10) / 10,
      completionRate: b.total ? Math.round((b.completed / b.total) * 100) : 0,
    }
  })
}
