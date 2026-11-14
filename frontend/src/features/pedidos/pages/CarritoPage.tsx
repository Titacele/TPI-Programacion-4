import { Link } from 'react-router-dom'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useAuthStore } from '../../../store/authStore'
import { useCartStore } from '../../../store/cartStore'
import { ItemCarritoFila } from '../components/ItemCarritoFila'

export function CarritoPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const usuario = useAuthStore((s) => s.usuario)

  if (items.length === 0) {
    return (
      <>
        <EncabezadoPagina titulo="Tu carrito" />
        <EstadoVacio
          titulo="El carrito está vacío"
          mensaje="Agregá productos desde el catálogo."
          accion={
            <Link to="/" className="rounded-lg bg-tomate px-4 py-2 font-semibold text-white hover:bg-tomate-oscuro">
              Ver catálogo
            </Link>
          }
        />
      </>
    )
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Tu carrito"
        acciones={
          <Button variante="fantasma" tamano="sm" onClick={vaciar}>
            Vaciar carrito
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="px-6">
          <ul className="divide-y divide-cafe/10">
            {items.map((item) => (
              <ItemCarritoFila key={item.producto_id} item={item} />
            ))}
          </ul>
        </Card>

        <Card className="h-fit space-y-4 p-6">
          <h2 className="font-display text-2xl">Resumen</h2>
          <div className="flex justify-between text-sm text-cafe-suave">
            <span>Productos</span>
            <span>{items.reduce((suma, i) => suma + i.cantidad, 0)}</span>
          </div>
          <div className="flex items-end justify-between border-t border-cafe/10 pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl text-tomate">{formatearPrecio(total)}</span>
          </div>
          <Link
            to="/checkout"
            className="block rounded-lg bg-tomate px-4 py-2.5 text-center font-semibold text-white hover:bg-tomate-oscuro"
          >
            {usuario ? 'Continuar al pago' : 'Ingresar para confirmar'}
          </Link>
          <p className="text-xs text-cafe-suave">
            El precio final se confirma al crear el pedido, con el stock disponible en ese momento.
          </p>
        </Card>
      </div>
    </>
  )
}
