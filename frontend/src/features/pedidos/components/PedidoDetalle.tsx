import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import type { Pedido } from '../types/pedido.types'

/** Detalle de un pedido con sus líneas (precios copiados al momento de la compra). */
export function PedidoDetalle({ pedido }: { pedido: Pedido }) {
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div>
          <dt className="text-cafe-suave">Estado</dt>
          <dd className="mt-0.5">
            <BadgeEstado estado={pedido.estado} />
          </dd>
        </div>
        <div>
          <dt className="text-cafe-suave">Fecha</dt>
          <dd className="font-semibold">{formatearFecha(pedido.created_at)}</dd>
        </div>
        <div>
          <dt className="text-cafe-suave">Forma de pago</dt>
          <dd className="font-semibold">{pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}</dd>
        </div>
        <div>
          <dt className="text-cafe-suave">Última actualización</dt>
          <dd className="font-semibold">{formatearFecha(pedido.updated_at)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-cafe-suave">Dirección de entrega</dt>
          <dd className="font-semibold">{pedido.direccion_entrega}</dd>
        </div>
        {pedido.notas && (
          <div className="col-span-2">
            <dt className="text-cafe-suave">Notas</dt>
            <dd>{pedido.notas}</dd>
          </div>
        )}
      </dl>

      <table className="w-full text-sm">
        <thead className="border-b border-cafe/15 text-left text-xs uppercase text-cafe-suave">
          <tr>
            <th className="py-2">Producto</th>
            <th className="py-2 text-right">Precio</th>
            <th className="py-2 text-right">Cant.</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cafe/10">
          {pedido.items.map((linea) => (
            <tr key={linea.producto_id}>
              <td className="py-2 font-semibold">{linea.nombre_producto}</td>
              <td className="py-2 text-right">{formatearPrecio(linea.precio_unitario)}</td>
              <td className="py-2 text-right">{linea.cantidad}</td>
              <td className="py-2 text-right">{formatearPrecio(linea.subtotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-cafe/20">
            <td colSpan={3} className="pt-3 text-right font-semibold">
              Total
            </td>
            <td className="pt-3 text-right font-display text-xl text-tomate">{formatearPrecio(pedido.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
