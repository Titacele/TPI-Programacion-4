interface AlertaProps {
  tipo?: 'error' | 'exito'
  mensaje: string
}

/** Mensaje en línea para resultados de formularios y acciones. */
export function Alerta({ tipo = 'error', mensaje }: AlertaProps) {
  const estilo =
    tipo === 'error'
      ? 'border-tomate/30 bg-tomate/5 text-tomate-oscuro'
      : 'border-oliva/30 bg-oliva/10 text-oliva'
  return (
    <p role={tipo === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-3 py-2 text-sm ${estilo}`}>
      {mensaje}
    </p>
  )
}
