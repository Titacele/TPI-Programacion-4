import type { ReactNode } from 'react'

interface EncabezadoPaginaProps {
  titulo: string
  subtitulo?: string
  acciones?: ReactNode
}

export function EncabezadoPagina({ titulo, subtitulo, acciones }: EncabezadoPaginaProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-4xl">{titulo}</h1>
        {subtitulo && <p className="mt-1 text-cafe-suave">{subtitulo}</p>}
      </div>
      {acciones}
    </div>
  )
}
