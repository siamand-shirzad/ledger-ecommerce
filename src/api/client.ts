import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'

/**
 * Base URL comes from an env var so it's easy to point at local/staging/prod
 * backends without touching code. Set VITE_API_BASE_URL in a .env file.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the bearer token to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralized handling for expired/invalid sessions.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

/** Pulls the `{ [key]: string }` style error message the API returns. */
export function extractErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, string> | undefined
    if (data) {
      const first = Object.values(data)[0]
      if (first) return first
    }
    if (error.message) return error.message
  }
  return fallback
}
