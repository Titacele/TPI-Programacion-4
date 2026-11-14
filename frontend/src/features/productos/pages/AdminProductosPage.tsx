import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/components/Alerta'
import { EstadoError } from '../../../shared/components/EstadoError'
import { SkeletonFilas } from '../../../shared/components/Skeleton'
import { TablaDatos } from '../../../shared/components/TablaDatos'
import { EncabezadoPagina } from '../../../shared/layout/EncabezadoPagina'
import { Button } from '../../../shared/ui/Button'
import { Modal } from '../../../shared/ui/Modal'
import { formatearPrecio } from '../../../shared/utils/formato'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ProductoForm } from '../components/ProductoForm'
import { StockForm } from '../components/StockForm'
import {
  useActualizarProducto,
  useActualizarStock,
  useCrearProducto,
  useEliminarProducto,
  useProductos,
} from '../hooks/useProductos'
import type { Producto, ProductoCreate } from '../types/producto.types'

type ModoModal =
  | { tipo: 'crear' }
  | { tipo: 'editar'; producto: Producto }
  | { tipo: 'stock'; producto: Producto }
  | { tipo: 'eliminar'; producto: Producto }

const columnHelper = createColumnHelper<Producto>()

/** El panel trae hasta 100 productos y pagina del lado del cliente con TanStack Table. */
const FILTROS_PANEL = { skip: 0, limit: 100 }

export function AdminProductosPage() {
  const { data, isLoading, isError, error, refetch } = useProductos(FILTROS_PANEL)
  const { data: categorias = [] } = useCategorias()
  const crear = useCrearProducto()
  const actualizar = useActualizarProducto()
  const stock = useActualizarStock()
  const eliminar = useEliminarProducto()

  const [modal, setModal] = useState<ModoModal | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtroTexto, setFiltroTexto] = useState('')

  function cerrarModal() {
    setModal(null)
    crear.reset()
    actualizar.reset()
    stock.reset()
    eliminar.reset()
  }

  function guardar(datos: ProductoCreate) {
    if (modal?.tipo === 'editar') {
      actualizar.mutate({ id: modal.producto.id, datos }, { onSuccess: cerrarModal })
    } else {
      crear.mutate(datos, { onSuccess: cerrarModal })
    }
  }

  const columnas = useMemo(
    () => [
      columnHelper.accessor('nombre', {
        header: 'Producto',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor((p) => p.categoria.nombre, { id: 'categoria', header: 'Categoría' }),
      columnHelper.accessor('precio_base', {
        header: 'Precio',
        cell: (info) => formatearPrecio(info.getValue()),
      }),
      columnHelper.accessor('stock', {
        header: 'Stock',
        cell: (info) => (
          <span className={info.getValue() <= 5 ? 'font-semibold text-tomate' : ''}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('disponible', {
        header: 'Disponible',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-semibold text-oliva">Sí</span>
          ) : (
            <span className="font-semibold text-tomate">No</span>
          ),
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button variante="secundario" tamano="sm" onClick={() => setModal({ tipo: 'editar', producto: row.original })}>
              Editar
            </Button>
            <Button variante="secundario" tamano="sm" onClick={() => setModal({ tipo: 'stock', producto: row.original })}>
              Stock
            </Button>
            <Button variante="peligro" tamano="sm" onClick={() => setModal({ tipo: 'eliminar', producto: row.original })}>
              Eliminar
            </Button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: data?.items ?? [],
    columns: columnas,
    state: { sorting, globalFilter: filtroTexto },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltroTexto,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const errorGuardado = crear.error ?? actualizar.error
  const formAbierto = modal?.tipo === 'crear' || modal?.tipo === 'editar'

  return (
    <section>
      <EncabezadoPagina
        titulo="Productos"
        subtitulo="Alta, edición, stock, disponibilidad y baja lógica."
        acciones={<Button onClick={() => setModal({ tipo: 'crear' })}>+ Nuevo producto</Button>}
      />

      <input
        type="search"
        value={filtroTexto}
        onChange={(e) => setFiltroTexto(e.target.value)}
        placeholder="Filtrar en la tabla…"
        aria-label="Filtrar productos"
        className="mb-4 w-full max-w-sm rounded-lg border border-cafe/20 bg-white px-3 py-2 focus:outline-2 focus:outline-mostaza"
      />

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos table={table} mensajeVacio="No hay productos" />
      )}

      <Modal
        abierto={formAbierto}
        titulo={modal?.tipo === 'editar' ? 'Editar producto' : 'Nuevo producto'}
        onCerrar={cerrarModal}
        ancho="lg"
      >
        {errorGuardado && (
          <div className="mb-4">
            <Alerta mensaje={handleApiError(errorGuardado)} />
          </div>
        )}
        {formAbierto && (
          <ProductoForm
            key={modal.tipo === 'editar' ? modal.producto.id : 'nuevo'}
            producto={modal.tipo === 'editar' ? modal.producto : undefined}
            categorias={categorias}
            enviando={crear.isPending || actualizar.isPending}
            onEnviar={guardar}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>

      <Modal abierto={modal?.tipo === 'stock'} titulo="Stock y disponibilidad" onCerrar={cerrarModal}>
        {stock.isError && (
          <div className="mb-4">
            <Alerta mensaje={handleApiError(stock.error)} />
          </div>
        )}
        {modal?.tipo === 'stock' && (
          <StockForm
            key={modal.producto.id}
            producto={modal.producto}
            enviando={stock.isPending}
            onEnviar={(datos) => stock.mutate({ id: modal.producto.id, datos }, { onSuccess: cerrarModal })}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>

      <Modal abierto={modal?.tipo === 'eliminar'} titulo="Eliminar producto" onCerrar={cerrarModal}>
        {modal?.tipo === 'eliminar' && (
          <div className="space-y-4">
            <p>
              ¿Dar de baja <strong>{modal.producto.nombre}</strong>? Deja de mostrarse en el catálogo; los pedidos
              anteriores no se modifican.
            </p>
            {eliminar.isError && <Alerta mensaje={handleApiError(eliminar.error)} />}
            <div className="flex justify-end gap-2">
              <Button variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button
                cargando={eliminar.isPending}
                onClick={() => eliminar.mutate(modal.producto.id, { onSuccess: cerrarModal })}
              >
                Dar de baja
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
