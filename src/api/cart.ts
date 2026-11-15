import { apiClient } from './client'
import type { AddCartItemRequest, CartResponse, UpdateCartItemRequest } from '@/types/api'

export async function getCart(): Promise<CartResponse> {
  const { data } = await apiClient.get<CartResponse>('/cart')
  return data
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart')
}

export async function addCartItem(payload: AddCartItemRequest): Promise<CartResponse> {
  const { data } = await apiClient.post<CartResponse>('/cart/items', payload)
  return data
}

export async function updateCartItem(productID: number, payload: UpdateCartItemRequest): Promise<CartResponse> {
  const { data } = await apiClient.patch<CartResponse>(`/cart/items/${productID}`, payload)
  return data
}

export async function removeCartItem(productID: number): Promise<CartResponse> {
  const { data } = await apiClient.delete<CartResponse>(`/cart/items/${productID}`)
  return data
}
