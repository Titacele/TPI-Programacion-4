import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input, Select, Textarea } from '../../../shared/ui/Input'
import { primerError } from '../../../shared/utils/form'
import type { Categoria } from '../../categorias/types/categoria.types'
import type { Producto, ProductoCreate } from '../types/producto.types'

interface ProductoFormProps {
  /** Si se pasa, el formulario edita ese producto; si no, crea uno nuevo. */
  producto?: Producto
  categorias: Categoria[]
  enviando: boolean
  onEnviar: (datos: ProductoCreate) => void
  onCancelar: () => void
}

function validarNumero(valor: string, entero: boolean): string | undefined {
  if (valor.trim() === '') return 'Campo obligatorio'
  const n = Number(valor)
  if (Number.isNaN(n)) return 'Debe ser un número'
  if (n < 0) return 'No puede ser negativo'
  if (entero && !Number.isInteger(n)) return 'Debe ser un número entero'
  return undefined
}

function vacioANull(valor: string): string | null {
  const v = valor.trim()
  return v === '' ? null : v
}

export function ProductoForm({ producto, categorias, enviando, onEnviar, onCancelar }: ProductoFormProps) {
  const form = useForm({
    // Los números se editan como texto y se convierten al enviar.
    defaultValues: {
      nombre: producto?.nombre ?? '',
      descripcion: producto?.descripcion ?? '',
      precio_base: producto ? String(producto.precio_base) : '',
      stock: producto ? String(producto.stock) : '0',
      imagen_url: producto?.imagen_url ?? '',
      categoria_id: producto ? String(producto.categoria_id) : '',
      disponible: producto?.disponible ?? true,
    },
    onSubmit: ({ value }) => {
      onEnviar({
        nombre: value.nombre.trim(),
        descripcion: vacioANull(value.descripcion),
        precio_base: Number(value.precio_base),
        stock: Number(value.stock),
        imagen_url: vacioANull(value.imagen_url),
        categoria_id: Number(value.categoria_id),
        disponible: value.disponible,
      })
    },
  })

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <div className="sm:col-span-2">
        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              const v = value.trim()
              if (v.length < 2) return 'Mínimo 2 caracteres'
              if (v.length > 150) return 'Máximo 150 caracteres'
              return undefined
            },
          }}
        >
          {(field) => (
            <Input
              id="producto-nombre"
              label="Nombre"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
            />
          )}
        </form.Field>
      </div>

      <form.Field name="precio_base" validators={{ onChange: ({ value }) => validarNumero(value, false) }}>
        {(field) => (
          <Input
            id="producto-precio"
            label="Precio"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>

      <form.Field name="stock" validators={{ onChange: ({ value }) => validarNumero(value, true) }}>
        {(field) => (
          <Input
            id="producto-stock"
            label="Stock"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>

      <form.Field
        name="categoria_id"
        validators={{ onChange: ({ value }) => (value === '' ? 'Elegí una categoría' : undefined) }}
      >
        {(field) => (
          <Select
            id="producto-categoria"
            label="Categoría"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          >
            <option value="">Seleccionar…</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={field.state.value}
              onChange={(e) => field.handleChange(e.target.checked)}
              className="size-4 accent-tomate"
            />
            Disponible para la venta
          </label>
        )}
      </form.Field>

      <div className="sm:col-span-2">
        <form.Field
          name="imagen_url"
          validators={{
            onChange: ({ value }) =>
              value.trim() !== '' && !/^https?:\/\//.test(value.trim())
                ? 'Debe empezar con http:// o https://'
                : undefined,
          }}
        >
          {(field) => (
            <Input
              id="producto-imagen"
              label="URL de la imagen (opcional)"
              type="url"
              placeholder="https://…"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
            />
          )}
        </form.Field>
      </div>

      <div className="sm:col-span-2">
        <form.Field name="descripcion">
          {(field) => (
            <Textarea
              id="producto-descripcion"
              label="Descripción (opcional)"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        </form.Field>
      </div>

      <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(puedeEnviar) => (
            <Button type="submit" disabled={!puedeEnviar} cargando={enviando}>
              {producto ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
