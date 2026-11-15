import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '@/api/products'
import { extractErrorMessage } from '@/api/client'
import { Alert, PageHeader, Spinner } from '@/components/ui'

export default function SearchPage() {
  const { searchInput } = useParams<{ searchInput: string }>()
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchInput],
    queryFn: () => searchProducts(searchInput ?? ''),
    enabled: !!searchInput,
  })

  return (
    <div>
      <PageHeader eyebrow="Search" title={`Results for “${searchInput}”`} />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {error && <Alert>{extractErrorMessage(error, 'Search failed.')}</Alert>}

      {/* The API's response shape for search is a loose object (additionalProperties: true),
          so we render it generically here — tighten this once the real shape is confirmed. */}
      {data && (
        <pre className="stub p-4 text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}
