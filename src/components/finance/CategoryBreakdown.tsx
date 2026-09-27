import type { CategoryTotal } from '@/store/financeSelectors'
import { formatVnd } from '@/utils/money'

/** Danh sách thanh ngang thể hiện tỉ trọng từng danh mục — cùng phong cách với WorkloadByRole. */
export function CategoryBreakdown({ data, emptyLabel }: { data: CategoryTotal[]; emptyLabel: string }) {
  if (data.length === 0) {
    return <div className="py-6 text-center text-xs text-base-500">{emptyLabel}</div>
  }

  return (
    <div className="space-y-3">
      {data.map((row) => (
        <div key={row.category}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-base-200">{row.category}</span>
            <span className="text-base-400">
              {formatVnd(row.amount)} · {row.percent}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-800">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${row.percent}%`, backgroundColor: row.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}