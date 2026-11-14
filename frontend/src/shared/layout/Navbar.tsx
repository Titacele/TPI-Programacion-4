import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { queryClient } from '../api/queryClient'

function claseEnlace({ isActive }: { isActive: boolean }): string {
  return `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-crema/80 hover:text-white'
  }`
}

export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidadCarrito = useCartStore((s) => s.cantidadItems())
  const navigate = useNavigate()

  async function cerrarSesion() {
    await logout()
    queryClient.removeQueries({ queryKey: ['pedidos'] }) // no dejar datos del usuario anterior
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-cafe text-crema shadow-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="mr-2 flex items-center gap-2 font-display text-2xl text-white">
          <span className="grid size-9 place-items-center rounded-full bg-tomate text-lg" aria-hidden="true">
            🍔
          </span>
          Food Store
        </Link>

        <nav className="order-last flex w-full flex-wrap items-center gap-1 sm:order-none sm:w-auto sm:flex-1">
          <NavLink to="/" end className={claseEnlace}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={claseEnlace}>
            Carrito
            {cantidadCarrito > 0 && (
              <span className="ml-1.5 rounded-full bg-mostaza px-1.5 py-0.5 text-xs text-cafe">
                {cantidadCarrito}
              </span>
            )}
          </NavLink>
          {usuario && (
            <NavLink to="/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
          {usuario?.role === 'admin' && (
            <NavLink to="/admin" className={claseEnlace}>
              Panel admin
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          {usuario ? (
            <>
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-white">{usuario.full_name}</p>
                <p className="text-xs text-mostaza">{usuario.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
              </div>
              <button
                type="button"
                onClick={cerrarSesion}
                className="rounded-lg border border-crema/30 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={claseEnlace}>
                Ingresar
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-tomate px-3 py-1.5 text-sm font-semibold text-white hover:bg-tomate-oscuro"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
