import { apiClient } from './client'
import type { Category, Filter, FilterProds, Product, StringMap, Tag } from '@/types/api'

// ----- Categories -----
export const adminCategoryApi = {
  create: async (payload: Category): Promise<StringMap> => (await apiClient.post('/admin/category/create', payload)).data,
  update: async (payload: Category): Promise<StringMap> => (await apiClient.put('/admin/category/update', payload)).data,
  remove: async (categoryID: number): Promise<StringMap> => (await apiClient.delete(`/admin/category/delete/${categoryID}`)).data,
  search: async (categoryName: string): Promise<Record<string, unknown>> =>
    (await apiClient.get(`/admin/category/read/${encodeURIComponent(categoryName)}`)).data,
}

// ----- Tags -----
export const adminTagApi = {
  create: async (payload: Tag): Promise<StringMap> => (await apiClient.post('/admin/tag/create', payload)).data,
  update: async (payload: Tag): Promise<StringMap> => (await apiClient.put('/admin/tag/update', payload)).data,
  remove: async (tagID: number): Promise<StringMap> => (await apiClient.delete(`/admin/tag/delete/${tagID}`)).data,
  search: async (tagName: string): Promise<Record<string, unknown>> =>
    (await apiClient.get(`/admin/tag/read/${encodeURIComponent(tagName)}`)).data,
}

// ----- Products -----
export const adminProductApi = {
  create: async (payload: Product): Promise<StringMap> => (await apiClient.post('/admin/product/create', payload)).data,
  update: async (payload: Product): Promise<StringMap> => (await apiClient.put('/admin/product/update', payload)).data,
  remove: async (productID: number): Promise<StringMap> => (await apiClient.delete(`/admin/product/delete/${productID}`)).data,
  search: async (productName: string): Promise<Record<string, unknown>> =>
    (await apiClient.get(`/admin/product/read/${encodeURIComponent(productName)}`)).data,
}

// ----- Filters -----
export const adminFilterApi = {
  create: async (payload: Filter): Promise<StringMap> => (await apiClient.post('/admin/filter/create', payload)).data,
  load: async (filterName: string): Promise<FilterProds[]> =>
    (await apiClient.get(`/admin/filter/load/${encodeURIComponent(filterName)}`)).data,
}
