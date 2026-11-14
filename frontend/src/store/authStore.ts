import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import * as authApi from '../features/auth/api/auth.api'
import type { UserPublic } from '../features/auth/types/auth.types'

interface AuthState {
  usuario: UserPublic | null
  /** true mientras checkSession confirma la sesión con el backend. */
  cargando: boolean
  login: (username: string, password: string) => Promise<UserPublic>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await authApi.login(username, password) // el backend deja la cookie
        const usuario = await authApi.obtenerUsuarioActual()
        set({ usuario })
        return usuario
      },

      logout: async () => {
        try {
          await authApi.logout()
        } finally {
          set({ usuario: null })
        }
      },

      checkSession: async () => {
        set({ cargando: true })
        try {
          const usuario = await authApi.obtenerUsuarioActual()
          set({ usuario, cargando: false })
        } catch {
          set({ usuario: null, cargando: false })
        }
      },

      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: 'food-store-auth',
      storage: createJSONStorage(() => localStorage),
      // Solo se persisten los datos del usuario: el token vive en la cookie HttpOnly.
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
