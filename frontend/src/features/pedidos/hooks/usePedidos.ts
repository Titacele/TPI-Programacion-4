import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { listarPedidos, obtenerPedido } from '../api/pedidos.api'
import type { FiltrosPedidos } from '../types/pedido.types'
import { pedidosKeys } from './pedidosKeys'

/** Pedidos propios (cliente) o todos (admin): el backend decide según el rol. */
export function usePedidos(filtros: FiltrosPedidos) {
  return useQuery({
    queryKey: pedidosKeys.lista(filtros),
    queryFn: () => listarPedidos(filtros),
    placeholderData: keepPreviousData,
  })
}

/** Detalle de un pedido; no consulta nada mientras id sea null. */
export function usePedido(id: number | null) {
  return useQuery({
    queryKey: pedidosKeys.detalle(id ?? 0),
    queryFn: () => obtenerPedido(id ?? 0),
    enabled: id !== null,
  })
}
