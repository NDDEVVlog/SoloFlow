import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { Modal } from '@/components/common/Modal'

interface Props {
  onClose: () => void
}

export function NewSprintModal({ onClose }: Props) {
  const { activeProjectId, addSprint, setCurrentSprint } = useTaskStore()
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [capacity, setCapacity] = useState<number>(40)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !startDate || !endDate) return
    const sprint = addSprint(activeProjectId, name.trim(), startDate, endDate, capacity)
    setCurrentSprint(sprint.id)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-5 text-xl font-semibold text-base-50">Create New Sprint</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Sprint Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            required
            autoFocus
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-base-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-base-300">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Capacity (Hours)</label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            required
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
            Create Sprint
          </button>
        </div>
      </form>
    </Modal>
  )
}