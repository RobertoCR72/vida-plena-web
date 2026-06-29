'use client'

import type { AuditEntry } from '@/lib/local-demo-store'
import { useStoredAuditLogs } from '@/lib/use-demo-store'

export default function AuditLogsPage() {
  const logs = useStoredAuditLogs() as AuditEntry[]

  return (
    <div>
      <h1 className="text-3xl font-bold">Logs de auditoria</h1>
      <p className="mt-2 text-slate-600">Alteracoes de status, check-ins, notificacoes e logins ficam registrados aqui.</p>
      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">Data</th>
              <th>Usuario</th>
              <th>Acao</th>
              <th>Entidade</th>
              <th>Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={`${log.createdAt}-${log.actor}-${log.action}`} className="border-t border-slate-100">
                <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                <td className="font-medium">{log.actor}</td>
                <td>{log.action}</td>
                <td>{log.entity}</td>
                <td>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
