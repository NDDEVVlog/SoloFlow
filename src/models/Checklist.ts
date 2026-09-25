import { ChecklistItem, type ChecklistItemJSON } from './ChecklistItem'

export interface ChecklistJSON {
  items: ChecklistItemJSON[]
}

/**
 * Owns a Task's Trello-style sub-task list and every derived stat
 * (progress %, completion count) that the UI needs — cards, table rows and
 * the detail modal all call the same methods instead of recomputing
 * COUNTIF-style logic in three different components.
 */
export class Checklist {
  items: ChecklistItem[]

  constructor(items: ChecklistItem[] = []) {
    this.items = items
  }

  addItem(label: string, idGenerator: () => string): void {
    if (!label.trim()) return
    this.items.push(new ChecklistItem(idGenerator(), label.trim()))
  }

  removeItem(itemId: string): void {
    this.items = this.items.filter((i) => i.id !== itemId)
  }

  toggleItem(itemId: string): void {
    const item = this.items.find((i) => i.id === itemId)
    item?.toggle()
  }

  get total(): number {
    return this.items.length
  }

  get completed(): number {
    return this.items.filter((i) => i.done).length
  }

  /** 0–100, rounded. Returns 0 for an empty checklist rather than NaN. */
  progressPercent(): number {
    if (this.total === 0) return 0
    return Math.round((this.completed / this.total) * 100)
  }

  isComplete(): boolean {
    return this.total > 0 && this.completed === this.total
  }

  toJSON(): ChecklistJSON {
    return { items: this.items.map((i) => i.toJSON()) }
  }

  static fromJSON(json?: ChecklistJSON): Checklist {
    if (!json) return new Checklist()
    return new Checklist(json.items.map(ChecklistItem.fromJSON))
  }
}
