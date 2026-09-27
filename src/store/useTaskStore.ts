import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Project, Sprint, Task, Transaction, type TransactionType } from '@/models'
import { DEFAULT_ROLES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/models/enums'
import { nextTaskId, shortId } from '@/utils/id'
import { buildSampleData } from '@/utils/sampleData'

export type ViewMode = 'list' | 'kanban'

interface TaskStoreState {
  projects: Project[]
  activeProjectId: string
  tasks: Task[]
  sprints: Sprint[]
  roles: string[]
  currentSprintId: string | null
  viewMode: ViewMode
  transactions: Transaction[]
  expenseCategories: string[]
  incomeCategories: string[]
  hasSeeded: boolean

  addProject: (name: string, description?: string) => Project
  updateProject: (id: string, name: string) => void
  deleteProject: (id: string) => void
  setActiveProject: (id: string) => void

  createTask: (input: Partial<Task> & { name: string; role: string }) => Task
  updateTask: (id: string, patch: Partial<Pick<Task, 'name' | 'role' | 'type' | 'priority' | 'status' | 'estHours' | 'actualHours' | 'complexity' | 'sprintId' | 'dueDate' | 'description'>>) => void
  deleteTask: (id: string) => void
  setTaskStatus: (id: string, status: Task['status']) => void

  addChecklistItem: (taskId: string, label: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  removeChecklistItem: (taskId: string, itemId: string) => void

  addComment: (taskId: string, author: string, text: string) => void

  addSprint: (projectId: string, name: string, startDate: string, endDate: string, capacityHours?: number) => Sprint
  updateSprint: (id: string, patch: Partial<Pick<Sprint, 'name' | 'startDate' | 'endDate' | 'capacityHours'>>) => void
  deleteSprint: (id: string) => void
  setCurrentSprint: (sprintId: string | null) => void

  addRole: (role: string) => void
  updateRole: (oldRole: string, newRole: string) => void
  deleteRole: (role: string) => void
  
  setViewMode: (mode: ViewMode) => void

  addTransaction: (input: { type: TransactionType; amount: number; category: string; note?: string; date: string; taskId?: string | null }) => Transaction
  updateTransaction: (id: string, patch: Partial<Pick<Transaction, 'type' | 'amount' | 'category' | 'note' | 'date' | 'taskId'>>) => void
  deleteTransaction: (id: string) => void
  addExpenseCategory: (category: string) => void
  addIncomeCategory: (category: string) => void

  seedIfEmpty: () => void
  resetToSampleData: () => void
  
  exportState: () => string
  importState: (jsonStr: string) => boolean
}

const safeMap = <T>(arr: any[], mapper: (item: any) => T): T[] => {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    try { return mapper(item) } catch (e) { return null }
  }).filter(Boolean) as T[]
}

const safeToJSON = (item: any) => {
  try {
    return typeof item.toJSON === 'function' ? item.toJSON() : item
  } catch (error) {
    return null
  }
}

const extractExportableState = (s: TaskStoreState) => ({
  projects: (s.projects || []).map(safeToJSON).filter(Boolean),
  activeProjectId: s.activeProjectId,
  tasks: (s.tasks || []).map(safeToJSON).filter(Boolean),
  sprints: (s.sprints || []).map(safeToJSON).filter(Boolean),
  roles: s.roles,
  currentSprintId: s.currentSprintId,
  viewMode: s.viewMode,
  transactions: (s.transactions || []).map(safeToJSON).filter(Boolean),
  expenseCategories: s.expenseCategories,
  incomeCategories: s.incomeCategories,
  hasSeeded: s.hasSeeded,
})

const hydrateState = (parsed: any, currentState: any) => {
  if (!parsed) return currentState
  const restoredProjects = safeMap(parsed.projects, Project.fromJSON)
  return {
    ...currentState,
    projects: restoredProjects.length ? restoredProjects : [new Project('default-project', 'Master Project')],
    activeProjectId: parsed.activeProjectId || 'default-project',
    tasks: safeMap(parsed.tasks, Task.fromJSON),
    sprints: safeMap(parsed.sprints, Sprint.fromJSON),
    roles: parsed.roles || currentState.roles,
    currentSprintId: parsed.currentSprintId ?? null,
    viewMode: parsed.viewMode || 'kanban',
    transactions: safeMap(parsed.transactions, Transaction.fromJSON),
    expenseCategories: parsed.expenseCategories?.length ? parsed.expenseCategories : currentState.expenseCategories,
    incomeCategories: parsed.incomeCategories?.length ? parsed.incomeCategories : currentState.incomeCategories,
    hasSeeded: parsed.hasSeeded ?? true,
  }
}

export const useTaskStore = create<TaskStoreState>()(
  persist(
    (set, get) => ({
      projects: [new Project('default-project', 'Master Project', 'Default initial project')],
      activeProjectId: 'default-project',
      tasks: [],
      sprints: [],
      roles: [...DEFAULT_ROLES],
      currentSprintId: null,
      viewMode: 'kanban',
      transactions: [],
      expenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
      incomeCategories: [...DEFAULT_INCOME_CATEGORIES],
      hasSeeded: false,

      addProject: (name, description = '') => {
        const project = new Project('PROJ-' + shortId('PRJ'), name, description)
        set((s) => ({ projects: [...s.projects, project], activeProjectId: project.id, currentSprintId: null }))
        return project
      },

      updateProject: (id, name) => {
        const trimmed = name.trim()
        if (!trimmed) return
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id === id) p.name = trimmed
            return p
          })
        }))
      },

      deleteProject: (id) => {
        set((s) => {
          const remainingProjects = s.projects.filter(p => p.id !== id)
          const newActiveId = s.activeProjectId === id ? remainingProjects[0].id : s.activeProjectId
          
          return {
            projects: remainingProjects,
            activeProjectId: newActiveId,
            tasks: s.tasks.filter(t => t.projectId !== id),
            sprints: s.sprints.filter(sp => sp.projectId !== id),
            currentSprintId: s.activeProjectId === id ? null : s.currentSprintId
          }
        })
      },

      setActiveProject: (id) => set({ activeProjectId: id, currentSprintId: null }),

      createTask: (input) => {
        const existingIds = get().tasks.map((t) => t.id)
        const task = new Task({
          id: nextTaskId(existingIds),
          projectId: get().activeProjectId,
          name: input.name,
          role: input.role,
          type: input.type,
          priority: input.priority,
          status: input.status,
          estHours: input.estHours,
          actualHours: input.actualHours,
          complexity: input.complexity ?? 2,
          sprintId: input.sprintId ?? get().currentSprintId,
          dueDate: input.dueDate ?? null,
          description: input.description,
        })
        set((s) => ({ tasks: [...s.tasks, task] }))
        if (!get().roles.includes(task.role)) get().addRole(task.role)
        return task
      },

      updateTask: (id, patch) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t
            Object.assign(t, patch)
            t.touch()
            return t
          }),
        }))
        const role = patch.role
        if (role && !get().roles.includes(role)) get().addRole(role)
      },

      deleteTask: (id) => set((s) => ({ 
        tasks: s.tasks.filter((t) => t.id !== id),
        transactions: s.transactions.filter((txn) => txn.taskId !== id)
      })),
      
      setTaskStatus: (id, status) => get().updateTask(id, { status }),

      addChecklistItem: (taskId, label) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            t.checklist.addItem(label, () => shortId('CI'))
            t.touch()
            return t
          }),
        }))
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            t.checklist.toggleItem(itemId)
            t.touch()
            return t
          }),
        }))
      },

      removeChecklistItem: (taskId, itemId) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            t.checklist.removeItem(itemId)
            t.touch()
            return t
          }),
        }))
      },

      addComment: (taskId, author, text) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            t.addComment(author || 'Me', text, () => shortId('CM'))
            return t
          }),
        }))
      },

      addSprint: (projectId, name, startDate, endDate, capacityHours = 40) => {
        const sprint = new Sprint(shortId('SPR'), projectId, name, startDate, endDate, capacityHours)
        set((s) => ({ sprints: [...s.sprints, sprint] }))
        return sprint
      },

      updateSprint: (id, patch) => {
        set((s) => ({
          sprints: s.sprints.map((sp) => {
            if (sp.id === id) Object.assign(sp, patch)
            return sp
          })
        }))
      },

      deleteSprint: (id) => {
        set((s) => ({
          sprints: s.sprints.filter(sp => sp.id !== id),
          tasks: s.tasks.map(t => {
            if (t.sprintId === id) {
              t.sprintId = null
              t.touch()
            }
            return t
          }),
          currentSprintId: s.currentSprintId === id ? null : s.currentSprintId
        }))
      },

      setCurrentSprint: (sprintId) => set({ currentSprintId: sprintId }),

      addRole: (role) => {
        const trimmed = role.trim()
        if (!trimmed) return
        set((s) => (s.roles.includes(trimmed) ? s : { roles: [...s.roles, trimmed] }))
      },

      updateRole: (oldRole, newRole) => {
        const trimmed = newRole.trim()
        if (!trimmed || oldRole === trimmed) return
        
        set((s) => {
          const roleSet = new Set(s.roles)
          roleSet.delete(oldRole)
          roleSet.add(trimmed)
          
          return {
            roles: Array.from(roleSet),
            tasks: s.tasks.map((t) => {
              if (t.role === oldRole) {
                t.role = trimmed
                t.touch()
              }
              return t
            })
          }
        })
      },

      deleteRole: (role) => {
        set((s) => ({
          roles: s.roles.filter((r) => r !== role)
        }))
      },

      setViewMode: (mode) => set({ viewMode: mode }),

      addTransaction: (input) => {
        const txn = new Transaction({
          id: shortId('TXN'),
          type: input.type,
          amount: input.amount,
          category: input.category,
          note: input.note,
          date: input.date,
          taskId: input.taskId ?? null,
        })
        set((s) => ({ transactions: [txn, ...s.transactions] }))
        if (input.type === 'expense') get().addExpenseCategory(input.category)
        else get().addIncomeCategory(input.category)
        return txn
      },

      updateTransaction: (id, patch) => {
        set((s) => ({
          transactions: s.transactions.map((t) => {
            if (t.id !== id) return t
            Object.assign(t, patch)
            return t
          }),
        }))
      },

      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      addExpenseCategory: (category) => {
        const trimmed = category.trim()
        if (!trimmed) return
        set((s) => (s.expenseCategories.includes(trimmed) ? s : { expenseCategories: [...s.expenseCategories, trimmed] }))
      },

      addIncomeCategory: (category) => {
        const trimmed = category.trim()
        if (!trimmed) return
        set((s) => (s.incomeCategories.includes(trimmed) ? s : { incomeCategories: [...s.incomeCategories, trimmed] }))
      },

      seedIfEmpty: () => {
        if (get().hasSeeded) return
        get().resetToSampleData()
      },

      resetToSampleData: () => {
        const { tasks, sprints } = buildSampleData()
        tasks.forEach(t => { t.projectId = 'default-project'; if (!t.complexity) t.complexity = 2 })
        sprints.forEach(s => { s.projectId = 'default-project' })
        const roles = Array.from(new Set([...DEFAULT_ROLES, ...tasks.map((t) => t.role)]))
        set({
          projects: [new Project('default-project', 'Master Project', 'Sample project')],
          activeProjectId: 'default-project',
          tasks, sprints, roles, currentSprintId: sprints[0]?.id ?? null, viewMode: 'kanban',
          transactions: [], expenseCategories: [...DEFAULT_EXPENSE_CATEGORIES], incomeCategories: [...DEFAULT_INCOME_CATEGORIES],
          hasSeeded: true,
        })
      },

      exportState: () => {
        const exportable = extractExportableState(get())
        return JSON.stringify(exportable, null, 2)
      },

      importState: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr)
          const hydrated = hydrateState(parsed, get())
          set(hydrated)
          return true
        } catch {
          return false
        }
      }
    }),
    {
      name: 'soloflow-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: extractExportableState,
      merge: hydrateState
    }
  )
)