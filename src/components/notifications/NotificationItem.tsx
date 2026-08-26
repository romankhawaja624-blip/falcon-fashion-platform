import { Link } from 'react-router-dom';
import { useNotifications } from '../../features/notifications/NotificationContext';
import { Button } from '../ui/Button';

type Props = {
  notificationId: string;
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 10) return 'just now';
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function NotificationItem({ notificationId }: Props) {
  const { notifications, markAsRead } = useNotifications();
  const notif = notifications.find((n) => n.id === notificationId);

  if (!notif) return null;

  const { id, title, body, timestamp, read, type } = notif;

  const handleMarkRead = () => {
    if (!read) markAsRead(id);
  };

  return (
    <article
      className={`notification-item ${read ? '' : 'notification-item--unread'}`}
      tabIndex={0}
      onClick={handleMarkRead}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleMarkRead();
      }}
    >
      <header className="notification-item__header">
        <h3 className="notification-item__title">{title}</h3>
        <span className="notification-item__type">{type}</span>
      </header>
      <p className="notification-item__body">{body}</p>
      <footer className="notification-item__footer">
        <time dateTime={timestamp}>
          {formatRelativeTime(new Date(timestamp))}
        </time>
        {!read && (
          <Button variant="secondary" onClick={handleMarkRead} aria-label="Mark as read">
            Mark as read
          </Button>
        )}
      </footer>
    </article>
  );
}
