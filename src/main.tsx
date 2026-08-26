import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { CartProvider } from './features/cart/CartContext';
import { NotificationProvider } from './features/notifications/NotificationContext';
import { CheckoutProvider } from './features/checkout/CheckoutContext';
import '@fontsource/bodoni-moda/400.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CartProvider>
      <CheckoutProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </CheckoutProvider>
    </CartProvider>
  </StrictMode>,
);