import { Link } from 'react-router-dom';
import { useNotifications } from '../../features/notifications/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/Button';

type Props = {
  notificationId: string;
};

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
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
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
