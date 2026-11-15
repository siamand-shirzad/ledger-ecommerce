import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminTagApi } from '@/api/admin'
import { extractErrorMessage } from '@/api/client'
import { Alert, Button, Input, PageHeader, Spinner } from '@/components/ui'
import type { Tag } from '@/types/api'

export default function TagsPage() {
  const qc = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Tag | null>(null)
  const [name, setName] = useState('')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-tags', search],
    queryFn: () => adminTagApi.search(search),
    enabled: !!search,
  })

  const createMut = useMutation({
    mutationFn: adminTagApi.create,
    onSuccess: () => {
      setName('')
      refetch()
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
  const updateMut = useMutation({
    mutationFn: adminTagApi.update,
    onSuccess: () => {
      setEditing(null)
      setName('')
      refetch()
    },
  })
  const deleteMut = useMutation({
    mutationFn: adminTagApi.remove,
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
      updateMut.mutate({ ...editing, tagName: name.trim() })
    } else {
      createMut.mutate({ id: 0, tagName: name.trim() })
    }
  }

  const mutationError = createMut.error || updateMut.error || deleteMut.error

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Tags" />

      <div className="stub p-5 mb-6 max-w-md">
        <h2 className="text-sm font-medium mb-3">{editing ? `Edit “${editing.tagName}”` : 'New tag'}</h2>
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name" />
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
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tags by name…" />
        <Button type="submit" variant="ghost">
          Search
        </Button>
      </form>

      {isLoading && <Spinner />}
      {error && <Alert>{extractErrorMessage(error, 'Search failed.')}</Alert>}

      {data != null && (
        <div className="stub p-4">
          <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {!search && <p className="text-sm text-(--color-ink-faint)">Search for a tag above to edit or delete it.</p>}
    </div>
  )
}
