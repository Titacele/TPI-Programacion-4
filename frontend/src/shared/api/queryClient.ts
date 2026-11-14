import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

/** Instancia única de TanStack Query. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // No reintentar errores 4xx (404, 403...): volver a pedir no los arregla.
      retry: (intentos, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status !== undefined && status >= 400 && status < 500) return false
        return intentos < 2
      },
    },
  },
})
