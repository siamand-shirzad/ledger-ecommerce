import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCartItem, clearCart, getCart, removeCartItem, updateCartItem } from '@/api/cart'
import { useAuthStore } from '@/store/authStore'

const CART_KEY = ['cart']

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    enabled: isAuthenticated,
  })
}

export function useAddCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ productID, quantity }: { productID: number; quantity: number }) =>
      updateCartItem(productID, { quantity }),
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => qc.setQueryData(CART_KEY, data),
  })
}

export function useClearCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => qc.invalidateQueries({ queryKey: CART_KEY }),
  })
}
