import { useCartStore, type ItemCarrito } from '../../../store/cartStore'
import { formatearPrecio } from '../../../shared/utils/formato'

export function ItemCarritoFila({ item }: { item: ItemCarrito }) {
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad)
  const quitar = useCartStore((s) => s.quitar)

  return (
    <li className="flex flex-wrap items-center gap-4 py-4">
      <div className="min-w-40 flex-1">
        <p className="font-semibold">{item.nombre}</p>
        <p className="text-sm text-cafe-suave">{formatearPrecio(item.precio_unitario)} c/u</p>
      </div>

      <div className="flex items-center rounded-lg ring-1 ring-cafe/20" role="group" aria-label={`Cantidad de ${item.nombre}`}>
        <button
          type="button"
          onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
          className="px-3 py-1.5 text-lg hover:bg-crema-oscuro"
          aria-label="Restar uno"
        >
          −
        </button>
        <span className="w-10 text-center font-semibold" aria-live="polite">
          {item.cantidad}
        </span>
        <button
          type="button"
          onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
          className="px-3 py-1.5 text-lg hover:bg-crema-oscuro"
          aria-label="Sumar uno"
        >
          +
        </button>
      </div>

      <p className="w-28 text-right font-semibold">{formatearPrecio(item.precio_unitario * item.cantidad)}</p>

      <button
        type="button"
        onClick={() => quitar(item.producto_id)}
        className="text-sm font-semibold text-tomate hover:underline"
      >
        Quitar
      </button>
    </li>
  )
}
