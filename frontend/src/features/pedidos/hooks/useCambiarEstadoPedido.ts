import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cambiarEstadoPedido } from '../api/pedidos.api'
import type { EstadoPedido } from '../types/pedido.types'
import { pedidosKeys } from './pedidosKeys'

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, { estado }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.todos })
      // Cancelar restituye stock.
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
