import { AdminNotificationsPage } from "@/components/admin/admin-notifications-page";
import { listNotifications } from "@/lib/database";

export const dynamic = "force-dynamic";;

export default function NotificationsAdminPage() {
  const notifications = listNotifications();

  return <AdminNotificationsPage notifications={notifications} />;
}
