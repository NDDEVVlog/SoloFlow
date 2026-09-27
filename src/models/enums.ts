/**
 * Central vocabulary for the whole domain. Keeping these as string-literal
 * unions (rather than plain `string`) means every layer above — store,
 * components, chart aggregation — gets compile-time safety and autocomplete,
 * and adding a new status/priority is a one-line change here.
 */

export const TASK_TYPES = ['Task', 'Bug', 'Feature'] as const
export type TaskType = (typeof TASK_TYPES)[number]

export const PRIORITIES = ['High', 'Medium', 'Low'] as const
export type Priority = (typeof PRIORITIES)[number]

export const TASK_STATUSES = [
  'Todo',
  'In Progress',
  'In Review',
  'Done',
  'Pending',
] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

/**
 * Default role catalogue. Users can add custom roles at runtime (see
 * useTaskStore#addRole) — this list only seeds the dropdown on first run.
 */
export const DEFAULT_ROLES = [
  'Game Design',
  'UI/UX',
  'Developer',
  'Marketing',
] as const
export type Role = string

// --- Finance (thu/chi) ------------------------------------------------

export const TRANSACTION_TYPES = ['expense', 'income'] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

/** Seed danh mục Chi — người dùng gõ danh mục mới sẽ tự thêm vào (giống addRole). */
export const DEFAULT_EXPENSE_CATEGORIES = [
  'Công cụ / Phần mềm',
  'Marketing',
  'Thiết bị',
  'Ăn uống',
  'Học tập',
  'Khác',
]

/** Seed danh mục Thu. */
export const DEFAULT_INCOME_CATEGORIES = ['Bán hàng', 'Freelance', 'Lương', 'Khác']

export const PRIORITY_STYLES: Record<Priority, { fg: string; bg: string; dot: string }> = {
  High: { fg: '#F0546B', bg: '#3A1E27', dot: '#F0546B' },
  Medium: { fg: '#E8933A', bg: '#3A2C1A', dot: '#E8933A' },
  Low: { fg: '#39B87A', bg: '#183429', dot: '#39B87A' },
}

export const STATUS_STYLES: Record<TaskStatus, { fg: string; bg: string; dot: string }> = {
  Todo: { fg: '#94A0B3', bg: '#242C39', dot: '#6B7688' },
  'In Progress': { fg: '#4B9CE8', bg: '#182B3A', dot: '#4B9CE8' },
  'In Review': { fg: '#E8C93A', bg: '#3A331A', dot: '#E8C93A' },
  Done: { fg: '#39B87A', bg: '#183429', dot: '#39B87A' },
  Pending: { fg: '#C3CBD8', bg: '#1B212C', dot: '#4A5568' },
}

/** Deterministic accent palette used to color arbitrary/custom role tags. */
export const ROLE_PALETTE = [
  '#7C6CF6', // violet
  '#4B9CE8', // blue
  '#39B87A', // green
  '#E8933A', // orange
  '#E8619C', // pink
  '#3ABFB8', // teal
  '#C3934B', // amber-brown
  '#8E7CF0', // indigo
]

export function colorForRole(role: string): string {
  let hash = 0
  for (let i = 0; i < role.length; i++) {
    hash = (hash << 5) - hash + role.charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % ROLE_PALETTE.length
  return ROLE_PALETTE[idx]
}