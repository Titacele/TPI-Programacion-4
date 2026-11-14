import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { Skeleton } from '../../../shared/components/Skeleton'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { formatearPrecio } from '../../../shared/utils/formato'
import { TarjetaResumen } from '../components/TarjetaResumen'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

export function AdminResumenPage() {
  const { data, isLoading, isError, error, refetch } = useResumenPedidos()

  return (
    <section>
      <EncabezadoPagina titulo="Resumen" subtitulo="Indicadores de los pedidos." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : isError || !data ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TarjetaResumen titulo="Pendientes" valor={String(data.pendientes)} icono="⏳" acento="mostaza" />
          <TarjetaResumen titulo="En preparación" valor={String(data.en_preparacion)} icono="👩‍🍳" acento="sky" />
          <TarjetaResumen titulo="Entregados" valor={String(data.entregados)} icono="✅" acento="oliva" />
          <TarjetaResumen titulo="Cancelados" valor={String(data.cancelados)} icono="✖️" acento="tomate" />
          <TarjetaResumen titulo="Pedidos de hoy" valor={String(data.pedidos_hoy)} icono="📅" acento="cafe" />
          <TarjetaResumen
            titulo="Ingresos (entregados)"
            valor={formatearPrecio(data.ingresos_entregados)}
            icono="💰"
            acento="oliva"
          />
        </div>
      )}
    </section>
  )
}
