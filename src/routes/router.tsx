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
import { AuthLayout } from '../layouts/AuthLayout';
import { SignInPage } from '../pages/auth/SignInPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { OnboardingPage } from '../pages/auth/OnboardingPage';
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
import { NotFoundPage } from '../pages/errors/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/sign-in', element: <AuthLayout><SignInPage /></AuthLayout> },
  { path: '/create-account', element: <AuthLayout><RegisterPage /></AuthLayout> },
  { path: '/admin/sign-in', element: <AuthLayout admin><AdminLoginPage /></AuthLayout> },
  { path: '/onboarding/style', element: <OnboardingPage /> },
  { path: '/support/ticket/:id', element: <PublicLayout><TicketPage /></PublicLayout> },
  { path: '/legal', element: <PublicLayout><PrivacyPage /></PublicLayout> },
  { path: '/stylist', element: <AtelierLayout />, children: [{ index: true, element: <StylistPage /> }] },
  { path: '/stylist/builder', element: <AtelierLayout />, children: [{ index: true, element: <OutfitBuilderPage /> }] },
  { path: '/stylist/look/:slug', element: <AtelierLayout />, children: [{ index: true, element: <CuratedLookPage /> }] },
  { path: '/assistant', element: <AtelierLayout />, children: [{ index: true, element: <StylistPage /> }] },
  {
    path: '/atelier',
    element: <AtelierLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'wardrobe', element: <WardrobePage /> },
      { path: 'intelligence', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
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
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'discover', element: <DiscoveryPage /> },
      { path: 'collections/women', element: <CollectionPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/shipping', element: <CheckoutPage /> },
      { path: 'checkout/payment', element: <CheckoutPage /> },
      { path: 'checkout/review', element: <CheckoutPage /> },
      { path: 'checkout/confirmation', element: <ConfirmationPage /> },
      { path: 'checkout/error', element: <CheckoutErrorPage /> },
      { path: 'orders/:orderId', element: <OrderTrackingPage /> },
      { path: 'help', element: <HelpPage /> },
      { path: 'notifications', element: <PublicLayout><NotificationsPage /></PublicLayout> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);