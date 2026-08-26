import { useNotifications } from '../../features/notifications/NotificationContext';
import { NotificationItem } from '../notifications/NotificationItem';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

export function NotificationsList() {
  const { notifications, markAllAsRead } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="skeleton" style={{ height: '200px' }} />;
  }

  if (notifications.length === 0) {
    return <p className="empty-state">You have no notifications.</p>;
  }

  return (
    <section className="notifications-list">
      <header className="notifications-list__header">
        <h2>Notifications</h2>
        <Button
          variant="secondary"
          onClick={markAllAsRead}
          disabled={notifications.every((n) => n.read)}
        >
          Mark all as read
        </Button>
      </header>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <NotificationItem notificationId={n.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}
