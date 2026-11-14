/** Devuelve el primer mensaje de error de un campo de TanStack Form, si lo hay. */
export function primerError(errores: readonly unknown[]): string | undefined {
  const mensaje = errores.find((e): e is string => typeof e === 'string' && e.length > 0)
  return mensaje
}
