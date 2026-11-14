import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/components/Alerta'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { SkeletonFilas } from '../../../shared/components/Skeleton'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Modal } from '../../../shared/ui/Modal'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedido, usePedidos } from '../hooks/usePedidos'

const POR_PAGINA = 10

export function MisPedidosPage() {
  const location = useLocation()
  const pedidoCreado = (location.state as { pedidoCreado?: number } | null)?.pedidoCreado

  const [pagina, setPagina] = useState(0)
  const [seleccionado, setSeleccionado] = useState<number | null>(null)

  const { data, isLoading, isError, error, refetch } = usePedidos({ skip: pagina * POR_PAGINA, limit: POR_PAGINA })
  const detalle = usePedido(seleccionado)
  const cancelar = useCancelarPedido()

  function cerrarDetalle() {
    setSeleccionado(null)
    cancelar.reset()
  }

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <>
      <EncabezadoPagina titulo="Mis pedidos" subtitulo="Seguí el estado de tus pedidos." />

      {pedidoCreado !== undefined && (
        <div className="mb-6">
          <Alerta tipo="exito" mensaje={`¡Listo! Tu pedido #${pedidoCreado} fue creado y está pendiente.`} />
        </div>
      )}

      {isLoading ? (
        <SkeletonFilas filas={4} />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no hiciste pedidos"
          accion={
            <Link to="/" className="rounded-lg bg-tomate px-4 py-2 font-semibold text-white hover:bg-tomate-oscuro">
              Ir al catálogo
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {data.items.map((pedido) => (
              <li key={pedido.id}>
                <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 p-5">
                  <div className="min-w-32">
                    <p className="font-display text-xl">Pedido #{pedido.id}</p>
                    <p className="text-sm text-cafe-suave">{formatearFecha(pedido.created_at)}</p>
                  </div>
                  <BadgeEstado estado={pedido.estado} />
                  <p className="flex-1 text-sm text-cafe-suave">
                    {pedido.items.length} {pedido.items.length === 1 ? 'producto' : 'productos'} ·{' '}
                    {pedido.direccion_entrega}
                  </p>
                  <p className="font-display text-2xl text-tomate">{formatearPrecio(pedido.total)}</p>
                  <Button variante="secundario" tamano="sm" onClick={() => setSeleccionado(pedido.id)}>
                    Ver detalle
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </div>
      )}

      <Modal
        abierto={seleccionado !== null}
        titulo={`Pedido #${seleccionado ?? ''}`}
        onCerrar={cerrarDetalle}
        ancho="lg"
      >
        {detalle.isLoading ? (
          <SkeletonFilas filas={3} />
        ) : detalle.isError ? (
          <EstadoError mensaje={handleApiError(detalle.error)} />
        ) : detalle.data ? (
          <div className="space-y-5">
            <PedidoDetalle pedido={detalle.data} />
            {cancelar.isError && <Alerta mensaje={handleApiError(cancelar.error)} />}
            {detalle.data.estado === 'PENDIENTE' && (
              <div className="flex justify-end">
                <Button
                  variante="peligro"
                  cargando={cancelar.isPending}
                  onClick={() => cancelar.mutate(detalle.data.id)}
                >
                  Cancelar pedido
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </>
  )
}
