import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-cafe/10 bg-white shadow-[0_2px_0_rgba(59,42,32,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
