/**
 * Types mirroring the `definitions` section of the E-Commerce API swagger doc.
 * Keep these in sync with the backend contract.
 */

// ---------- Auth ----------

export interface User {
  id?: number
  name: string
  'E-mail': string
  password: string
}

export interface UserLogin {
  'E-mail': string
  password: string
}

/** Generic map response, e.g. { token: "..." } or { message: "..." } */
export type StringMap = Record<string, string>

// ---------- Catalog ----------

export interface Tag {
  id: number
  tagName: string
  products?: Product[]
}

export interface TagDetails {
  id: number
  tagName: string
}

export interface Category {
  id: number
  CategoryName: string
  products?: Product[]
}

export interface Product {
  id: number
  productName: string
  price: number
  categoryID: number
  category?: Category
  tag_ids?: number[]
  tags?: Tag[]
}

export interface ProductDetails {
  id: number
  productName: string
  price: number
  categoryID: number
  categoryName: string
  tags?: TagDetails[]
}

export interface Filter {
  id?: number
  filterName: string
  categoryID?: number
  category?: Category
  tagID?: number
  tag?: Tag
}

export interface FilterProds {
  ID: number
  product: string
  price: number
  categoryID: number
  tagID: number
}

// ---------- Cart ----------

export interface AddCartItemRequest {
  productId: number
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface CartItemResponse {
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface CartResponse {
  id: number
  items: CartItemResponse[]
  totalQuantity: number
  totalPrice: number
}

// ---------- User role (not defined explicitly by the swagger; inferred) ----------

export type UserRole = 'user' | 'admin'
