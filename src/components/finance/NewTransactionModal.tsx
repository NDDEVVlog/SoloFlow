import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { Modal } from '@/components/common/Modal'
import type { TransactionType } from '@/models'

interface Props {
  onClose: () => void
}

export function NewTransactionModal({ onClose }: Props) {
  const { addTransaction, expenseCategories, incomeCategories, tasks } = useTaskStore()
  
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [taskId, setTaskId] = useState('')

  const categories = type === 'expense' ? expenseCategories : incomeCategories

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category.trim() || !date) return

    addTransaction({
      type,
      amount: Number(amount),
      category: category.trim(),
      note: note.trim(),
      date,
      taskId: taskId || null,
    })
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-5 text-xl font-semibold text-base-50">Giao dịch mới</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-base-200">
            <input 
              type="radio" 
              checked={type === 'expense'} 
              onChange={() => { setType('expense'); setCategory('') }} 
              className="accent-accent"
            />
            Khoản chi
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-base-200">
            <input 
              type="radio" 
              checked={type === 'income'} 
              onChange={() => { setType('income'); setCategory('') }} 
              className="accent-accent"
            />
            Khoản thu
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Số tiền (VNĐ)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Danh mục</label>
          <input
            type="text"
            list="category-options"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            placeholder="Chọn hoặc nhập danh mục mới..."
            required
          />
          <datalist id="category-options">
            {categories.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Ngày giao dịch</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Ghi chú (Tuỳ chọn)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-base-300">Task liên kết (Tuỳ chọn)</label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full rounded-lg border border-base-700 bg-base-900 p-2 text-base-50 focus:border-accent focus:outline-none"
          >
            <option value="">-- Không liên kết --</option>
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-base-400 transition hover:bg-base-800 hover:text-base-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-dim"
          >
            Lưu Giao dịch
          </button>
        </div>
      </form>
    </Modal>
  )
}