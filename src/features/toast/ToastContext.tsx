import { createContext, useContext, useState, type ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

type ToastMessage = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: ToastMessage | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, variant: ToastVariant = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, variant });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
