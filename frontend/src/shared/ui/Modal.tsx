import type { ReactNode } from 'react'

interface ModalProps {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  ancho?: 'md' | 'lg'
}

// Referencia estable: React la llama solo al montar el diálogo, así el foco
// entra al modal una vez y no se lo roba a los campos en cada render.
function enfocar(nodo: HTMLDivElement | null) {
  nodo?.focus()
}

/** Diálogo modal. Se cierra con Escape, con la X o haciendo clic fuera. */
export function Modal({ abierto, titulo, onCerrar, children, ancho = 'md' }: ModalProps) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-cafe/50 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        ref={enfocar}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCerrar()
        }}
        className={`w-full ${ancho === 'lg' ? 'max-w-2xl' : 'max-w-md'} rounded-2xl bg-white p-6 shadow-xl outline-none`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-titulo" className="font-display text-2xl">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="rounded-md px-2 text-2xl leading-none text-cafe-suave hover:bg-crema-oscuro"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
