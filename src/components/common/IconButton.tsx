import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

export function IconButton({ children, className = '', ...rest }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg border border-base-700 bg-base-800 p-1.5 text-base-300 transition hover:border-base-600 hover:text-base-100 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
