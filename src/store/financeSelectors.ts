import type { Transaction, TransactionType } from '@/models'
import { colorForRole } from '@/models/enums'

export type FinancePeriod = 'week' | 'month'

export interface PeriodRange {
  start: Date
  end: Date
}

function startOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay() // 0 = Chủ nhật ... 6 = Thứ bảy
  const diff = (day === 0 ? -6 : 1) - day // lùi về Thứ Hai
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function endOfWeek(d: Date): Date {
  const start = startOfWeek(d)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}

export function periodRange(period: FinancePeriod, referenceDate: Date = new Date()): PeriodRange {
  return period === 'week'
    ? { start: startOfWeek(referenceDate), end: endOfWeek(referenceDate) }
    : { start: startOfMonth(referenceDate), end: endOfMonth(referenceDate) }
}

/** Kỳ liền trước (tuần trước / tháng trước) — dùng để so sánh tăng/giảm. */
export function previousPeriodRange(period: FinancePeriod, referenceDate: Date = new Date()): PeriodRange {
  const shifted = new Date(referenceDate)
  if (period === 'week') shifted.setDate(shifted.getDate() - 7)
  else shifted.setMonth(shifted.getMonth() - 1)
  return periodRange(period, shifted)
}

export function transactionsInRange(transactions: Transaction[], range: PeriodRange): Transaction[] {
  return transactions.filter((t) => {
    const d = new Date(t.date)
    return d >= range.start && d <= range.end
  })
}

export interface CategoryTotal {
  category: string
  amount: number
  percent: number
  color: string
}

/** Nhóm + tính % theo danh mục cho 1 loại giao dịch (expense hoặc income). */
export function totalsByCategory(transactions: Transaction[], type: TransactionType): CategoryTotal[] {
  const pool = transactions.filter((t) => t.type === type)
  const totals = new Map<string, number>()
  for (const t of pool) totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  const grandTotal = Array.from(totals.values()).reduce((a, b) => a + b, 0)
  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount: round(amount),
      percent: grandTotal ? Math.round((amount / grandTotal) * 100) : 0,
      // Dùng chung bảng màu hash-based với role — không cần bảng màu riêng cho danh mục
      color: colorForRole(category),
    }))
    .sort((a, b) => b.amount - a.amount)
}

export interface FinanceSummary {
  totalIncome: number
  totalExpense: number
  net: number
  expenseByCategory: CategoryTotal[]
  incomeByCategory: CategoryTotal[]
  prevTotalIncome: number
  prevTotalExpense: number
  /** % thay đổi so với kỳ trước. null nghĩa là kỳ trước = 0 nên không tính được %. */
  incomeChangePercent: number | null
  expenseChangePercent: number | null
}

export function financeSummary(
  transactions: Transaction[],
  period: FinancePeriod,
  referenceDate: Date = new Date()
): FinanceSummary {
  const current = transactionsInRange(transactions, periodRange(period, referenceDate))
  const previous = transactionsInRange(transactions, previousPeriodRange(period, referenceDate))

  const totalIncome = round(current.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0))
  const totalExpense = round(current.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
  const prevTotalIncome = round(previous.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0))
  const prevTotalExpense = round(previous.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0))

  return {
    totalIncome,
    totalExpense,
    net: round(totalIncome - totalExpense),
    expenseByCategory: totalsByCategory(current, 'expense'),
    incomeByCategory: totalsByCategory(current, 'income'),
    prevTotalIncome,
    prevTotalExpense,
    incomeChangePercent: percentChange(prevTotalIncome, totalIncome),
    expenseChangePercent: percentChange(prevTotalExpense, totalExpense),
  }
}

function percentChange(prev: number, curr: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null
  return Math.round(((curr - prev) / prev) * 100)
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}