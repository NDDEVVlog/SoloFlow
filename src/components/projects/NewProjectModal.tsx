import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { Modal } from '@/components/common/Modal'

interface Props {
  onClose: () => void
}

export function NewProjectModal({ onClose }: Props) {
  const addProject = useTaskStore((s) => s.addProject)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addProject(name.trim(), description.trim())
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-5 text-xl font-semibold text-base-50">Create New Project</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            rows={3}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-base-400 transition hover:bg-base-800 hover:text-base-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dim"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  )
}