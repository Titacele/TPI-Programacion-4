import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input, Textarea } from '../../../shared/ui/Input'
import { primerError } from '../../../shared/utils/form'
import type { Categoria, CategoriaCreate } from '../types/categoria.types'

interface CategoriaFormProps {
  /** Si se pasa, el formulario edita esa categoría; si no, crea una nueva. */
  categoria?: Categoria
  enviando: boolean
  onEnviar: (datos: CategoriaCreate) => void
  onCancelar: () => void
}

export function CategoriaForm({ categoria, enviando, onEnviar, onCancelar }: CategoriaFormProps) {
  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? '',
      descripcion: categoria?.descripcion ?? '',
    },
    onSubmit: ({ value }) => {
      const descripcion = value.descripcion.trim()
      onEnviar({ nombre: value.nombre.trim(), descripcion: descripcion === '' ? null : descripcion })
    },
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
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) => {
            const v = value.trim()
            if (v.length < 2) return 'Mínimo 2 caracteres'
            if (v.length > 100) return 'Máximo 100 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="categoria-nombre"
            label="Nombre"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
          />
        )}
      </form.Field>

      <form.Field
        name="descripcion"
        validators={{
          onChange: ({ value }) => (value.length > 500 ? 'Máximo 500 caracteres' : undefined),
        }}
      >
        {(field) => (
          <Textarea
            id="categoria-descripcion"
            label="Descripción (opcional)"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={primerError(field.state.meta.errors)}
          />
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <form.Subscribe selector={(s) => s.canSubmit}>
          {(puedeEnviar) => (
            <Button type="submit" disabled={!puedeEnviar} cargando={enviando}>
              {categoria ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
