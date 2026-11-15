import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/tags', label: 'Tags' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/filters', label: 'Filters' },
]

export default function AdminLayout() {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-8">
      <aside>
        <div className="text-xs uppercase tracking-wider text-(--color-accent) mb-3">Admin</div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm ${
                  isActive ? 'bg-(--color-accent-soft) text-(--color-accent-ink) font-medium' : 'text-(--color-ink-soft) hover:bg-(--color-bg)'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
