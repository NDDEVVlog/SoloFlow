import type { TransactionType } from './enums'

export interface TransactionJSON {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string // ngày phát sinh giao dịch (yyyy-mm-dd)
  taskId: string | null // liên kết tuỳ chọn tới 1 Task
  createdAt: string
}

export interface TransactionInit {
  id: string
  type: TransactionType
  amount: number
  category: string
  note?: string
  date: string
  taskId?: string | null
}

/**
 * Một giao dịch thu/chi. Cố tình nhỏ gọn giống Comment — không có nhiều
 * logic ở đây, mọi phép tính tổng/nhóm theo tuần-tháng/danh mục nằm ở
 * store/financeSelectors.ts, theo đúng nguyên tắc "logic tính toán nằm
 * đúng một chỗ" đã áp dụng cho Task.
 */
export class Transaction {
  id: string
  type: TransactionType
  amount: number
  category: string
  note: string
  date: string
  taskId: string | null
  createdAt: string

  constructor(init: TransactionInit) {
    this.id = init.id
    this.type = init.type
    this.amount = init.amount
    this.category = init.category
    this.note = init.note ?? ''
    this.date = init.date
    this.taskId = init.taskId ?? null
    this.createdAt = new Date().toISOString()
  }

  isExpense(): boolean {
    return this.type === 'expense'
  }

  toJSON(): TransactionJSON {
    return {
      id: this.id,
      type: this.type,
      amount: this.amount,
      category: this.category,
      note: this.note,
      date: this.date,
      taskId: this.taskId,
      createdAt: this.createdAt,
    }
  }

  static fromJSON(json: TransactionJSON): Transaction {
    const t = new Transaction({
      id: json.id,
      type: json.type,
      amount: json.amount,
      category: json.category,
      note: json.note,
      date: json.date,
      taskId: json.taskId,
    })
    t.createdAt = json.createdAt
    return t
  }
}