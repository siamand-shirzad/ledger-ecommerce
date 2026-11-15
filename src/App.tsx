import { Navigate, Route, Routes } from 'react-router-dom'
import StorefrontLayout from '@/components/StorefrontLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import AdminRoute from '@/routes/AdminRoute'

import LoginPage from '@/features/auth/LoginPage'
import SignupPage from '@/features/auth/SignupPage'
import ProductListPage from '@/features/storefront/ProductListPage'
import ProductDetailPage from '@/features/storefront/ProductDetailPage'
import SearchPage from '@/features/storefront/SearchPage'
import CartPage from '@/features/cart/CartPage'

import AdminLayout from '@/features/admin/AdminLayout'
import AdminDashboard from '@/features/admin/AdminDashboard'
import CategoriesPage from '@/features/admin/CategoriesPage'
import TagsPage from '@/features/admin/TagsPage'
import ProductsPage from '@/features/admin/ProductsPage'
import FiltersPage from '@/features/admin/FiltersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Requires login (per swagger: BearerAuth on product/cart endpoints) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:productID" element={<ProductDetailPage />} />
          <Route path="/search/:searchInput" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* Requires admin role */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="filters" element={<FiltersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
