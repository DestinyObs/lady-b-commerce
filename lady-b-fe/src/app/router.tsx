import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { ProtectedRoute } from '../components/shared/ProtectedRoute';
import { AdminRoute } from '../components/shared/AdminRoute';
import { PageLoader } from '../components/shared/PageLoader';

// ─── Lazy-load all pages ──────────────────────────────────────────────────────

// Public
const HomePage = lazy(() => import('../pages/public/HomePage'));
const AboutPage = lazy(() => import('../pages/public/AboutPage'));
const CraftsmanshipPage = lazy(() => import('../pages/public/CraftsmanshipPage'));
const OurStoryPage = lazy(() => import('../pages/public/OurStoryPage'));
const PressPage = lazy(() => import('../pages/public/PressPage'));
const WholesalePage = lazy(() => import('../pages/public/WholesalePage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const JournalPage = lazy(() => import('../pages/public/JournalPage'));
const JournalPostPage = lazy(() => import('../pages/public/JournalPostPage'));
const GiftCardsPage = lazy(() => import('../pages/public/GiftCardsPage'));
const FaqPage = lazy(() => import('../pages/public/FaqPage'));
const BespokePage = lazy(() => import('../pages/public/BespokePage'));

// Shop
const ShopPage = lazy(() => import('../pages/shop/ShopPage'));
const CollectionsPage = lazy(() => import('../pages/shop/CollectionsPage'));
const CollectionPage = lazy(() => import('../pages/shop/CollectionPage'));
const ProductPage = lazy(() => import('../pages/shop/ProductPage'));
const CartPage = lazy(() => import('../pages/shop/CartPage'));
const WishlistPage = lazy(() => import('../pages/shop/WishlistPage'));

// Checkout
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('../pages/checkout/CheckoutSuccessPage'));
const CheckoutCancelPage = lazy(() => import('../pages/checkout/CheckoutCancelPage'));

// Custom orders
const CustomOrdersPage = lazy(() => import('../pages/custom-orders/CustomOrdersPage'));
const CustomOrderStartPage = lazy(() => import('../pages/custom-orders/CustomOrderStartPage'));
const CustomOrderStatusPage = lazy(() => import('../pages/custom-orders/CustomOrderStatusPage'));

// Auth
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/public/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/public/ResetPasswordPage'));

// Account
const AccountDashboard = lazy(() => import('../pages/account/AccountDashboard'));
const AccountOrders = lazy(() => import('../pages/account/AccountOrders'));
const AccountOrderDetail = lazy(() => import('../pages/account/AccountOrderDetail'));
const AccountProfile = lazy(() => import('../pages/account/AccountProfile'));
const AccountAddresses = lazy(() => import('../pages/account/AccountAddresses'));
const AccountCustomOrders = lazy(() => import('../pages/account/AccountCustomOrders'));
const AccountSettings = lazy(() => import('../pages/account/AccountSettings'));
const AccountBilling = lazy(() => import('../pages/account/AccountBilling'));

// Legal
const ReturnPolicyPage = lazy(() => import('../pages/legal/ReturnPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/legal/TermsPage'));
const ShippingPolicyPage = lazy(() => import('../pages/legal/ShippingPolicyPage'));
const AccessibilityPage = lazy(() => import('../pages/legal/AccessibilityPage'));
const SustainabilityPage = lazy(() => import('../pages/legal/SustainabilityPage'));

// Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminProductNew = lazy(() => import('../pages/admin/AdminProductNew'));
const AdminProductEdit = lazy(() => import('../pages/admin/AdminProductEdit'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('../pages/admin/AdminOrderDetail'));
const AdminCustomOrders = lazy(() => import('../pages/admin/AdminCustomOrders'));
const AdminCustomOrderDetail = lazy(() => import('../pages/admin/AdminCustomOrderDetail'));
const AdminCustomers = lazy(() => import('../pages/admin/AdminCustomers'));
const AdminCollections = lazy(() => import('../pages/admin/AdminCollections'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminCoupons = lazy(() => import('../pages/admin/AdminCoupons'));
const AdminReviews = lazy(() => import('../pages/admin/AdminReviews'));
const AdminNewsletter = lazy(() => import('../pages/admin/AdminNewsletter'));
const AdminContactMessages = lazy(() => import('../pages/admin/AdminContactMessages'));
const AdminWholesale = lazy(() => import('../pages/admin/AdminWholesale'));
const AdminPress = lazy(() => import('../pages/admin/AdminPress'));
const AdminInventory = lazy(() => import('../pages/admin/AdminInventory'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminAuditLogs = lazy(() => import('../pages/admin/AdminAuditLogs'));
const AdminJournal = lazy(() => import('../pages/admin/AdminJournal'));
const AdminGiftCards = lazy(() => import('../pages/admin/AdminGiftCards'));
const AdminFaqs = lazy(() => import('../pages/admin/AdminFaqs'));

// Error
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage'));
const ServerErrorPage = lazy(() => import('../pages/public/ServerErrorPage'));
const UnauthorizedPage = lazy(() => import('../pages/public/UnauthorizedPage'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
      { path: 'shop', element: <SuspenseWrapper><ShopPage /></SuspenseWrapper> },
      { path: 'shop/:collectionSlug', element: <SuspenseWrapper><CollectionPage /></SuspenseWrapper> },
      { path: 'product/:productSlug', element: <SuspenseWrapper><ProductPage /></SuspenseWrapper> },
      { path: 'collections', element: <SuspenseWrapper><CollectionsPage /></SuspenseWrapper> },
      { path: 'collections/:slug', element: <SuspenseWrapper><CollectionPage /></SuspenseWrapper> },
      { path: 'cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
      { path: 'wishlist', element: <SuspenseWrapper><WishlistPage /></SuspenseWrapper> },
      { path: 'custom-orders', element: <SuspenseWrapper><CustomOrdersPage /></SuspenseWrapper> },
      { path: 'custom-orders/start', element: <SuspenseWrapper><ProtectedRoute><CustomOrderStartPage /></ProtectedRoute></SuspenseWrapper> },
      { path: 'custom-orders/:requestId', element: <SuspenseWrapper><ProtectedRoute><CustomOrderStatusPage /></ProtectedRoute></SuspenseWrapper> },
      { path: 'bespoke', element: <SuspenseWrapper><BespokePage /></SuspenseWrapper> },
      { path: 'craftsmanship', element: <SuspenseWrapper><CraftsmanshipPage /></SuspenseWrapper> },
      { path: 'our-story', element: <SuspenseWrapper><OurStoryPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'journal', element: <SuspenseWrapper><JournalPage /></SuspenseWrapper> },
      { path: 'journal/:slug', element: <SuspenseWrapper><JournalPostPage /></SuspenseWrapper> },
      { path: 'press', element: <SuspenseWrapper><PressPage /></SuspenseWrapper> },
      { path: 'wholesale', element: <SuspenseWrapper><WholesalePage /></SuspenseWrapper> },
      { path: 'gift-cards', element: <SuspenseWrapper><GiftCardsPage /></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><FaqPage /></SuspenseWrapper> },
      { path: 'returns', element: <SuspenseWrapper><ReturnPolicyPage /></SuspenseWrapper> },
      { path: 'shipping', element: <SuspenseWrapper><ShippingPolicyPage /></SuspenseWrapper> },
      { path: 'privacy', element: <SuspenseWrapper><PrivacyPolicyPage /></SuspenseWrapper> },
      { path: 'terms', element: <SuspenseWrapper><TermsPage /></SuspenseWrapper> },
      { path: 'accessibility', element: <SuspenseWrapper><AccessibilityPage /></SuspenseWrapper> },
      { path: 'sustainability', element: <SuspenseWrapper><SustainabilityPage /></SuspenseWrapper> },

      // Protected account routes
      {
        path: 'account',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <SuspenseWrapper><AccountDashboard /></SuspenseWrapper> },
          { path: 'orders', element: <SuspenseWrapper><AccountOrders /></SuspenseWrapper> },
          { path: 'orders/:orderId', element: <SuspenseWrapper><AccountOrderDetail /></SuspenseWrapper> },
          { path: 'profile', element: <SuspenseWrapper><AccountProfile /></SuspenseWrapper> },
          { path: 'addresses', element: <SuspenseWrapper><AccountAddresses /></SuspenseWrapper> },
          { path: 'custom-orders', element: <SuspenseWrapper><AccountCustomOrders /></SuspenseWrapper> },
          { path: 'settings', element: <SuspenseWrapper><AccountSettings /></SuspenseWrapper> },
          { path: 'billing', element: <SuspenseWrapper><AccountBilling /></SuspenseWrapper> },
        ],
      },

      // Checkout (outside main layout for focused experience)
      { path: 'checkout', element: <SuspenseWrapper><ProtectedRoute><CheckoutPage /></ProtectedRoute></SuspenseWrapper> },
      { path: 'checkout/success', element: <SuspenseWrapper><CheckoutSuccessPage /></SuspenseWrapper> },
      { path: 'checkout/cancel', element: <SuspenseWrapper><CheckoutCancelPage /></SuspenseWrapper> },
    ],
  },

  // Auth pages (minimal layout)
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      { path: 'forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: 'reset-password', element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper> },
    ],
  },

  // Admin (protected, separate layout)
  {
    path: 'admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
      { path: 'dashboard', element: <SuspenseWrapper><AdminDashboard /></SuspenseWrapper> },
      { path: 'products', element: <SuspenseWrapper><AdminProducts /></SuspenseWrapper> },
      { path: 'products/new', element: <SuspenseWrapper><AdminProductNew /></SuspenseWrapper> },
      { path: 'products/:id/edit', element: <SuspenseWrapper><AdminProductEdit /></SuspenseWrapper> },
      { path: 'orders', element: <SuspenseWrapper><AdminOrders /></SuspenseWrapper> },
      { path: 'orders/:id', element: <SuspenseWrapper><AdminOrderDetail /></SuspenseWrapper> },
      { path: 'custom-orders', element: <SuspenseWrapper><AdminCustomOrders /></SuspenseWrapper> },
      { path: 'custom-orders/:id', element: <SuspenseWrapper><AdminCustomOrderDetail /></SuspenseWrapper> },
      { path: 'customers', element: <SuspenseWrapper><AdminCustomers /></SuspenseWrapper> },
      { path: 'collections', element: <SuspenseWrapper><AdminCollections /></SuspenseWrapper> },
      { path: 'categories', element: <SuspenseWrapper><AdminCategories /></SuspenseWrapper> },
      { path: 'coupons', element: <SuspenseWrapper><AdminCoupons /></SuspenseWrapper> },
      { path: 'reviews', element: <SuspenseWrapper><AdminReviews /></SuspenseWrapper> },
      { path: 'newsletter', element: <SuspenseWrapper><AdminNewsletter /></SuspenseWrapper> },
      { path: 'contact-messages', element: <SuspenseWrapper><AdminContactMessages /></SuspenseWrapper> },
      { path: 'wholesale', element: <SuspenseWrapper><AdminWholesale /></SuspenseWrapper> },
      { path: 'press', element: <SuspenseWrapper><AdminPress /></SuspenseWrapper> },
      { path: 'inventory', element: <SuspenseWrapper><AdminInventory /></SuspenseWrapper> },
      { path: 'journal', element: <SuspenseWrapper><AdminJournal /></SuspenseWrapper> },
      { path: 'gift-cards', element: <SuspenseWrapper><AdminGiftCards /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><AdminFaqs /></SuspenseWrapper> },
      { path: 'settings', element: <SuspenseWrapper><AdminSettings /></SuspenseWrapper> },
      { path: 'audit-logs', element: <SuspenseWrapper><AdminAuditLogs /></SuspenseWrapper> },
    ],
  },

  // Errors
  { path: 'unauthorized', element: <SuspenseWrapper><UnauthorizedPage /></SuspenseWrapper> },
  { path: '500', element: <SuspenseWrapper><ServerErrorPage /></SuspenseWrapper> },
  { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
