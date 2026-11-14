import { flexRender, type Table } from '@tanstack/react-table'
import { Paginacion } from './Paginacion'

interface TablaDatosProps<T> {
  table: Table<T>
  mensajeVacio?: string
}

/** Renderiza cualquier tabla de TanStack Table con encabezados ordenables y paginación. */
export function TablaDatos<T>({ table, mensajeVacio = 'No hay registros' }: TablaDatosProps<T>) {
  const filas = table.getRowModel().rows
  const columnas = table.getAllLeafColumns().length

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-cafe/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-crema-oscuro/60 text-xs uppercase tracking-wide text-cafe-suave">
            {table.getHeaderGroups().map((grupo) => (
              <tr key={grupo.id}>
                {grupo.headers.map((header) => {
                  const ordenable = header.column.getCanSort()
                  const orden = header.column.getIsSorted()
                  return (
                    <th key={header.id} className="px-4 py-3 font-semibold whitespace-nowrap">
                      {header.isPlaceholder ? null : ordenable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 uppercase hover:text-cafe"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span aria-hidden="true">{orden === 'asc' ? '▲' : orden === 'desc' ? '▼' : '↕'}</span>
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-cafe/10">
            {filas.length === 0 ? (
              <tr>
                <td colSpan={columnas} className="px-4 py-10 text-center text-cafe-suave">
                  {mensajeVacio}
                </td>
              </tr>
            ) : (
              filas.map((fila) => (
                <tr key={fila.id} className="hover:bg-crema/60">
                  {fila.getVisibleCells().map((celda) => (
                    <td key={celda.id} className="px-4 py-3 align-middle">
                      {flexRender(celda.column.columnDef.cell, celda.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Paginacion
        pagina={table.getState().pagination.pageIndex}
        totalPaginas={table.getPageCount()}
        onCambiar={(pagina) => table.setPageIndex(pagina)}
      />
    </div>
  )
}
