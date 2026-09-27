import { useTaskStore } from '@/store/useTaskStore'
import { colorForRole } from '@/models/enums'
import { formatVnd } from '@/utils/money'
import type { Transaction } from '@/models'

export function TransactionTable({ transactions, emptyLabel }: { transactions: Transaction[]; emptyLabel?: string }) {
  const { deleteTransaction } = useTaskStore()

  if (transactions.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-base-700 bg-base-900 p-10 text-center text-sm text-base-500">
        {emptyLabel || 'No transactions found.'}
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-base-700 bg-base-900 shadow-sm">
      <table className="w-full text-left text-sm text-base-300">
        <thead className="border-b border-base-700 bg-base-800/50 text-xs font-semibold uppercase tracking-wider text-base-400">
          <tr>
            <th className="px-4 py-3">Ngày</th>
            <th className="px-4 py-3">Loại</th>
            <th className="px-4 py-3">Danh mục</th>
            <th className="px-4 py-3">Ghi chú</th>
            <th className="px-4 py-3 text-right">Số tiền</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-800">
          {transactions.map((t) => (
            <tr key={t.id} className="transition hover:bg-base-800/40">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-base-400">
                {new Date(t.date).toLocaleDateString('vi-VN')}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    t.type === 'income' ? 'bg-signal-ok/20 text-signal-ok' : 'bg-signal-high/10 text-signal-high'
                  }`}
                >
                  {t.type === 'income' ? 'Thu' : 'Chi'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium text-base-950"
                  style={{ backgroundColor: colorForRole(t.category) }}
                >
                  {t.category}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-base-400">{t.note || '-'}</td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                  t.type === 'income' ? 'text-signal-ok' : 'text-signal-high'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}
                {formatVnd(t.amount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  onClick={() => {
                    if (confirm('Xoá giao dịch này?')) deleteTransaction(t.id)
                  }}
                  className="text-base-600 hover:text-signal-high"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}