import { Checklist, type ChecklistJSON } from './Checklist'
import { Comment, type CommentJSON } from './Comment'
import type { Priority, TaskStatus, TaskType } from './enums'

export interface TaskJSON {
  id: string
  projectId: string
  name: string
  role: string
  type: TaskType
  priority: Priority
  status: TaskStatus
  estHours: number
  actualHours: number
  complexity: number // NEW: Độ khó của task (Fibonacci: 1, 2, 3, 5, 8)
  sprintId: string | null
  dueDate: string | null
  description: string
  checklist: ChecklistJSON
  comments: CommentJSON[]
  createdAt: string
  updatedAt: string
}

export interface TaskInit {
  id: string
  projectId?: string
  name: string
  role: string
  type?: TaskType
  priority?: Priority
  status?: TaskStatus
  estHours?: number
  actualHours?: number
  complexity?: number // NEW
  sprintId?: string | null
  dueDate?: string | null
  description?: string
}

/**
 * The aggregate root of the domain. A Task owns its Checklist and its
 * Comment log, and every number the UI displays about a task (progress,
 * variance, overdue-ness) is computed here once.
 */
export class Task {
  id: string
  projectId: string
  name: string
  role: string
  type: TaskType
  priority: Priority
  status: TaskStatus
  estHours: number
  actualHours: number
  complexity: number
  sprintId: string | null
  dueDate: string | null
  description: string
  checklist: Checklist
  comments: Comment[]
  createdAt: string
  updatedAt: string

  constructor(init: TaskInit) {
    this.id = init.id
    this.projectId = init.projectId ?? 'default-project'
    this.name = init.name
    this.role = init.role
    this.type = init.type ?? 'Task'
    this.priority = init.priority ?? 'Medium'
    this.status = init.status ?? 'Todo'
    this.estHours = init.estHours ?? 0
    this.actualHours = init.actualHours ?? 0
    this.complexity = init.complexity ?? 2 // Default độ khó trung bình
    this.sprintId = init.sprintId ?? null
    this.dueDate = init.dueDate ?? null
    this.description = init.description ?? ''
    this.checklist = new Checklist()
    this.comments = []
    this.createdAt = new Date().toISOString()
    this.updatedAt = this.createdAt
  }

  touch(): void {
    this.updatedAt = new Date().toISOString()
  }

  checklistProgress(): number {
    return this.checklist.progressPercent()
  }

  varianceHours(): number {
    return this.actualHours - this.estHours
  }

  variancePercent(): number | null {
    if (this.estHours === 0) return null
    return Math.round((this.varianceHours() / this.estHours) * 100)
  }

  isOverdue(referenceDate: Date = new Date()): boolean {
    if (!this.dueDate || this.status === 'Done') return false
    return new Date(this.dueDate) < referenceDate
  }

  isActiveWorkload(): boolean {
    return this.status === 'Todo' || this.status === 'In Progress'
  }

  addComment(author: string, text: string, idGenerator: () => string): void {
    if (!text.trim()) return
    this.comments.unshift(new Comment(idGenerator(), author, text.trim()))
    this.touch()
  }

  toJSON(): TaskJSON {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      role: this.role,
      type: this.type,
      priority: this.priority,
      status: this.status,
      estHours: this.estHours,
      actualHours: this.actualHours,
      complexity: this.complexity,
      sprintId: this.sprintId,
      dueDate: this.dueDate,
      description: this.description,
      checklist: this.checklist.toJSON(),
      comments: this.comments.map((c) => c.toJSON()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromJSON(json: TaskJSON): Task {
    const task = new Task({
      id: json.id,
      projectId: json.projectId,
      name: json.name,
      role: json.role,
      type: json.type,
      priority: json.priority,
      status: json.status,
      estHours: json.estHours,
      actualHours: json.actualHours,
      complexity: json.complexity ?? 2, // Fallback for old data
      sprintId: json.sprintId,
      dueDate: json.dueDate,
      description: json.description,
    })
    task.checklist = Checklist.fromJSON(json.checklist)
    task.comments = json.comments.map(Comment.fromJSON)
    task.createdAt = json.createdAt
    task.updatedAt = json.updatedAt
    return task
  }
}