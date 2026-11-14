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
import { formatearFecha } from '../../../shared/utils/formato'
import { useAuthStore } from '../../../store/authStore'
import type { UserPublic } from '../../auth/types/auth.types'
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from '../hooks/useUsuarios'

const columnHelper = createColumnHelper<UserPublic>()

export function AdminUsuariosPage() {
  const usuarioSesion = useAuthStore((s) => s.usuario)
  const { data: usuarios = [], isLoading, isError, error, refetch } = useUsuarios()
  const activar = useActivarUsuario()
  const desactivar = useDesactivarUsuario()
  const [sorting, setSorting] = useState<SortingState>([])

  const idSesion = usuarioSesion?.id
  // mutate es estable entre renders: se puede usar como dependencia del useMemo.
  const activarUsuario = activar.mutate
  const desactivarUsuario = desactivar.mutate
  const idEnCurso = activar.isPending ? activar.variables : desactivar.isPending ? desactivar.variables : undefined

  const columnas = useMemo(
    () => [
      columnHelper.accessor('username', {
        header: 'Usuario',
        cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor('full_name', { header: 'Nombre' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('role', {
        header: 'Rol',
        cell: (info) =>
          info.getValue() === 'admin' ? (
            <span className="rounded-full bg-cafe px-2.5 py-0.5 text-xs font-semibold text-crema">admin</span>
          ) : (
            <span className="rounded-full bg-crema-oscuro px-2.5 py-0.5 text-xs font-semibold">user</span>
          ),
      }),
      columnHelper.accessor('disabled', {
        header: 'Estado',
        cell: (info) =>
          info.getValue() ? (
            <span className="font-semibold text-tomate">Inactivo</span>
          ) : (
            <span className="font-semibold text-oliva">Activo</span>
          ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Alta',
        cell: (info) => <span className="text-cafe-suave">{formatearFecha(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const u = row.original
          if (u.id === idSesion) return <span className="text-xs text-cafe-suave">(vos)</span>
          return u.disabled ? (
            <Button tamano="sm" variante="secundario" cargando={idEnCurso === u.id} onClick={() => activarUsuario(u.id)}>
              Activar
            </Button>
          ) : (
            <Button tamano="sm" variante="peligro" cargando={idEnCurso === u.id} onClick={() => desactivarUsuario(u.id)}>
              Desactivar
            </Button>
          )
        },
      }),
    ],
    [idSesion, idEnCurso, activarUsuario, desactivarUsuario],
  )

  const table = useReactTable({
    data: usuarios,
    columns: columnas,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const errorAccion = activar.error ?? desactivar.error

  return (
    <section>
      <EncabezadoPagina titulo="Usuarios" subtitulo="Activá o desactivá cuentas. No podés desactivar tu propia cuenta." />

      {errorAccion && (
        <div className="mb-4">
          <Alerta mensaje={handleApiError(errorAccion)} />
        </div>
      )}

      {isLoading ? (
        <SkeletonFilas />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : (
        <TablaDatos table={table} mensajeVacio="No hay usuarios" />
      )}
    </section>
  )
}
