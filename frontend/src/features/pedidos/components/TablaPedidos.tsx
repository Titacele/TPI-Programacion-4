import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BadgeEstado } from '../../../shared/ui/BadgeEstado'
import { Button } from '../../../shared/ui/Button'
import { formatearFecha, formatearPrecio } from '../../../shared/utils/formato'
import { TRANSICIONES, type EstadoPedido, type Pedido } from '../types/pedido.types'

const textoAccion: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'A preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelar',
}

interface TablaPedidosProps {
  pedidos: Pedido[]
  /** id del pedido cuyo cambio de estado está en curso. */
  idEnCurso?: number
  onVer: (id: number) => void
  onCambiarEstado: (id: number, estado: EstadoPedido) => void
}

const columnHelper = createColumnHelper<Pedido>()

/** Tabla de pedidos del panel: los botones salen del mapa de transiciones. */
export function TablaPedidos({ pedidos, idEnCurso, onVer, onCambiarEstado }: TablaPedidosProps) {
  const columnas = useMemo(
    () => [
      columnHelper.accessor('id', { header: 'N°', cell: (info) => <span className="font-semibold">#{info.getValue()}</span> }),
      columnHelper.accessor('created_at', { header: 'Fecha', cell: (info) => formatearFecha(info.getValue()) }),
      columnHelper.accessor('usuario_id', { header: 'Cliente', cell: (info) => `Usuario ${info.getValue()}` }),
      columnHelper.accessor('items', {
        header: 'Ítems',
        cell: (info) => info.getValue().reduce((suma, linea) => suma + linea.cantidad, 0),
      }),
      columnHelper.accessor('total', { header: 'Total', cell: (info) => formatearPrecio(info.getValue()) }),
      columnHelper.accessor('estado', { header: 'Estado', cell: (info) => <BadgeEstado estado={info.getValue()} /> }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const pedido = row.original
          return (
            <div className="flex flex-wrap gap-2">
              <Button tamano="sm" variante="fantasma" onClick={() => onVer(pedido.id)}>
                Ver
              </Button>
              {TRANSICIONES[pedido.estado].map((destino) => (
                <Button
                  key={destino}
                  tamano="sm"
                  variante={destino === 'CANCELADO' ? 'peligro' : 'secundario'}
                  disabled={idEnCurso !== undefined}
                  cargando={idEnCurso === pedido.id}
                  onClick={() => onCambiarEstado(pedido.id, destino)}
                >
                  {textoAccion[destino]}
                </Button>
              ))}
            </div>
          )
        },
      }),
    ],
    [idEnCurso, onVer, onCambiarEstado],
  )

  const table = useReactTable({ data: pedidos, columns: columnas, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="overflow-x-auto rounded-2xl border border-cafe/10 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-crema-oscuro/60 text-xs uppercase tracking-wide text-cafe-suave">
          {table.getHeaderGroups().map((grupo) => (
            <tr key={grupo.id}>
              {grupo.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-cafe/10">
          {table.getRowModel().rows.map((fila) => (
            <tr key={fila.id} className="hover:bg-crema/60">
              {fila.getVisibleCells().map((celda) => (
                <td key={celda.id} className="px-4 py-3 whitespace-nowrap">
                  {flexRender(celda.column.columnDef.cell, celda.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
