import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/money'
import { Alert, Button, PageHeader, Spinner } from '@/components/ui'
import { extractErrorMessage } from '@/api/client'
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from './useCart'

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const clear = useClearCart()

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  if (error) return <Alert>{extractErrorMessage(error, 'Could not load your cart.')}</Alert>

  const items = cart?.items ?? []

  return (
    <div>
      <PageHeader
        eyebrow="Your cart"
        title={items.length ? `${cart!.totalQuantity} item${cart!.totalQuantity === 1 ? '' : 's'}` : 'Your cart is empty'}
        action={
          items.length > 0 && (
            <Button variant="ghost" onClick={() => clear.mutate()} disabled={clear.isPending}>
              Clear cart
            </Button>
          )
        }
      />

      {items.length === 0 ? (
        <p className="text-(--color-ink-soft)">
          Nothing here yet.{' '}
          <Link to="/" className="text-(--color-accent-ink) font-medium">
            Browse the catalog
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="stub p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="font-medium">{item.productName}</div>
                <div className="text-xs text-(--color-ink-faint) font-mono-num">
                  {formatMoney(item.unitPrice)} each
                </div>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => {
                  const q = Math.max(1, Number(e.target.value) || 1)
                  updateItem.mutate({ productID: item.productId, quantity: q })
                }}
                className="w-16 rounded-md border border-(--color-line) px-2 py-1.5 text-sm font-mono-num"
              />
              <div className="font-mono-num w-24 text-right">{formatMoney(item.lineTotal)}</div>
              <button
                onClick={() => removeItem.mutate(item.productId)}
                className="text-xs text-(--color-danger) hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="stub-divider pt-4 flex justify-end items-baseline gap-3">
            <span className="text-(--color-ink-soft)">Total</span>
            <span className="font-mono-num text-2xl">{formatMoney(cart!.totalPrice)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
