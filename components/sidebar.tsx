'use client'

import Link from "next/link"
import { BarChart3, Bell, Calendar, ClipboardCheck, Home, Shield, Users, LogOut } from "lucide-react"
import { useUserRole, setUserRole } from "@/lib/use-user-role"
import { getVisibleMenuItems } from "@/lib/rbac"

const allItems = [
  { id: 'dashboard', href: "/dashboard", label: "Visao geral", icon: Home },
  { id: 'admin', href: "/dashboard/admin", label: "Admin", icon: BarChart3 },
  { id: 'lectures', href: "/dashboard/admin/lectures", label: "Palestras", icon: Calendar },
  { id: 'speakers', href: "/dashboard/admin/speakers", label: "Palestrantes", icon: Users },
  { id: 'enrollments', href: "/dashboard/admin/enrollments", label: "Inscricoes", icon: ClipboardCheck },
  { id: 'notifications', href: "/dashboard/admin/notifications", label: "Notificacoes", icon: Bell },
  { id: 'speaker', href: "/dashboard/speaker", label: "Painel Palestrante", icon: Users },
  { id: 'participant', href: "/dashboard/participant", label: "Painel Participante", icon: ClipboardCheck },
  { id: 'schedule', href: "/dashboard/schedule", label: "Cronograma", icon: Calendar },
  { id: 'privacy', href: "/dashboard/privacy", label: "LGPD", icon: Shield },
]

export function Sidebar() {
  const role = useUserRole()
  const visibleIds = getVisibleMenuItems(role)
  const visibleItems = allItems.filter(item => visibleIds.includes(item.id))

  return (
    <aside className="border-r border-slate-200 bg-white p-4 md:min-h-screen md:w-64 flex flex-col">
      <div>
        <Link href="/" className="block rounded-lg bg-blue-700 px-4 py-3 text-lg font-bold text-white">
          Vida Plena Eventos
        </Link>
        <div className="mt-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          Role: <span className="capitalize">{role}</span>
        </div>
      </div>
      <nav className="mt-5 grid gap-1 flex-1">
        {visibleItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Seletor de role para demo */}
      <div className="border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">Demo: Mudar role</p>
        <div className="grid gap-1">
          {['admin', 'speaker', 'participant'].map((r) => (
            <button
              key={r}
              onClick={() => setUserRole(r as any)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                role === r
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r === 'admin' ? 'Admin' : r === 'speaker' ? 'Speaker' : 'Participante'}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
