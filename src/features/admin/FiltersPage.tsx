import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { adminFilterApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { Alert, Button, Field, Input, PageHeader, Spinner } from '@/components/ui'
import { formatMoney } from '@/lib/money'

export default function FiltersPage() {
  const [filterName, setFilterName] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [tagID, setTagID] = useState('')
  const [loadName, setLoadName] = useState('')
  const [activeLoad, setActiveLoad] = useState('')

  const createMut = useMutation({
    mutationFn: adminFilterApi.create,
    onSuccess: () => {
      setFilterName('')
      setCategoryID('')
      setTagID('')
    },
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-filter-load', activeLoad],
    queryFn: () => adminFilterApi.load(activeLoad),
    enabled: !!activeLoad,
  })

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!filterName.trim()) return
    createMut.mutate({
      filterName: filterName.trim(),
      categoryID: categoryID ? Number(categoryID) : undefined,
      tagID: tagID ? Number(tagID) : undefined,
    })
  }

  function handleLoad(e: FormEvent) {
    e.preventDefault()
    setActiveLoad(loadName.trim())
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Filters" />

      <div className="stub p-5 mb-6 max-w-md">
        <h2 className="text-sm font-medium mb-3">New saved filter</h2>
        <p className="text-xs text-(--color-ink-faint) mb-3">Set a category ID, a tag ID, or both.</p>
        <form onSubmit={handleCreate} className="space-y-3">
          <Field label="Filter name">
            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category ID">
              <Input type="number" value={categoryID} onChange={(e) => setCategoryID(e.target.value)} />
            </Field>
            <Field label="Tag ID">
              <Input type="number" value={tagID} onChange={(e) => setTagID(e.target.value)} />
            </Field>
          </div>
          <Button type="submit" disabled={createMut.isPending}>
            {createMut.isPending ? 'Saving…' : 'Save filter'}
          </Button>
        </form>
        {createMut.isError && <div className="mt-3"><Alert>{extractErrorMessage(createMut.error)}</Alert></div>}
        {createMut.isSuccess && <div className="mt-3"><Alert kind="success">Filter saved.</Alert></div>}
      </div>

      <div className="stub p-5 max-w-2xl">
        <h2 className="text-sm font-medium mb-3">Load products for a filter</h2>
        <form onSubmit={handleLoad} className="flex gap-2 mb-4">
          <Input value={loadName} onChange={(e) => setLoadName(e.target.value)} placeholder="Filter name" />
          <Button type="submit" variant="ghost">
            Load
          </Button>
        </form>

        {isLoading && <Spinner />}
        {error && <Alert>{extractErrorMessage(error, 'Could not load that filter.')}</Alert>}
        {data && data.length === 0 && <p className="text-sm text-(--color-ink-faint)">No products match this filter.</p>}
        {data && data.length > 0 && (
          <div className="space-y-2">
            {data.map((p) => (
              <div key={p.ID} className="stub-divider pt-2 flex justify-between text-sm">
                <span>{p.product}</span>
                <span className="font-mono-num">{formatMoney(p.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
