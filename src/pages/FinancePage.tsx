import { useMemo, useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { financeSummary, type FinancePeriod } from '@/store/financeSelectors'
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown'
import { TransactionTable } from '@/components/finance/TransactionTable'
import { NewTransactionModal } from '@/components/finance/NewTransactionModal'
import { formatVnd } from '@/utils/money'
import { PageHeader } from './OverviewPage'

export function FinancePage() {
  const { transactions } = useTaskStore()
  const [period, setPeriod] = useState<FinancePeriod>('week')
  const [showNewTxn, setShowNewTxn] = useState(false)

  const summary = useMemo(() => financeSummary(transactions, period), [transactions, period])

  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions]
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Thu chi" subtitle="Theo dõi tiền chi/thu theo tuần hoặc tháng." />
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-base-700 bg-base-800 p-0.5 text-sm">
            {(['week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1.5 transition ${
                  period === p ? 'bg-accent text-white' : 'text-base-400 hover:text-base-100'
                }`}
              >
                {p === 'week' ? 'Tuần này' : 'Tháng này'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowNewTxn(true)}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-accent-dim"
          >
            + Giao dịch
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MoneyCard title="Tổng thu" value={summary.totalIncome} changePercent={summary.incomeChangePercent} color="text-signal-ok" />
        <MoneyCard
          title="Tổng chi"
          value={summary.totalExpense}
          changePercent={summary.expenseChangePercent}
          color="text-signal-high"
          invertChangeColor
        />
        <MoneyCard title="Chênh lệch" value={summary.net} color={summary.net >= 0 ? 'text-signal-ok' : 'text-signal-high'} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
          <h3 className="mb-4 text-sm font-semibold text-base-50">Chi theo danh mục</h3>
          <CategoryBreakdown data={summary.expenseByCategory} emptyLabel="Chưa có khoản chi nào trong kỳ này." />
        </div>
        <div className="rounded-xl border border-base-700 bg-base-800/40 p-4">
          <h3 className="mb-4 text-sm font-semibold text-base-50">Thu theo danh mục</h3>
          <CategoryBreakdown data={summary.incomeByCategory} emptyLabel="Chưa có khoản thu nào trong kỳ này." />
        </div>
      </div>

      <TransactionTable transactions={sortedTransactions} emptyLabel="Chưa có giao dịch nào. Bấm '+ Giao dịch' để thêm." />

      {showNewTxn && <NewTransactionModal onClose={() => setShowNewTxn(false)} />}
    </div>
  )
}

function MoneyCard({
  title,
  value,
  changePercent,
  color,
  invertChangeColor,
}: {
  title: string
  value: number
  changePercent?: number | null
  color: string
  invertChangeColor?: boolean
}) {
  const isUp = (changePercent ?? 0) >= 0
  const changeIsGood = invertChangeColor ? !isUp : isUp
  return (
    <div className="flex flex-col justify-center rounded-xl border border-base-700 bg-base-800/40 p-5 shadow-sm">
      <h4 className="text-xs font-medium uppercase tracking-wider text-base-400">{title}</h4>
      <div className={`mt-2 text-2xl font-bold ${color}`}>{formatVnd(value)}</div>
      {changePercent !== null && changePercent !== undefined && (
        <p className={`mt-1 text-xs ${changeIsGood ? 'text-signal-ok' : 'text-signal-high'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(changePercent)}% so với kỳ trước
        </p>
      )}
    </div>
  )
}