import { useEffect } from 'react';
import { useToast } from '../../features/toast/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      hideToast();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const Icon =
    toast.variant === 'error'
      ? AlertCircle
      : toast.variant === 'info'
      ? Info
      : CheckCircle2;

  return (
    <div
      className={`toast toast--${toast.variant}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={18} className="toast__icon" aria-hidden="true" />
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={hideToast}
        aria-label="Close notification"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
