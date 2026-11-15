import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminProductApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { Alert, Button, Field, Input, PageHeader, Spinner } from '@/components/ui'

const emptyForm = { id: 0, productName: '', price: 0, categoryID: 0, tagIds: '' }

export default function ProductsPage() {
  const qc = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: () => adminProductApi.search(search),
    enabled: !!search,
  })

  const invalidateCatalog = () => qc.invalidateQueries({ queryKey: ['products'] })

  const createMut = useMutation({
    mutationFn: adminProductApi.create,
    onSuccess: () => {
      setForm(emptyForm)
      refetch()
      invalidateCatalog()
    },
  })
  const updateMut = useMutation({
    mutationFn: adminProductApi.update,
    onSuccess: () => {
      setForm(emptyForm)
      setEditingId(null)
      refetch()
      invalidateCatalog()
    },
  })
  const deleteMut = useMutation({
    mutationFn: adminProductApi.remove,
    onSuccess: () => {
      refetch()
      invalidateCatalog()
    },
  })

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    setSearch(searchTerm.trim())
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.productName.trim()) return
    const tag_ids = form.tagIds
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)

    const payload = {
      id: editingId ?? 0,
      productName: form.productName.trim(),
      price: Number(form.price) || 0,
      categoryID: Number(form.categoryID) || 0,
      tag_ids,
    }

    if (editingId) updateMut.mutate(payload)
    else createMut.mutate(payload)
  }

  const mutationError = createMut.error || updateMut.error || deleteMut.error

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Products" />

      <div className="stub p-5 mb-6 max-w-md">
        <h2 className="text-sm font-medium mb-3">{editingId ? 'Edit product' : 'New product'}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <Field label="Name">
            <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="Category ID">
              <Input
                type="number"
                value={form.categoryID}
                onChange={(e) => setForm({ ...form, categoryID: Number(e.target.value) })}
              />
            </Field>
          </div>
          <Field label="Tag IDs (comma-separated)">
            <Input value={form.tagIds} onChange={(e) => setForm({ ...form, tagIds: e.target.value })} placeholder="1, 4, 7" />
          </Field>

          <div className="flex gap-2">
            <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
              {editingId ? 'Save' : 'Create'}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm)
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
        {mutationError && <div className="mt-3"><Alert>{extractErrorMessage(mutationError)}</Alert></div>}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4 max-w-md">
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products by name…" />
        <Button type="submit" variant="ghost">
          Search
        </Button>
      </form>

      {isLoading && <Spinner />}
      {error && <Alert>{extractErrorMessage(error, 'Search failed.')}</Alert>}

      {data != null && (
        <div className="stub p-4">
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          <p className="text-xs text-(--color-ink-faint) mt-2">
            Wire a "Delete" button here to <code className="font-mono-num">deleteMut.mutate(productID)</code> and an
            "Edit" button to populate the form + <code className="font-mono-num">setEditingId</code> once the search
            response shape (currently <code className="font-mono-num">additionalProperties: true</code>) is confirmed.
          </p>
        </div>
      )}
    </div>
  )
}
