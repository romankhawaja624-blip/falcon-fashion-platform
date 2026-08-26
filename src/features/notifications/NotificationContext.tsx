import { createContext, useContext, useState, type ReactNode } from 'react';

type Notification = {
  id: string;
  type: 'order' | 'ai' | 'atelier' | 'membership' | 'promotion' | 'system';
  title: string;
  body: string;
  timestamp: string; // ISO string
  read: boolean;
};

type NotificationContextValue = {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('falcon_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const mock: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'Your order #1234 shipped',
          body: 'Your package is on the way and will arrive tomorrow.',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '2',
          type: 'ai',
          title: 'New AI stylist recommendation',
          body: 'We think you’ll love this new look based on your recent choices.',
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: '3',
          type: 'promotion',
          title: 'Exclusive 15% off',
          body: 'Treat yourself with a limited‑time discount on all atelier pieces.',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ];
      setNotifications(mock);
    }
  }, []);

  // Persist changes
  React.useEffect(() => {
    localStorage.setItem('falcon_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotif: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return ctx;
}
