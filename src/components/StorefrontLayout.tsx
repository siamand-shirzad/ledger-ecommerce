import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useCart } from '@/features/cart/useCart'
import { logout as logoutApi } from '@/api/auth'

export default function StorefrontLayout() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { isAuthenticated, role, name, email, logout } = useAuthStore()
  const { data: cart } = useCart()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (query.trim()) navigate(`/search/${encodeURIComponent(query.trim())}`)
  }

  async function handleLogout() {
    try {
      await logoutApi()
    } catch {
      // token may already be invalid server-side — still clear locally
    }
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-(--color-line) bg-(--color-surface) sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-display text-xl tracking-tight shrink-0">
            The Ledger<span className="text-(--color-accent)">.</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, tags…"
              className="w-full rounded-full border border-(--color-line) px-4 py-1.5 text-sm bg-(--color-bg) focus:bg-(--color-surface) outline-none"
            />
          </form>

          <nav className="flex items-center gap-4 text-sm ml-auto">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'font-medium' : 'text-(--color-ink-soft)')}>
              Catalog
            </NavLink>
            {role === 'admin' && (
              <NavLink to="/admin" className="text-(--color-ink-soft) hover:text-(--color-ink)">
                Admin
              </NavLink>
            )}
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-(--color-ink-soft) hover:text-(--color-ink)">
                  Cart
                  {!!cart?.totalQuantity && (
                    <span className="absolute -top-2 -right-3 bg-(--color-accent) text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center font-mono-num">
                      {cart.totalQuantity}
                    </span>
                  )}
                </Link>
                <span className="text-(--color-ink-faint) hidden sm:inline">{name || email}</span>
                <button onClick={handleLogout} className="text-(--color-ink-soft) hover:text-(--color-danger)">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-(--color-ink-soft) hover:text-(--color-ink)">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-(--color-ink) text-white rounded-full px-3 py-1.5 hover:bg-(--color-accent-ink)"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-(--color-line) py-6 text-center text-xs text-(--color-ink-faint)">
        Scaffold storefront — wired to the E-Commerce API.
      </footer>
    </div>
  )
}
