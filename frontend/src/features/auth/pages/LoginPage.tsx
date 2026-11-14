import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../../shared/api/handleApiError'
import { Alerta } from '../../../shared/components/Alerta'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { Input } from '../../../shared/ui/Input'
import { primerError } from '../../../shared/utils/form'
import { useAuthStore } from '../../../store/authStore'

interface EstadoNavegacion {
  desde?: string
  registrado?: boolean
}

export function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const estado = (location.state ?? {}) as EstadoNavegacion
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { username: '', password: '' },
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const logueado = await login(value.username.trim(), value.password)
        const destino = estado.desde ?? (logueado.role === 'admin' ? '/admin/resumen' : '/')
        navigate(destino, { replace: true })
      } catch (e) {
        setError(handleApiError(e))
      }
    },
  })

  if (usuario) return <Navigate to="/" replace />

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8">
        <h1 className="font-display text-4xl">Ingresar</h1>
        <p className="mt-1 mb-6 text-cafe-suave">Entrá para hacer tu pedido.</p>

        {estado.registrado && (
          <div className="mb-4">
            <Alerta tipo="exito" mensaje="Cuenta creada. Ya podés ingresar." />
          </div>
        )}

        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => (value.trim() === '' ? 'Ingresá tu usuario' : undefined),
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Usuario"
                autoComplete="username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => (value === '' ? 'Ingresá tu contraseña' : undefined),
            }}
          >
            {(field) => (
              <Input
                id={field.name}
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={field.state.meta.isTouched ? primerError(field.state.meta.errors) : undefined}
              />
            )}
          </form.Field>

          {error && <Alerta mensaje={error} />}

          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([puedeEnviar, enviando]) => (
              <Button type="submit" className="w-full" disabled={!puedeEnviar} cargando={enviando}>
                Ingresar
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-cafe-suave">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold text-tomate hover:underline">
            Registrate
          </Link>
        </p>
      </Card>
    </div>
  )
}
