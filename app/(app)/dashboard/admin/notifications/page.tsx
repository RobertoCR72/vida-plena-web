import { demoNotifications } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status-badge";

export default function AdminNotificationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Notificacoes</h1>
      <div className="mt-6 grid gap-4">
        {demoNotifications.map((notification) => (
          <div key={notification.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold">{notification.subject}</h2>
              <StatusBadge status={notification.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{notification.channel}: {notification.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
