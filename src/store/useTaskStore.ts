import { create } from 'zustand'
import { persist, type PersistStorage } from 'zustand/middleware'
import { Project, Sprint, Task, Transaction, type ProjectJSON, type SprintJSON, type TaskJSON, type TransactionJSON, type TransactionType } from '@/models'
import { DEFAULT_ROLES, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/models/enums'
import { nextTaskId, shortId } from '@/utils/id'
import { buildSampleData } from '@/utils/sampleData'

export type ViewMode = 'list' | 'kanban'

interface PersistedShape {
  projects: ProjectJSON[]
  activeProjectId: string
  tasks: TaskJSON[]
  sprints: SprintJSON[]
  roles: string[]
  currentSprintId: string | null
  viewMode: ViewMode
  transactions: TransactionJSON[]
  expenseCategories: string[]
  incomeCategories: string[]
}

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

  addProject: (name: string, description?: string) => Project
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
  setCurrentSprint: (sprintId: string | null) => void

  addRole: (role: string) => void
  setViewMode: (mode: ViewMode) => void

  addTransaction: (input: { type: TransactionType; amount: number; category: string; note?: string; date: string; taskId?: string | null }) => Transaction
  updateTransaction: (id: string, patch: Partial<Pick<Transaction, 'type' | 'amount' | 'category' | 'note' | 'date' | 'taskId'>>) => void
  deleteTransaction: (id: string) => void
  addExpenseCategory: (category: string) => void
  addIncomeCategory: (category: string) => void

  seedIfEmpty: () => void
  resetToSampleData: () => void
}

const classAwareStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: (name: string, value: string) => localStorage.setItem(name, value),
  removeItem: (name: string) => localStorage.removeItem(name),
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

      addProject: (name, description = '') => {
        const project = new Project('PROJ-' + shortId('PRJ'), name, description)
        set((s) => ({ projects: [...s.projects, project], activeProjectId: project.id, currentSprintId: null }))
        return project
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

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
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

      setCurrentSprint: (sprintId) => set({ currentSprintId: sprintId }),

      addRole: (role) => {
        const trimmed = role.trim()
        if (!trimmed) return
        set((s) => (s.roles.includes(trimmed) ? s : { roles: [...s.roles, trimmed] }))
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
        if (get().tasks.length > 0) return
        get().resetToSampleData()
      },

      resetToSampleData: () => {
        const { tasks, sprints } = buildSampleData()
        tasks.forEach(t => {
          t.projectId = 'default-project'
          if (!t.complexity) t.complexity = 2
        })
        sprints.forEach(s => {
          s.projectId = 'default-project'
        })
        const roles = Array.from(new Set([...DEFAULT_ROLES, ...tasks.map((t) => t.role)]))
        set({
          projects: [new Project('default-project', 'Master Project', 'Sample project')],
          activeProjectId: 'default-project',
          tasks,
          sprints,
          roles,
          currentSprintId: sprints[0]?.id ?? null,
          viewMode: 'kanban',
          transactions: [],
          expenseCategories: [...DEFAULT_EXPENSE_CATEGORIES],
          incomeCategories: [...DEFAULT_INCOME_CATEGORIES],
        })
      },
    }),
    {
      name: 'soloflow-storage',
      storage: {
        getItem: (name) => {
          const raw = classAwareStorage.getItem(name)
          if (!raw) return null
          const parsed = JSON.parse(raw) as { state: PersistedShape; version?: number }
          const { state } = parsed

          const restored = {
            projects: (state.projects || []).map(p => Project.fromJSON(p)),
            activeProjectId: state.activeProjectId || 'default-project',
            tasks: (state.tasks || []).map(Task.fromJSON),
            sprints: (state.sprints || []).map(Sprint.fromJSON),
            roles: state.roles || [],
            currentSprintId: state.currentSprintId ?? null,
            viewMode: state.viewMode || 'kanban',
            transactions: (state.transactions || []).map(Transaction.fromJSON),
            expenseCategories: state.expenseCategories?.length ? state.expenseCategories : [...DEFAULT_EXPENSE_CATEGORIES],
            incomeCategories: state.incomeCategories?.length ? state.incomeCategories : [...DEFAULT_INCOME_CATEGORIES],
          }
          if (restored.projects.length === 0) {
            restored.projects.push(new Project('default-project', 'Master Project'))
          }
          return { state: restored as unknown as TaskStoreState, version: parsed.version }
        },
        setItem: (name, value) => {
          const s = value.state
          const toStore = {
            state: {
              projects: s.projects.map(p => p.toJSON()),
              activeProjectId: s.activeProjectId,
              tasks: s.tasks.map(t => t.toJSON()),
              sprints: s.sprints.map(sp => sp.toJSON()),
              roles: s.roles,
              currentSprintId: s.currentSprintId,
              viewMode: s.viewMode,
              transactions: s.transactions.map(t => t.toJSON()),
              expenseCategories: s.expenseCategories,
              incomeCategories: s.incomeCategories,
            },
            version: value.version,
          }
          classAwareStorage.setItem(name, JSON.stringify(toStore))
        },
        removeItem: (name) => classAwareStorage.removeItem(name),
      } satisfies PersistStorage<TaskStoreState>,
      partialize: (s) =>
        ({
          projects: s.projects,
          activeProjectId: s.activeProjectId,
          tasks: s.tasks,
          sprints: s.sprints,
          roles: s.roles,
          currentSprintId: s.currentSprintId,
          viewMode: s.viewMode,
          transactions: s.transactions,
          expenseCategories: s.expenseCategories,
          incomeCategories: s.incomeCategories,
        }) as TaskStoreState,
      version: 5,
    }
  )
)