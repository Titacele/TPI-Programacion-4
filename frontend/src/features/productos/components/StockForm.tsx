import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { primerError } from '../../../shared/utils/form'
import type { Producto, ProductoStockUpdate } from '../types/producto.types'

interface StockFormProps {
  producto: Producto
  enviando: boolean
  onEnviar: (datos: ProductoStockUpdate) => void
  onCancelar: () => void
}

/** Formulario corto para PATCH /productos/{id}/stock. */
export function StockForm({ producto, enviando, onEnviar, onCancelar }: StockFormProps) {
  const form = useForm({
    defaultValues: { stock: String(producto.stock), disponible: producto.disponible },
    onSubmit: ({ value }) => onEnviar({ stock: Number(value.stock), disponible: value.disponible }),
  })

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <p className="text-cafe-suave">
        Producto: <strong className="text-cafe">{producto.nombre}</strong>
      </p>

      <form.Field
        name="stock"
        validators={{
          onChange: ({ value }) => {
            const n = Number(value)
            if (value.trim() === '' || Number.isNaN(n)) return 'Ingresá un número'
            if (n < 0 || !Number.isInteger(n)) return 'Debe ser un entero mayor o igual a 0'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="stock-cantidad"
            label="Stock"
            type="number"
            min={0}
            step={1}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={primerError(field.state.meta.errors)}
          />
        )}
      </form.Field>

      <form.Field name="disponible">
        {(field) => (
          <label className="flex items-center gap-2 text-sm font-semibold">
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

      <div className="flex justify-end gap-2 pt-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(puedeEnviar) => (
            <Button type="submit" disabled={!puedeEnviar} cargando={enviando}>
              Actualizar stock
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
