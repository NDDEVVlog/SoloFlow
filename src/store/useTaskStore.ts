import { create } from 'zustand'
import { persist, type PersistStorage } from 'zustand/middleware'
import { Sprint, Task, type SprintJSON, type TaskJSON } from '@/models'
import { DEFAULT_ROLES } from '@/models/enums'
import { nextTaskId, shortId } from '@/utils/id'
import { buildSampleData } from '@/utils/sampleData'

export type ViewMode = 'list' | 'kanban'

export interface Project {
  id: string
  name: string
}

interface PersistedShape {
  projects: Project[]
  activeProjectId: string
  tasks: TaskJSON[]
  sprints: SprintJSON[]
  roles: string[]
  currentSprintId: string | null
  viewMode: ViewMode
}

interface TaskStoreState {
  projects: Project[]
  activeProjectId: string
  tasks: Task[]
  sprints: Sprint[]
  roles: string[]
  currentSprintId: string | null
  viewMode: ViewMode

  addProject: (name: string) => void
  setActiveProject: (id: string) => void

  createTask: (input: Partial<Task> & { name: string; role: string }) => Task
  updateTask: (id: string, patch: Partial<Pick<Task,
    'name' | 'role' | 'type' | 'priority' | 'status' | 'estHours' | 'actualHours' | 'complexity' | 'sprintId' | 'dueDate' | 'description'
  >>) => void
  deleteTask: (id: string) => void
  setTaskStatus: (id: string, status: Task['status']) => void

  addChecklistItem: (taskId: string, label: string) => void
  toggleChecklistItem: (taskId: string, itemId: string) => void
  removeChecklistItem: (taskId: string, itemId: string) => void

  addComment: (taskId: string, author: string, text: string) => void

  addSprint: (name: string, startDate: string, endDate: string, capacityHours?: number) => Sprint
  setCurrentSprint: (sprintId: string | null) => void

  addRole: (role: string) => void
  setViewMode: (mode: ViewMode) => void

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
      projects: [{ id: 'default-project', name: 'Master Project' }],
      activeProjectId: 'default-project',
      tasks: [],
      sprints: [],
      roles: [...DEFAULT_ROLES],
      currentSprintId: null,
      viewMode: 'kanban',

      addProject: (name) => {
        const id = 'PROJ-' + shortId('PRJ')
        set((s) => ({ projects: [...s.projects, { id, name }], activeProjectId: id }))
      },
      
      setActiveProject: (id) => set({ activeProjectId: id }),

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

      addSprint: (name, startDate, endDate, capacityHours = 40) => {
        const sprint = new Sprint(shortId('SPR'), name, startDate, endDate, capacityHours)
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
        const roles = Array.from(new Set([...DEFAULT_ROLES, ...tasks.map((t) => t.role)]))
        set({ 
          projects: [{ id: 'default-project', name: 'Master Project' }],
          activeProjectId: 'default-project',
          tasks, 
          sprints, 
          roles, 
          currentSprintId: sprints[0]?.id ?? null, 
          viewMode: 'kanban' 
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
            projects: state.projects || [{ id: 'default-project', name: 'Master Project' }],
            activeProjectId: state.activeProjectId || 'default-project',
            tasks: (state.tasks || []).map(Task.fromJSON),
            sprints: (state.sprints || []).map(Sprint.fromJSON),
            roles: state.roles || [],
            currentSprintId: state.currentSprintId ?? null,
            viewMode: state.viewMode || 'kanban',
          }
          return { state: restored as unknown as TaskStoreState, version: parsed.version }
        },
        setItem: (name, value) => {
          const s = value.state
          const toStore = {
            state: {
              projects: s.projects,
              activeProjectId: s.activeProjectId,
              tasks: s.tasks.map((t) => t.toJSON()),
              sprints: s.sprints.map((sp) => sp.toJSON()),
              roles: s.roles,
              currentSprintId: s.currentSprintId,
              viewMode: s.viewMode,
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
        }) as TaskStoreState,
      version: 3, // BUMP VERSION to merge new fields properly
    }
  )
)