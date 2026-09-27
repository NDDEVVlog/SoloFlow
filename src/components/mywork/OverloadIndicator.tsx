import { useTaskStore } from '@/store/useTaskStore'
import type { Task } from '@/models'

export function OverloadIndicator({ tasks }: { tasks: Task[] }) {
  const { sprints, currentSprintId } = useTaskStore()
  const sprint = sprints.find((s) => s.id === currentSprintId)
  const capacity = sprint?.capacityHours || 40

  let done = 0
  let progress = 0
  let delay = 0

  for (const t of tasks) {
    if (t.status === 'Done') {
      done += t.estHours
    } else {
      progress += t.estHours
    }
    
    if (t.actualHours > t.estHours) {
      delay += t.actualHours - t.estHours
    }
  }

  const total = done + progress + delay
  const max = Math.max(capacity, total)

  const donePct = max === 0 ? 0 : (done / max) * 100
  const progressPct = max === 0 ? 0 : (progress / max) * 100
  const delayPct = max === 0 ? 0 : (delay / max) * 100

  const isOverload = total > capacity

  return (
    <div className="mb-6 rounded-xl border border-base-700 bg-base-800/40 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-base-50">Active workload this sprint</h3>
        <div className={`text-sm font-medium ${isOverload ? 'text-signal-high' : 'text-base-400'}`}>
          {Math.round(total * 10) / 10}h <span className="text-base-500">/ {capacity}h</span>
        </div>
      </div>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-base-900">
        <div 
          style={{ width: `${donePct}%`, backgroundColor: '#39B87A' }} 
          className="h-full transition-all duration-500" 
          title={`Done: ${Math.round(done * 10) / 10}h`}
        />
        <div 
          style={{ width: `${progressPct}%`, backgroundColor: '#4B9CE8' }} 
          className="h-full transition-all duration-500" 
          title={`Progress: ${Math.round(progress * 10) / 10}h`}
        />
        <div 
          style={{ width: `${delayPct}%`, backgroundColor: '#F0546B' }} 
          className="h-full transition-all duration-500" 
          title={`Delay: ${Math.round(delay * 10) / 10}h`}
        />
      </div>
      
      <div className="mt-4 flex gap-5 text-xs font-medium text-base-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: '#39B87A'}}></span> 
          Done ({Math.round(done * 10) / 10}h)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: '#4B9CE8'}}></span> 
          Progress ({Math.round(progress * 10) / 10}h)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: '#F0546B'}}></span> 
          Delay ({Math.round(delay * 10) / 10}h)
        </div>
      </div>
    </div>
  )
}