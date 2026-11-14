import { useCallback, useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/components/Alerta'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { SkeletonFilas } from '../../../shared/components/Skeleton'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { Modal } from '../../../shared/ui/Modal'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { TablaPedidos } from '../components/TablaPedidos'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedido, usePedidos } from '../hooks/usePedidos'
import { ESTADOS, type EstadoPedido } from '../types/pedido.types'

const POR_PAGINA = 10

const etiquetaFiltro: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendientes',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregados',
  CANCELADO: 'Cancelados',
}

export function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined)
  const [seleccionado, setSeleccionado] = useState<number | null>(null)

  const { data, isLoading, isError, error, refetch } = usePedidos({
    skip: pagina * POR_PAGINA,
    limit: POR_PAGINA,
    estado,
  })
  const detalle = usePedido(seleccionado)
  const cambiarEstado = useCambiarEstadoPedido()
  const mutarEstado = cambiarEstado.mutate

  const onCambiarEstado = useCallback(
    (id: number, nuevo: EstadoPedido) => mutarEstado({ id, estado: nuevo }),
    [mutarEstado],
  )

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  function filtrar(nuevo: EstadoPedido | undefined) {
    setEstado(nuevo)
    setPagina(0)
  }

  return (
    <section>
      <EncabezadoPagina titulo="Pedidos" subtitulo="Avanzá o cancelá pedidos según su estado." />

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        <BotonFiltro activo={estado === undefined} onClick={() => filtrar(undefined)}>
          Todos
        </BotonFiltro>
        {ESTADOS.map((e) => (
          <BotonFiltro key={e} activo={estado === e} onClick={() => filtrar(e)}>
            {etiquetaFiltro[e]}
          </BotonFiltro>
        ))}
      </div>

      {cambiarEstado.isError && (
        <div className="mb-4">
          <Alerta mensaje={handleApiError(cambiarEstado.error)} />
        </div>
      )}

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EstadoVacio titulo="No hay pedidos" mensaje={estado ? 'Ningún pedido en este estado.' : undefined} />
      ) : (
        <div className="space-y-4">
          <TablaPedidos
            pedidos={data.items}
            idEnCurso={cambiarEstado.isPending ? cambiarEstado.variables.id : undefined}
            onVer={setSeleccionado}
            onCambiarEstado={onCambiarEstado}
          />
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </div>
      )}

      <Modal
        abierto={seleccionado !== null}
        titulo={`Pedido #${seleccionado ?? ''}`}
        onCerrar={() => setSeleccionado(null)}
        ancho="lg"
      >
        {detalle.isLoading ? (
          <SkeletonFilas filas={3} />
        ) : detalle.isError ? (
          <EstadoError mensaje={handleApiError(detalle.error)} />
        ) : detalle.data ? (
          <PedidoDetalle pedido={detalle.data} />
        ) : null}
      </Modal>
    </section>
  )
}

interface BotonFiltroProps {
  activo: boolean
  onClick: () => void
  children: string
}

function BotonFiltro({ activo, onClick, children }: BotonFiltroProps) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
        activo ? 'bg-tomate text-white' : 'bg-white text-cafe ring-1 ring-cafe/15 hover:bg-crema-oscuro'
      }`}
    >
      {children}
    </button>
  )
}
