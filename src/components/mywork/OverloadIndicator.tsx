import { ProgressBar } from '@/components/common/ProgressBar'
import { OVERLOAD_CAP_HOURS, activeWorkloadHours } from '@/store/selectors'
import type { Task } from '@/models'

interface OverloadIndicatorProps {
  tasks: Task[]
}

/** Sums Est. Time for Todo + In Progress tasks in the current sprint and
 * flips red past the 40h/week cap, per the brief's "Overload Indicator". */
export function OverloadIndicator({ tasks }: OverloadIndicatorProps) {
  const hours = activeWorkloadHours(tasks)
  const percent = (hours / OVERLOAD_CAP_HOURS) * 100
  const overloaded = hours > OVERLOAD_CAP_HOURS

  return (
    <div className="mb-5 rounded-xl border border-base-700 bg-base-800/50 px-4 py-3">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-base-100">
          Active workload this sprint
          {overloaded && <span className="ml-2 rounded-full bg-signal-highBg px-2 py-0.5 text-xs font-semibold text-signal-high">OVERLOAD</span>}
        </span>
        <span className={`font-mono text-xs ${overloaded ? 'text-signal-high' : 'text-base-400'}`}>
          {hours}h / {OVERLOAD_CAP_HOURS}h
        </span>
      </div>
      <ProgressBar percent={percent} color={overloaded ? '#F0546B' : '#7C6CF6'} trackClassName="bg-base-700" height={8} />
    </div>
  )
}
