import { useRef, useState } from 'react'
import type { Categoria } from '../../categorias/types/categoria.types'

interface FiltrosCatalogoProps {
  categorias: Categoria[]
  categoriaId: number | undefined
  onBuscar: (texto: string) => void
  onCategoria: (categoriaId: number | undefined) => void
}

const ESPERA_BUSQUEDA_MS = 350

export function FiltrosCatalogo({ categorias, categoriaId, onBuscar, onCategoria }: FiltrosCatalogoProps) {
  const [texto, setTexto] = useState('')
  const temporizador = useRef<number | undefined>(undefined)

  // Debounce: la búsqueda se dispara cuando el usuario deja de escribir.
  function cambiarTexto(valor: string) {
    setTexto(valor)
    window.clearTimeout(temporizador.current)
    temporizador.current = window.setTimeout(() => onBuscar(valor.trim()), ESPERA_BUSQUEDA_MS)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cafe-suave" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          value={texto}
          onChange={(e) => cambiarTexto(e.target.value)}
          placeholder="Buscar hamburguesas, pizzas, bebidas…"
          aria-label="Buscar productos"
          className="w-full rounded-full border border-cafe/20 bg-white py-3 pr-4 pl-11 shadow-sm focus:outline-2 focus:outline-mostaza"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        <BotonCategoria activo={categoriaId === undefined} onClick={() => onCategoria(undefined)}>
          Todas
        </BotonCategoria>
        {categorias.map((c) => (
          <BotonCategoria key={c.id} activo={categoriaId === c.id} onClick={() => onCategoria(c.id)}>
            {c.nombre}
          </BotonCategoria>
        ))}
      </div>
    </div>
  )
}

interface BotonCategoriaProps {
  activo: boolean
  onClick: () => void
  children: string
}

function BotonCategoria({ activo, onClick, children }: BotonCategoriaProps) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        activo ? 'bg-tomate text-white' : 'bg-white text-cafe ring-1 ring-cafe/15 hover:bg-crema-oscuro'
      }`}
    >
      {children}
    </button>
  )
}
