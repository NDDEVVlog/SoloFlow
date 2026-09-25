import { useState } from 'react'
import { Modal } from './Modal'
import { todayISO } from '@/utils/time'

interface QuickAddSprintModalProps {
  onClose: () => void
  onCreate: (name: string, startDate: string, endDate: string, capacityHours: number) => void
}

function isoPlusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Opened from the "+ New sprint…" option in a ColorSelect. Creates the
 * sprint and immediately assigns it to whichever task triggered it. */
export function QuickAddSprintModal({ onClose, onCreate }: QuickAddSprintModalProps) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(isoPlusDays(7))
  const [capacityHours, setCapacityHours] = useState(40)

  const inputCls =
    'w-full rounded-lg border border-base-700 bg-base-800 px-3 py-2 text-sm text-base-100 placeholder-base-400 outline-none focus:border-accent'
  const labelCls = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-base-400'

  return (
    <Modal onClose={onClose} widthClassName="max-w-sm">
      <form
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          onCreate(name.trim(), new Date(startDate).toISOString(), new Date(endDate).toISOString(), capacityHours)
        }}
      >
        <h2 className="mb-3 text-sm font-semibold text-base-50">New sprint / tuần</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Name</label>
            <input autoFocus className={inputCls} placeholder="e.g. Tuần 2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start</label>
              <input type="date" className={inputCls} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>End</label>
              <input type="date" className={inputCls} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Capacity (h/week)</label>
            <input
              type="number" min="0" step="1" className={inputCls}
              value={capacityHours}
              onChange={(e) => setCapacityHours(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1.5 text-sm text-base-400 hover:text-base-100">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white hover:bg-accent-dim">
            Add sprint
          </button>
        </div>
      </form>
    </Modal>
  )
}
