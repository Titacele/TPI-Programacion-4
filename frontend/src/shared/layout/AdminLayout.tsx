import { NavLink, Outlet } from 'react-router-dom'

const secciones = [
  { to: '/admin/resumen', label: 'Resumen' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/usuarios', label: 'Usuarios' },
]

/** Pestañas del panel de administración. */
export function AdminLayout() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-tomate">Panel de administración</p>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="Secciones del panel">
          {secciones.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-cafe text-crema' : 'bg-white text-cafe ring-1 ring-cafe/15 hover:bg-crema-oscuro'
                }`
              }
            >
              {s.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
