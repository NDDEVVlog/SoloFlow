// src/App.tsx
import { useEffect } from 'react'
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useTaskStore } from '@/store/useTaskStore'
import { OverviewPage } from '@/pages/OverviewPage'
import { MyWorkPage } from '@/pages/MyWorkPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FinancePage } from '@/pages/FinancePage'
import { ProjectSwitcher } from '@/components/common/ProjectSwitcher' // <-- IMPORT THÊM CÁI NÀY

const NAV_ITEMS = [
  { to: '/overview', label: 'Project Overview', hint: 'Master backlog' },
  { to: '/my-work', label: 'My Work', hint: 'Sprint board' },
  { to: '/dashboard', label: 'Dashboard', hint: 'Performance' },
  { to: '/finance', label: 'Thu chi', hint: 'Income & expense' },
]

export default function App() {
  const seedIfEmpty = useTaskStore((s) => s.seedIfEmpty)

  useEffect(() => {
    seedIfEmpty()
  }, [seedIfEmpty])

  return (
    <HashRouter>
      <div className="flex h-screen bg-base-950 text-base-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/my-work" element={<MyWorkPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="*" element={<Navigate to="/overview" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  )
}

function Sidebar() {
  const resetToSampleData = useTaskStore((s) => s.resetToSampleData)
  const taskCount = useTaskStore((s) => s.tasks.length)

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-base-800 bg-base-900 px-4 py-5">
      {/* LOGO */}
      <div className="mb-6 flex items-center gap-2 px-1">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#7C6CF6" />
          <path d="M8 20l5-9 5 6 6-11" stroke="white" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div className="text-sm font-semibold text-base-50">SoloFlow</div>
          <div className="text-[11px] text-base-500">{taskCount} tasks tracked</div>
        </div>
      </div>

      {/* CHỖ CHỌN & TẠO PROJECT NẰM Ở ĐÂY */}
      <div className="mb-6">
        <ProjectSwitcher />
      </div>

      {/* MENU NAV */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition ${
                isActive ? 'bg-accent/15 text-accent-bright' : 'text-base-300 hover:bg-base-800 hover:text-base-100'
              }`
            }
          >
            <div className="font-medium">{item.label}</div>
            <div className="text-[11px] text-base-500">{item.hint}</div>
          </NavLink>
        ))}
      </nav>

      {/* NÚT RESET */}
      <button
        onClick={() => {
          if (confirm('Reset all data back to the sample tasks? This cannot be undone.')) {
            resetToSampleData()
          }
        }}
        className="rounded-lg px-3 py-2 text-left text-xs text-base-500 transition hover:bg-base-800 hover:text-base-300"
      >
        Reset to sample data
      </button>
    </aside>
  )
}