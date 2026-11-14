import { useEffect } from 'react'
import { AppRouter } from './routes/AppRouter'
import { useAuthStore } from './store/authStore'

export function App() {
  const checkSession = useAuthStore((s) => s.checkSession)

  // Única llamada al servidor dentro de un useEffect: confirmar la sesión al montar.
  useEffect(() => {
    void checkSession()
  }, [checkSession])

  return <AppRouter />
}
