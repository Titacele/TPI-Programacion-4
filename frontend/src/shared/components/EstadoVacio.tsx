import type { ReactNode } from 'react'

interface EstadoVacioProps {
  titulo: string
  mensaje?: string
  accion?: ReactNode
}

export function EstadoVacio({ titulo, mensaje, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-cafe/15 px-6 py-14 text-center">
      <span className="text-4xl" aria-hidden="true">
        🍽️
      </span>
      <h3 className="font-display text-2xl">{titulo}</h3>
      {mensaje && <p className="max-w-md text-cafe-suave">{mensaje}</p>}
      {accion}
    </div>
  )
}
