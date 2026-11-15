import { Link } from 'react-router-dom'
import type { ProductDetails } from '@/types/api'
import { formatMoney } from '@/lib/money'

export default function ProductCard({ product }: { product: ProductDetails }) {
  return (
    <Link to={`/products/${product.id}`} className="stub p-4 flex flex-col gap-2 hover:border-(--color-accent) transition-colors">
      <div className="text-xs uppercase tracking-wider text-(--color-ink-faint)">{product.categoryName}</div>
      <div className="font-medium leading-snug">{product.productName}</div>
      <div className="flex flex-wrap gap-1 mt-auto pt-1">
        {product.tags?.map((t) => (
          <span key={t.id} className="text-[10px] px-2 py-0.5 rounded-full bg-(--color-accent-soft) text-(--color-accent-ink)">
            {t.tagName}
          </span>
        ))}
      </div>
      <div className="stub-divider pt-2 flex items-baseline justify-between">
        <span className="text-xs text-(--color-ink-faint)">SKU-{product.id}</span>
        <span className="font-mono-num text-lg">{formatMoney(product.price)}</span>
      </div>
    </Link>
  )
}
