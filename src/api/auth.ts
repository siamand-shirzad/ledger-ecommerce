import { apiClient } from './client'
import type { StringMap, User, UserLogin } from '@/types/api'

export async function signup(payload: User): Promise<StringMap> {
  const { data } = await apiClient.post<StringMap>('/signup', payload)
  return data
}

export async function login(payload: UserLogin): Promise<StringMap> {
  const { data } = await apiClient.post<StringMap>('/login', payload)
  return data
}

export async function logout(): Promise<StringMap> {
  const { data } = await apiClient.delete<StringMap>('/users/logout')
  return data
}
