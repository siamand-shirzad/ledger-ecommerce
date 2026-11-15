import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const base = 'rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const styles = {
    primary: 'bg-(--color-ink) text-white hover:bg-(--color-accent-ink)',
    ghost: 'bg-transparent border border-(--color-line) text-(--color-ink) hover:border-(--color-ink)',
    danger: 'bg-(--color-danger-soft) text-(--color-danger) hover:bg-(--color-danger) hover:text-white',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 font-medium text-(--color-ink-soft)">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-(--color-danger)">{error}</span>}
    </label>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-(--color-line) px-3 py-2 text-sm bg-(--color-surface) outline-none focus:border-(--color-accent) ${props.className ?? ''}`}
    />
  )
}

export function Alert({ kind = 'danger', children }: { kind?: 'danger' | 'success'; children: ReactNode }) {
  const styles =
    kind === 'danger' ? 'bg-(--color-danger-soft) text-(--color-danger)' : 'bg-(--color-success-soft) text-(--color-success)'
  return <div className={`rounded-md px-3 py-2 text-sm ${styles}`}>{children}</div>
}

export function Spinner() {
  return (
    <div
      className="h-5 w-5 rounded-full border-2 border-(--color-line) border-t-(--color-accent) animate-spin"
      role="status"
      aria-label="Loading"
    />
  )
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div>
        {eyebrow && <div className="text-xs uppercase tracking-wider text-(--color-accent) mb-1">{eyebrow}</div>}
        <h1 className="font-display text-2xl">{title}</h1>
      </div>
      {action}
    </div>
  )
}
