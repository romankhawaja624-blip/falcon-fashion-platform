import { NotificationsList } from '../../components/notifications/NotificationsList';

export function NotificationsPage() {
  return (
    <main className="container" aria-labelledby="notifications-title">
      <h1 id="notifications-title" className="eyebrow">
        Notifications
      </h1>
      <NotificationsList />
    </main>
  );
}
