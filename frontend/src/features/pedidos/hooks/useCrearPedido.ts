import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearPedido } from '../api/pedidos.api'
import type { PedidoCreate } from '../types/pedido.types'
import { pedidosKeys } from './pedidosKeys'

export function useCrearPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (datos: PedidoCreate) => crearPedido(datos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.todos })
      // El pedido descontó stock: el catálogo tiene que refrescarse.
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
