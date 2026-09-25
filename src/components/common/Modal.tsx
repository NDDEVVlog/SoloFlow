import { useEffect, type PropsWithChildren } from 'react'

interface ModalProps extends PropsWithChildren {
  onClose: () => void
  widthClassName?: string
}

export function Modal({ onClose, widthClassName = 'max-w-2xl', children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`w-full ${widthClassName} rounded-xl border border-base-700 bg-base-900 shadow-card`}
      >
        {children}
      </div>
    </div>
  )
}
