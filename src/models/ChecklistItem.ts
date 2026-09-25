export interface ChecklistItemJSON {
  id: string
  label: string
  done: boolean
}

/**
 * A single checkable sub-task line inside a Task's checklist.
 * Deliberately tiny — behaviour beyond toggling lives on Checklist,
 * which owns the collection and therefore the aggregate math.
 */
export class ChecklistItem {
  id: string
  label: string
  done: boolean

  constructor(id: string, label: string, done = false) {
    this.id = id
    this.label = label
    this.done = done
  }

  toggle(): void {
    this.done = !this.done
  }

  toJSON(): ChecklistItemJSON {
    return { id: this.id, label: this.label, done: this.done }
  }

  static fromJSON(json: ChecklistItemJSON): ChecklistItem {
    return new ChecklistItem(json.id, json.label, json.done)
  }
}
