import { apiClient } from './client'
import type { ProductDetails } from '@/types/api'

/** GET /user/products returns products grouped by an outer key (e.g. by category). */
export async function listProducts(): Promise<Record<string, ProductDetails[]>> {
  const { data } = await apiClient.get<Record<string, ProductDetails[]>>('/user/products')
  return data
}

export async function getProduct(productID: number): Promise<ProductDetails> {
  const { data } = await apiClient.get<ProductDetails>(`/user/products/${productID}`)
  return data
}

export async function searchProducts(searchInput: string): Promise<Record<string, unknown>> {
  const { data } = await apiClient.get(`/user/product/search/${encodeURIComponent(searchInput)}`)
  return data
}
