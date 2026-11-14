import type { FiltrosPedidos } from '../types/pedido.types'

/** Todas las claves empiezan con 'pedidos': invalidar ['pedidos'] refresca listas, detalles y resumen. */
export const pedidosKeys = {
  todos: ['pedidos'] as const,
  lista: (filtros: FiltrosPedidos) => ['pedidos', 'lista', filtros] as const,
  detalle: (id: number) => ['pedidos', 'detalle', id] as const,
  resumen: ['pedidos', 'resumen'] as const,
}
