import axios, { AxiosError } from 'axios'
import { useAuthStore } from '../../store/authStore'

export const CUENTA_DESACTIVADA = 'Cuenta de usuario desactivada'

/** Rutas donde un 401 es una respuesta esperada y no significa "sesión vencida". */
const RUTAS_SIN_INTERCEPTOR = ['/auth/token', '/auth/me']

/**
 * Cliente HTTP único de la aplicación.
 * withCredentials: true hace que el navegador adjunte la cookie HttpOnly en cada
 * petición; el frontend nunca lee ni guarda el token.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const detail = error.response?.data?.detail

    const sesionVencida = status === 401 && !RUTAS_SIN_INTERCEPTOR.some((ruta) => url.endsWith(ruta))
    const cuentaDesactivada = status === 400 && detail === CUENTA_DESACTIVADA

    if (sesionVencida || cuentaDesactivada) {
      // Al quedar sin usuario, ProtectedRoute redirige a /login.
      useAuthStore.getState().limpiarSesion()
    }
    return Promise.reject(error)
  },
)
