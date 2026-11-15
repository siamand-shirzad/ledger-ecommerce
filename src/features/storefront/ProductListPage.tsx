import { useQuery } from '@tanstack/react-query'
import { listProducts } from '@/api/products'
import { extractErrorMessage } from '@/api/client'
import { Alert, PageHeader, Spinner } from '@/components/ui'
import ProductCard from './ProductCard'

export default function ProductListPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['products'], queryFn: listProducts })

  return (
    <div>
      <PageHeader eyebrow="Catalog" title="Everything in stock" />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {error && <Alert>{extractErrorMessage(error, 'Could not load products.')}</Alert>}

      {data && Object.keys(data).length === 0 && (
        <p className="text-(--color-ink-soft)">No products yet — check back soon.</p>
      )}

      {data &&
        Object.entries(data).map(([group, products]) => (
          <section key={group} className="mb-10">
            <h2 className="font-display text-lg mb-3">{group}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
