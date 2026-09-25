import { useMemo, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Task } from '@/models'
import { aggregateByPeriod, type Granularity } from '@/utils/time'

interface TimeProgressChartProps {
  tasks: Task[]
}

const GRANULARITIES: Granularity[] = ['day', 'week', 'month']

/** Est vs Actual hours per period as bars, completion-rate velocity as an
 * overlaid line — answers the brief's "is my velocity trending up or down". */
export function TimeProgressChart({ tasks }: TimeProgressChartProps) {
  const [granularity, setGranularity] = useState<Granularity>('week')
  const data = useMemo(() => aggregateByPeriod(tasks, granularity), [tasks, granularity])

  return (
    <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-base-100">Time &amp; progress over time</h3>
        <div className="inline-flex rounded-lg border border-base-700 bg-base-800 p-0.5">
          {GRANULARITIES.map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition ${
                granularity === g ? 'bg-accent text-white' : 'text-base-400 hover:text-base-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      {data.length === 0 ? (
        <EmptyState label="Log some actual hours to see your velocity here." />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ left: -10 }}>
            <CartesianGrid stroke="#242C39" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: '#94A0B3', fontSize: 12 }} axisLine={{ stroke: '#333D4D' }} tickLine={false} />
            <YAxis yAxisId="hours" tick={{ fill: '#94A0B3', fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
            <YAxis yAxisId="rate" orientation="right" domain={[0, 100]} tick={{ fill: '#94A0B3', fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              contentStyle={{ background: '#1B212C', border: '1px solid #333D4D', borderRadius: 8, fontSize: 13 }}
              labelStyle={{ color: '#E7EBF1' }}
            />
            <Bar yAxisId="hours" dataKey="estHours" name="Est. hours" fill="#4A5568" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar yAxisId="hours" dataKey="actualHours" name="Actual hours" fill="#7C6CF6" radius={[4, 4, 0, 0]} barSize={16} />
            <Line yAxisId="rate" type="monotone" dataKey="completionRate" name="Completion %" stroke="#39B87A" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function EmptyState({ label }: { label: string }) {
  return <div className="flex h-40 items-center justify-center text-sm text-base-500">{label}</div>
}
