import { api } from '../../../shared/api/axiosInstance'
import type { MensajeResponse, UserCreate, UserPublic } from '../types/auth.types'

/** Login con formulario OAuth2: el backend responde con la cookie HttpOnly. */
export async function login(username: string, password: string): Promise<MensajeResponse> {
  const form = new URLSearchParams({ username, password })
  const { data } = await api.post<MensajeResponse>('/auth/token', form)
  return data
}

export async function register(datos: UserCreate): Promise<UserPublic> {
  const { data } = await api.post<UserPublic>('/auth/register', datos)
  return data
}

export async function logout(): Promise<MensajeResponse> {
  const { data } = await api.post<MensajeResponse>('/auth/logout')
  return data
}

export async function obtenerUsuarioActual(): Promise<UserPublic> {
  const { data } = await api.get<UserPublic>('/auth/me')
  return data
}
