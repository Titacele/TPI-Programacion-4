import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const estiloCampo =
  'w-full rounded-lg border bg-white px-3 py-2 text-cafe placeholder:text-cafe-suave/60 focus:outline-2 focus:outline-mostaza disabled:bg-crema-oscuro'

interface EnvoltorioProps {
  id: string
  label: string
  error?: string
  children: ReactNode
}

/** Label + campo + mensaje de error, común a Input, Select y Textarea. */
function Envoltorio({ id, label, error, children }: EnvoltorioProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-tomate">
          {error}
        </p>
      )}
    </div>
  )
}

function bordeSegunError(error?: string): string {
  return error ? 'border-tomate' : 'border-cafe/20'
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export function Input({ id, label, error, className = '', ...props }: InputProps) {
  return (
    <Envoltorio id={id} label={label} error={error}>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${estiloCampo} ${bordeSegunError(error)} ${className}`}
        {...props}
      />
    </Envoltorio>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string
  label: string
  error?: string
}

export function Select({ id, label, error, className = '', children, ...props }: SelectProps) {
  return (
    <Envoltorio id={id} label={label} error={error}>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={`${estiloCampo} ${bordeSegunError(error)} ${className}`}
        {...props}
      >
        {children}
      </select>
    </Envoltorio>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
}

export function Textarea({ id, label, error, className = '', ...props }: TextareaProps) {
  return (
    <Envoltorio id={id} label={label} error={error}>
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        className={`${estiloCampo} ${bordeSegunError(error)} ${className}`}
        rows={3}
        {...props}
      />
    </Envoltorio>
  )
}
