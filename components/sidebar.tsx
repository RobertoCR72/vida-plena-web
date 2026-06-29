import Link from "next/link";
import { BarChart3, Bell, Calendar, ClipboardCheck, Home, Shield, Users } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Visao geral", icon: Home },
  { href: "/dashboard/admin", label: "Admin", icon: BarChart3 },
  { href: "/dashboard/admin/lectures", label: "Palestras", icon: Calendar },
  { href: "/dashboard/admin/speakers", label: "Palestrantes", icon: Users },
  { href: "/dashboard/admin/enrollments", label: "Inscricoes", icon: ClipboardCheck },
  { href: "/dashboard/admin/notifications", label: "Notificacoes", icon: Bell },
  { href: "/dashboard/privacy", label: "LGPD", icon: Shield },
];

export function Sidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-4 md:min-h-screen md:w-64">
      <Link href="/" className="block rounded-lg bg-blue-700 px-4 py-3 text-lg font-bold text-white">
        Vida Plena Eventos
      </Link>
      <nav className="mt-5 grid gap-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
