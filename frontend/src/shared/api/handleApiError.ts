import { isAxiosError } from 'axios'

interface ErrorValidacion {
  loc?: (string | number)[]
  msg: string
}

/** Convierte el error de una petición en un mensaje legible para mostrar en pantalla. */
export function handleApiError(error: unknown): string {
  if (!isAxiosError<{ detail?: string | ErrorValidacion[] }>(error)) {
    return 'Ocurrió un error inesperado'
  }
  if (!error.response) {
    return 'No se pudo conectar con el servidor. ¿Está levantado el backend?'
  }

  const detail = error.response.data?.detail
  if (typeof detail === 'string') {
    return detail
  }
  // 422: FastAPI devuelve una lista de errores de validación.
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((e) => {
        const campo = e.loc?.[e.loc.length - 1]
        return campo !== undefined ? `${campo}: ${e.msg}` : e.msg
      })
      .join(' · ')
  }
  return `Error ${error.response.status}`
}
