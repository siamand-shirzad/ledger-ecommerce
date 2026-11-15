import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCategoryApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { Alert, Button, Input, PageHeader, Spinner } from '@/components/ui'
import type { Category } from '@/types/api'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('') // committed search
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-categories', search],
    queryFn: () => adminCategoryApi.search(search),
    enabled: !!search,
  })

  const createMut = useMutation({
    mutationFn: adminCategoryApi.create,
    onSuccess: () => {
      setName('')
      refetch()
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
  const updateMut = useMutation({
    mutationFn: adminCategoryApi.update,
    onSuccess: () => {
      setEditing(null)
      setName('')
      refetch()
    },
  })
  const deleteMut = useMutation({
    mutationFn: adminCategoryApi.remove,
    onSuccess: () => refetch(),
  })

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    setSearch(searchTerm.trim())
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    if (editing) {
      updateMut.mutate({ ...editing, CategoryName: name.trim() })
    } else {
      createMut.mutate({ id: 0, CategoryName: name.trim() })
    }
  }

  const mutationError = createMut.error || updateMut.error || deleteMut.error

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Categories" />

      <div className="stub p-5 mb-6 max-w-md">
        <h2 className="text-sm font-medium mb-3">{editing ? `Edit “${editing.CategoryName}”` : 'New category'}</h2>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
            {editing ? 'Save' : 'Create'}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditing(null)
                setName('')
              }}
            >
              Cancel
            </Button>
          )}
        </form>
        {mutationError && <div className="mt-3"><Alert>{extractErrorMessage(mutationError)}</Alert></div>}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4 max-w-md">
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search categories by name…" />
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
            The search endpoint returns a loose object — once you confirm its real shape, swap this
            for a proper row list with Edit/Delete buttons calling{' '}
            <code className="font-mono-num">updateMut</code> / <code className="font-mono-num">deleteMut</code>.
          </p>
        </div>
      )}

      {!search && (
        <p className="text-sm text-(--color-ink-faint)">Search for a category above to edit or delete it.</p>
      )}
    </div>
  )
}
