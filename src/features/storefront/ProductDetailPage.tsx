import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '@/api/products'
import { extractErrorMessage } from '@/api/client'
import { formatMoney } from '@/lib/money'
import { Alert, Button, Spinner } from '@/components/ui'
import { useAddCartItem } from '@/features/cart/useCart'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

export default function ProductDetailPage() {
  const { productID } = useParams<{ productID: string }>()
  const id = Number(productID)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
    enabled: Number.isFinite(id),
  })

  const addItem = useAddCartItem()

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setAdded(false)
    addItem.mutate(
      { productId: id, quantity },
      { onSuccess: () => setAdded(true) }
    )
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  if (error) return <Alert>{extractErrorMessage(error, 'Product not found.')}</Alert>
  if (!product) return null

  return (
    <div className="max-w-xl">
      <div className="text-xs uppercase tracking-wider text-(--color-accent) mb-2">{product.categoryName}</div>
      <h1 className="font-display text-3xl mb-3">{product.productName}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {product.tags?.map((t) => (
          <span key={t.id} className="text-xs px-2 py-1 rounded-full bg-(--color-accent-soft) text-(--color-accent-ink)">
            {t.tagName}
          </span>
        ))}
      </div>

      <div className="stub p-6 flex items-center justify-between mb-6">
        <span className="text-sm text-(--color-ink-faint)">SKU-{product.id}</span>
        <span className="font-mono-num text-2xl">{formatMoney(product.price)}</span>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-(--color-ink-soft)" htmlFor="qty">
          Qty
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 rounded-md border border-(--color-line) px-3 py-2 text-sm font-mono-num"
        />
        <Button onClick={handleAddToCart} disabled={addItem.isPending}>
          {addItem.isPending ? 'Adding…' : 'Add to cart'}
        </Button>
      </div>

      {added && <p className="text-sm text-(--color-success) mt-3">Added to your cart.</p>}
      {addItem.isError && <Alert>{extractErrorMessage(addItem.error, 'Could not add to cart.')}</Alert>}
    </div>
  )
}
