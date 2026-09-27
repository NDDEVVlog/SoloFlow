import { useMemo } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { financeSummary } from '@/store/financeSelectors'
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown'
import { formatVnd } from '@/utils/money'

/** Tóm tắt thu/chi tháng này cho Dashboard — bấm "Xem chi tiết" để qua trang Thu chi. */
export function FinanceWidget() {
  const { transactions } = useTaskStore()
  const summary = useMemo(() => financeSummary(transactions, 'month'), [transactions])

  return (
    <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-base-50">Thu chi tháng này</h3>
        <a href="#/finance" className="text-xs font-medium text-accent-bright hover:underline">
          Xem chi tiết →
        </a>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <div className="text-[11px] uppercase text-base-500">Thu</div>
          <div className="text-lg font-bold text-signal-ok">{formatVnd(summary.totalIncome)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-base-500">Chi</div>
          <div className="text-lg font-bold text-signal-high">{formatVnd(summary.totalExpense)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase text-base-500">Chênh lệch</div>
          <div className={`text-lg font-bold ${summary.net >= 0 ? 'text-signal-ok' : 'text-signal-high'}`}>
            {formatVnd(summary.net)}
          </div>
        </div>
      </div>

      <CategoryBreakdown data={summary.expenseByCategory.slice(0, 4)} emptyLabel="Chưa có khoản chi nào tháng này." />
    </div>
  )
}