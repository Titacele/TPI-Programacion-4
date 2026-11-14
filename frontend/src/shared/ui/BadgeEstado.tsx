import type { EstadoPedido } from '../../features/pedidos/types/pedido.types'

const estilos: Record<EstadoPedido, string> = {
  PENDIENTE: 'bg-mostaza/25 text-[#8a5a00] ring-mostaza/50',
  EN_PREPARACION: 'bg-sky-100 text-sky-800 ring-sky-300',
  ENTREGADO: 'bg-oliva/15 text-oliva ring-oliva/40',
  CANCELADO: 'bg-tomate/10 text-tomate-oscuro ring-tomate/30',
}

const etiquetas: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${estilos[estado]}`}
    >
      {etiquetas[estado]}
    </span>
  )
}
