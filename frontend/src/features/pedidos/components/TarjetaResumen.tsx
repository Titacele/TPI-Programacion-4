import { Card } from '../../../shared/ui/Card'

interface TarjetaResumenProps {
  titulo: string
  valor: string
  icono: string
  acento?: 'tomate' | 'mostaza' | 'oliva' | 'cafe' | 'sky'
}

const acentos: Record<NonNullable<TarjetaResumenProps['acento']>, string> = {
  tomate: 'bg-tomate/10',
  mostaza: 'bg-mostaza/20',
  oliva: 'bg-oliva/15',
  cafe: 'bg-cafe/10',
  sky: 'bg-sky-100',
}

export function TarjetaResumen({ titulo, valor, icono, acento = 'cafe' }: TarjetaResumenProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl text-2xl ${acentos[acento]}`} aria-hidden="true">
        {icono}
      </span>
      <div>
        <p className="text-sm text-cafe-suave">{titulo}</p>
        <p className="font-display text-3xl">{valor}</p>
      </div>
    </Card>
  )
}
