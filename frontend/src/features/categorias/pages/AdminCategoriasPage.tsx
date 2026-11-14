import {
  createColumnHelper,
  getCoreRowModel,
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
import { CategoriaForm } from '../components/CategoriaForm'
import {
  useActualizarCategoria,
  useCategorias,
  useCrearCategoria,
  useEliminarCategoria,
} from '../hooks/useCategorias'
import type { Categoria, CategoriaCreate } from '../types/categoria.types'

type ModoModal = { tipo: 'crear' } | { tipo: 'editar'; categoria: Categoria } | { tipo: 'eliminar'; categoria: Categoria }

const columnHelper = createColumnHelper<Categoria>()

export function AdminCategoriasPage() {
  const { data: categorias = [], isLoading, isError, error, refetch } = useCategorias()
  const crear = useCrearCategoria()
  const actualizar = useActualizarCategoria()
  const eliminar = useEliminarCategoria()

  const [modal, setModal] = useState<ModoModal | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  function cerrarModal() {
    setModal(null)
    crear.reset()
    actualizar.reset()
    eliminar.reset()
  }

  function guardar(datos: CategoriaCreate) {
    if (modal?.tipo === 'editar') {
      actualizar.mutate({ id: modal.categoria.id, datos }, { onSuccess: cerrarModal })
    } else {
      crear.mutate(datos, { onSuccess: cerrarModal })
    }
  }

  const columnas = useMemo(
    () => [
      columnHelper.accessor('id', { header: 'ID' }),
      columnHelper.accessor('nombre', {
        header: 'Nombre',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor('descripcion', {
        header: 'Descripción',
        enableSorting: false,
        cell: (info) => <span className="text-cafe-suave">{info.getValue() ?? '—'}</span>,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variante="secundario"
              tamano="sm"
              onClick={() => setModal({ tipo: 'editar', categoria: row.original })}
            >
              Editar
            </Button>
            <Button
              variante="peligro"
              tamano="sm"
              onClick={() => setModal({ tipo: 'eliminar', categoria: row.original })}
            >
              Eliminar
            </Button>
          </div>
        ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: categorias,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const errorGuardado = crear.error ?? actualizar.error

  return (
    <section>
      <EncabezadoPagina
        titulo="Categorías"
        subtitulo="Alta, edición y baja lógica de categorías."
        acciones={<Button onClick={() => setModal({ tipo: 'crear' })}>+ Nueva categoría</Button>}
      />

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos table={table} mensajeVacio="Todavía no hay categorías" />
      )}

      <Modal
        abierto={modal?.tipo === 'crear' || modal?.tipo === 'editar'}
        titulo={modal?.tipo === 'editar' ? 'Editar categoría' : 'Nueva categoría'}
        onCerrar={cerrarModal}
      >
        {errorGuardado && (
          <div className="mb-4">
            <Alerta mensaje={handleApiError(errorGuardado)} />
          </div>
        )}
        {(modal?.tipo === 'crear' || modal?.tipo === 'editar') && (
          <CategoriaForm
            key={modal.tipo === 'editar' ? modal.categoria.id : 'nueva'}
            categoria={modal.tipo === 'editar' ? modal.categoria : undefined}
            enviando={crear.isPending || actualizar.isPending}
            onEnviar={guardar}
            onCancelar={cerrarModal}
          />
        )}
      </Modal>

      <Modal abierto={modal?.tipo === 'eliminar'} titulo="Eliminar categoría" onCerrar={cerrarModal}>
        {modal?.tipo === 'eliminar' && (
          <div className="space-y-4">
            <p>
              ¿Dar de baja <strong>{modal.categoria.nombre}</strong>? Deja de aparecer en el listado, pero el nombre
              sigue reservado y sus productos no se ocultan.
            </p>
            {eliminar.isError && <Alerta mensaje={handleApiError(eliminar.error)} />}
            <div className="flex justify-end gap-2">
              <Button variante="secundario" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button
                cargando={eliminar.isPending}
                onClick={() => eliminar.mutate(modal.categoria.id, { onSuccess: cerrarModal })}
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
