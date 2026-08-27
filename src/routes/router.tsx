import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../pages/home/HomePage';
import { ShopPage } from '../pages/discovery/ShopPage';
import { ProductDetailPage } from '../pages/product/ProductDetailPage';
import { DiscoveryPage } from '../pages/discovery/DiscoveryPage';
import { CollectionPage } from '../pages/discovery/CollectionPage';
import { SearchPage } from '../pages/search/SearchPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { ConfirmationPage } from '../pages/checkout/ConfirmationPage';
import { CheckoutErrorPage } from '../pages/checkout/CheckoutErrorPage';
import { OrderTrackingPage } from '../pages/orders/OrderTrackingPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { WishlistPage } from '../pages/wishlist/WishlistPage';
import { AuthLayout } from '../layouts/AuthLayout';
import { SignInPage } from '../pages/auth/SignInPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { OnboardingPage } from '../pages/auth/OnboardingPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { EmailVerificationPage } from '../pages/auth/EmailVerificationPage';
import { AtelierLayout } from '../layouts/AtelierLayout';
import { DashboardPage } from '../pages/atelier/DashboardPage';
import { WardrobePage } from '../pages/atelier/WardrobePage';
import { ProgressPage } from '../pages/atelier/ProgressPage';
import { SettingsPage } from '../pages/atelier/SettingsPage';
import { StylistPage } from '../pages/ai/StylistPage';
import { OutfitBuilderPage } from '../pages/ai/OutfitBuilderPage';
import { CuratedLookPage } from '../pages/ai/CuratedLookPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage';
import { AdminCatalogPage } from '../pages/admin/AdminCatalogPage';
import { AdminInventoryPage } from '../pages/admin/AdminInventoryPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminOrderPage } from '../pages/admin/AdminOrderPage';
import { AdminSupportPage } from '../pages/admin/AdminSupportPage';
import { AdminLegalPage } from '../pages/admin/AdminLegalPage';
import { AdminProductEditorPage } from '../pages/admin/AdminProductEditorPage';
import { TicketPage } from '../pages/support/TicketPage';
import { HelpPage } from '../pages/support/HelpPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { PrivacyPage } from '../pages/legal/PrivacyPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AudienceCollectionPage } from '../pages/collections/AudienceCollectionPage';
import { CategoryPage } from '../pages/collections/CategoryPage';
import { SubcategoryPage } from '../pages/collections/SubcategoryPage';
import { NotFoundPage } from '../pages/errors/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/sign-in', element: <ProtectedRoute path='/sign-in' element={<AuthLayout><SignInPage /></AuthLayout>} /> },
  { path: '/create-account', element: <ProtectedRoute path='/create-account' element={<AuthLayout><RegisterPage /></AuthLayout>} /> },
  { path: '/admin/sign-in', element: <ProtectedRoute path='/admin/sign-in' element={<AuthLayout admin><AdminLoginPage /></AuthLayout>} /> },
  { path: '/onboarding/style', element: <ProtectedRoute path='/onboarding/style' element={<OnboardingPage />} /> },
  { path: '/forgot-password', element: <ProtectedRoute path='/forgot-password' element={<ForgotPasswordPage />} /> },
  { path: '/reset-password/:token', element: <ProtectedRoute path='/reset-password/:token' element={<ResetPasswordPage />} /> },
  { path: '/verify-email', element: <ProtectedRoute path='/verify-email' element={<EmailVerificationPage />} /> },
  { path: '/support/ticket/:id', element: <ProtectedRoute path='/support/ticket/:id' element={<PublicLayout><TicketPage /></PublicLayout>} /> },
  { path: '/legal', element: <ProtectedRoute path='/legal' element={<PublicLayout><PrivacyPage /></PublicLayout>} /> },
  { path: '/stylist', element: <ProtectedRoute path='/stylist' element={<AtelierLayout />} />, children: [{ index: true, element: <StylistPage /> }] },
  { path: '/stylist/builder', element: <ProtectedRoute path='/stylist/builder' element={<AtelierLayout />} />, children: [{ index: true, element: <OutfitBuilderPage /> }] },
  { path: '/stylist/look/:slug', element: <ProtectedRoute path='/stylist/look/:slug' element={<AtelierLayout />} />, children: [{ index: true, element: <CuratedLookPage /> }] },
  { path: '/assistant', element: <ProtectedRoute path='/assistant' element={<AtelierLayout />} />, children: [{ index: true, element: <StylistPage /> }] },
  {
    path: '/atelier',
    element: <ProtectedRoute path='/atelier' element={<AtelierLayout />} />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'wardrobe', element: <WardrobePage /> },
      { path: 'intelligence', element: <ProgressPage /> },
      { path: 'loyalty', element: <ProgressPage /> },
      { path: 'membership', element: <SettingsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/account',
    element: <ProtectedRoute path='/account' element={<AtelierLayout />} />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'wardrobe', element: <WardrobePage /> },
      { path: 'loyalty', element: <ProgressPage /> },
      { path: 'membership', element: <SettingsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute path='/admin' element={<AdminLayout />} />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: 'products', element: <AdminCatalogPage /> },
      { path: 'products/new', element: <AdminProductEditorPage /> },
      { path: 'inventory', element: <AdminInventoryPage /> },
      { path: 'customers', element: <AdminCustomersPage /> },
      { path: 'orders/:id', element: <AdminOrderPage /> },
      { path: 'support', element: <AdminSupportPage /> },
      { path: 'legal', element: <AdminLegalPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute path='/' element={<PublicLayout />} />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'discover', element: <DiscoveryPage /> },
      { path: 'collections/:audience', element: <AudienceCollectionPage /> },
      { path: 'collections/:audience/:category', element: <CategoryPage /> },
      { path: 'collections/:audience/:category/:subcategory', element: <SubcategoryPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/shipping', element: <CheckoutPage /> },
      { path: 'checkout/payment', element: <CheckoutPage /> },
      { path: 'checkout/review', element: <CheckoutPage /> },
      { path: 'checkout/confirmation', element: <ConfirmationPage /> },
      { path: 'checkout/success/:orderId', element: <ConfirmationPage /> },
      { path: 'checkout/error', element: <CheckoutErrorPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:orderId', element: <OrderTrackingPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);