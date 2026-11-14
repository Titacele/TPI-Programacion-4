import { useState } from 'react'
import { handleApiError } from '../../../shared/api/handleApiError'
import { EstadoError } from '../../../shared/components/EstadoError'
import { EstadoVacio } from '../../../shared/components/EstadoVacio'
import { Paginacion } from '../../../shared/components/Paginacion'
import { SkeletonTarjetas } from '../../../shared/components/Skeleton'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { FiltrosCatalogo } from '../components/FiltrosCatalogo'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const POR_PAGINA = 8

export function CatalogoPage() {
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined)

  const { data: categorias = [] } = useCategorias()
  const { data, isLoading, isError, error, refetch, isFetching } = useProductos({
    skip: pagina * POR_PAGINA, // paginación del lado del servidor
    limit: POR_PAGINA,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  })

  const totalPaginas = data ? Math.ceil(data.total / POR_PAGINA) : 0

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-tomate px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-semibold tracking-widest text-mostaza uppercase">Abierto todos los días</p>
        <h1 className="mt-2 font-display text-5xl leading-tight">¿Qué pedimos hoy?</h1>
        <p className="mt-2 max-w-lg text-white/85">
          Elegí del menú, armá tu carrito y te lo llevamos a la puerta.
        </p>
      </section>

      <FiltrosCatalogo
        categorias={categorias}
        categoriaId={categoriaId}
        onBuscar={(texto) => {
          setBusqueda(texto)
          setPagina(0)
        }}
        onCategoria={(id) => {
          setCategoriaId(id)
          setPagina(0)
        }}
      />

      {isLoading ? (
        <SkeletonTarjetas cantidad={POR_PAGINA} />
      ) : isError ? (
        <EstadoError mensaje={handleApiError(error)} onReintentar={() => void refetch()} />
      ) : !data || data.items.length === 0 ? (
        <EstadoVacio
          titulo="No encontramos productos"
          mensaje={busqueda ? `No hay resultados para «${busqueda}».` : 'Probá con otra categoría.'}
        />
      ) : (
        <>
          <p className="text-sm text-cafe-suave">
            {data.total} {data.total === 1 ? 'producto' : 'productos'}
          </p>
          <div
            className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-4 ${isFetching ? 'opacity-60' : ''}`}
          >
            {data.items.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
        </>
      )}
    </div>
  )
}
