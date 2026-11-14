import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelarPedido } from '../api/pedidos.api'
import { pedidosKeys } from './pedidosKeys'

export function useCancelarPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelarPedido(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pedidosKeys.todos })
      void queryClient.invalidateQueries({ queryKey: ['productos'] })
    },
  })
}
