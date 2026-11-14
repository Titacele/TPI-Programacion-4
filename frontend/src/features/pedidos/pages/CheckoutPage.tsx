import { Link, Navigate, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/components/Alerta'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { Card } from '../../../shared/ui/Card'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCartStore } from '../../../store/cartStore'
import { CheckoutForm, type DatosCheckout } from '../components/CheckoutForm'
import { useCrearPedido } from '../hooks/useCrearPedido'

export function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total())
  const vaciar = useCartStore((s) => s.vaciar)
  const crearPedido = useCrearPedido()
  const navigate = useNavigate()

  // Sin ítems no hay nada que confirmar (salvo justo después de crear el pedido).
  if (items.length === 0 && !crearPedido.isSuccess) {
    return <Navigate to="/carrito" replace />
  }

  function confirmar(datos: DatosCheckout) {
    crearPedido.mutate(
      {
        ...datos,
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
      },
      {
        onSuccess: (pedido) => {
          vaciar()
          navigate('/mis-pedidos', { replace: true, state: { pedidoCreado: pedido.id } })
        },
      },
    )
  }

  return (
    <>
      <EncabezadoPagina titulo="Confirmar pedido" subtitulo="Revisá tu pedido y completá los datos de entrega." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          {crearPedido.isError && (
            <div className="mb-4">
              <Alerta mensaje={handleApiError(crearPedido.error)} />
            </div>
          )}
          <CheckoutForm enviando={crearPedido.isPending} onEnviar={confirmar} />
        </Card>

        <Card className="h-fit p-6">
          <h2 className="mb-3 font-display text-2xl">Tu pedido</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.producto_id} className="flex justify-between gap-3">
                <span>
                  {i.cantidad} × {i.nombre}
                </span>
                <span className="font-semibold">{formatearPrecio(i.precio_unitario * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-end justify-between border-t border-cafe/10 pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-display text-3xl text-tomate">{formatearPrecio(total)}</span>
          </div>
          <Link to="/carrito" className="mt-4 inline-block text-sm font-semibold text-tomate hover:underline">
            ← Modificar carrito
          </Link>
        </Card>
      </div>
    </>
  )
}
