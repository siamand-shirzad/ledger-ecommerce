import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/ui'

const cards = [
  { to: '/admin/categories', title: 'Categories', desc: 'Group products into categories.' },
  { to: '/admin/tags', title: 'Tags', desc: 'Label products for filtering and search.' },
  { to: '/admin/products', title: 'Products', desc: 'Create, edit, and remove catalog items.' },
  { to: '/admin/filters', title: 'Filters', desc: 'Save a category or tag as a reusable filter.' },
]

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader eyebrow="Admin" title="Manage the catalog" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="stub p-5 hover:border-(--color-accent) transition-colors">
            <div className="font-medium mb-1">{c.title}</div>
            <div className="text-sm text-(--color-ink-soft)">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
