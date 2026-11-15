import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeJwtPayload } from '@/lib/jwt'
import type { UserRole } from '@/types/api'

interface JwtClaims {
  role?: string
  isAdmin?: boolean
  admin?: boolean
  'E-mail'?: string
  email?: string
  name?: string
  [key: string]: unknown
}

interface AuthState {
  token: string | null
  role: UserRole
  email: string | null
  name: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

/**
 * The swagger doc doesn't spell out the login response shape beyond
 * `{ [key: string]: string }`, so we read the role off the JWT claims.
 * If your backend's token doesn't carry a role claim, adjust
 * `deriveRole` below to match whatever the login response actually sends
 * (e.g. a top-level `role` field in the response body instead).
 */
function deriveRole(claims: JwtClaims | null): UserRole {
  if (!claims) return 'user'
  if (claims.role === 'admin' || claims.isAdmin || claims.admin) return 'admin'
  return 'user'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: 'user',
      email: null,
      name: null,
      isAuthenticated: false,
      login: (token: string) => {
        const claims = decodeJwtPayload<JwtClaims>(token)
        set({
          token,
          role: deriveRole(claims),
          email: claims?.['E-mail'] ?? claims?.email ?? null,
          name: claims?.name ?? null,
          isAuthenticated: true,
        })
      },
      logout: () => set({ token: null, role: 'user', email: null, name: null, isAuthenticated: false }),
    }),
    { name: 'ecommerce-auth' }
  )
)
