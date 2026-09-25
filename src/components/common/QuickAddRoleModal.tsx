import { useState } from 'react'
import { Modal } from './Modal'

interface QuickAddRoleModalProps {
  onClose: () => void
  onCreate: (role: string) => void
}

/** Opened from the "+ New role…" option in a ColorSelect. Creates the role
 * and immediately assigns it to whichever task triggered it — the caller
 * (TaskTable) owns which task that is. */
export function QuickAddRoleModal({ onClose, onCreate }: QuickAddRoleModalProps) {
  const [name, setName] = useState('')

  return (
    <Modal onClose={onClose} widthClassName="max-w-sm">
      <form
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          onCreate(name.trim())
        }}
      >
        <h2 className="mb-3 text-sm font-semibold text-base-50">New role</h2>
        <input
          autoFocus
          className="w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-base-100 placeholder-base-400 outline-none focus:border-accent"
          placeholder="e.g. Sound Design"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-base-400 hover:text-base-100">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white hover:bg-accent-dim">
            Add role
          </button>
        </div>
      </form>
    </Modal>
  )
}
