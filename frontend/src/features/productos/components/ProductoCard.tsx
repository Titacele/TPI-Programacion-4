import { useState } from 'react'
import { useCartStore } from '../../../store/cartStore'
import { Button } from '../../../shared/ui/Button'
import { formatearPrecio } from '../../../shared/utils/formato'
import type { Producto } from '../types/producto.types'

interface ProductoCardProps {
  producto: Producto
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((s) => s.agregar)
  const enCarrito = useCartStore(
    (s) => s.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0,
  )
  const [imagenRota, setImagenRota] = useState(false)

  const sinStock = producto.stock === 0
  const sePuedeAgregar = producto.disponible && enCarrito < producto.stock

  let textoBoton = 'Agregar al carrito'
  if (!producto.disponible) textoBoton = 'No disponible'
  else if (sinStock) textoBoton = 'Sin stock'
  else if (!sePuedeAgregar) textoBoton = 'Máximo en carrito'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-cafe/10 bg-white shadow-[0_2px_0_rgba(59,42,32,0.08)] transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-crema-oscuro">
        {producto.imagen_url && !imagenRota ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenRota(true)}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-5xl" aria-hidden="true">
            🍽️
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold">
          {producto.categoria.nombre}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg leading-snug font-semibold">{producto.nombre}</h3>
        {producto.descripcion && <p className="line-clamp-2 text-sm text-cafe-suave">{producto.descripcion}</p>}

        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="font-display text-2xl text-tomate">{formatearPrecio(producto.precio_base)}</p>
          <p className={`text-xs ${producto.stock <= 5 ? 'font-semibold text-tomate' : 'text-cafe-suave'}`}>
            {sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}
          </p>
        </div>

        <Button
          className="w-full"
          disabled={!sePuedeAgregar}
          onClick={() =>
            agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base })
          }
        >
          {textoBoton}
        </Button>
        {enCarrito > 0 && <p className="text-center text-xs text-oliva">{enCarrito} en tu carrito</p>}
      </div>
    </article>
  )
}
