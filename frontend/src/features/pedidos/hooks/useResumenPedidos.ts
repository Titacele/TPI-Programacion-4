import { useQuery } from '@tanstack/react-query'
import { obtenerResumen } from '../api/pedidos.api'
import { pedidosKeys } from './pedidosKeys'

export function useResumenPedidos() {
  return useQuery({ queryKey: pedidosKeys.resumen, queryFn: obtenerResumen })
}
