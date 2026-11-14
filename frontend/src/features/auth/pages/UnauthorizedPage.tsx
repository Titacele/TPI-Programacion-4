import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <span className="text-6xl" aria-hidden="true">
        🚫
      </span>
      <h1 className="font-display text-4xl">Sin permiso</h1>
      <p className="text-cafe-suave">No tenés permisos para ver esta pantalla.</p>
      <Link to="/" className="rounded-lg bg-tomate px-4 py-2 font-semibold text-white hover:bg-tomate-oscuro">
        Volver al inicio
      </Link>
    </div>
  )
}
