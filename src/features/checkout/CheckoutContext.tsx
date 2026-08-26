import { createContext, useContext, useState, type ReactNode } from 'react';
import { DELIVERY_METHODS, type DeliveryMethod } from '../orders/OrderContext';

export type CheckoutStep = 'shipping' | 'payment' | 'review';

type CheckoutContextValue = {
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
  shipping: Record<string, string>;
  setShipping: (data: Record<string, string>) => void;
  payment: Record<string, string>;
  setPayment: (data: Record<string, string>) => void;
  selectedDelivery: DeliveryMethod;
  setSelectedDelivery: (method: DeliveryMethod) => void;
  resetCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shipping, setShipping] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<Record<string, string>>({});
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>(DELIVERY_METHODS[0]);

  const resetCheckout = () => {
    setStep('shipping');
    setShipping({});
    setPayment({});
    setSelectedDelivery(DELIVERY_METHODS[0]);
  };

  return (
    <CheckoutContext.Provider
      value={{ step, setStep, shipping, setShipping, payment, setPayment, selectedDelivery, setSelectedDelivery, resetCheckout }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const value = useContext(CheckoutContext);
  if (!value) throw new Error('useCheckout must be used within CheckoutProvider');
  return value;
}