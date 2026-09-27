import React, { useRef } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { downloadDataAsJson } from '@/utils/file'

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
)

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

export function DataSync() {
  const exportState = useTaskStore((s) => s.exportState)
  const importState = useTaskStore((s) => s.importState)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = exportState()
    const dateStr = new Date().toISOString().slice(0, 10)
    downloadDataAsJson(data, `soloflow-backup-${dateStr}.json`)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const success = importState(content)
      
      if (success) {
        alert('Phục hồi dữ liệu thành công! 🚀')
      } else {
        alert('File không hợp lệ hoặc bị lỗi định dạng.')
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
    
    reader.readAsText(file)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 rounded-md bg-[#242C39] px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-[#2A3342] hover:text-white transition-colors border border-[#2A3342]"
      >
        <DownloadIcon />
        Export
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-md bg-[#242C39] px-3 py-1.5 text-sm font-medium text-gray-300 hover:bg-[#2A3342] hover:text-white transition-colors border border-[#2A3342]"
      >
        <UploadIcon />
        Import
      </button>

      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        className="hidden"
      />
    </div>
  )
}