import { ChevronsUp } from 'lucide-react'
import { AlertSeverityBadge } from './AlertSeverityBadge'
import { useAlertHistory } from '../hooks/useAlerts'
import { useTranslation } from '@/shared/hooks/useTranslation'

const getStatusConfig = (t: any) => ({
    active: { label: t.alerts.status, color: 'var(--status-danger)' },
    acknowledged: { label: t.alerts.acknowledged ?? 'Acknowledged', color: 'var(--status-warn)' },
    assigned: { label: t.alerts.assigned ?? 'Assigned', color: 'var(--status-info)' },
    in_progress: { label: t.alerts.inProgress ?? 'In Progress', color: 'var(--status-ok)' },
    resolved: { label: t.alerts.resolved ?? 'Resolved', color: 'var(--text-muted)' },
    pending: { label: t.alerts.pending ?? 'Pending', color: 'var(--text-muted)' },
})

export const AlertHistoryTable = () => {
    const { data: history, isLoading } = useAlertHistory()
    const { t, language } = useTranslation()
    const statusConfig = getStatusConfig(t)

    return (
        <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-card)] p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                    {t.alerts.history}
                </p>
                <button className="text-[10px] text-[var(--accent-cyan)] hover:underline">
                    {t.alerts.viewHistory}
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                    <thead>
                        <tr className="border-b border-[var(--bg-border)]">
                            {[t.alerts.timestamp, 'Event', t.alerts.severity2, t.alerts.triggeredBy, t.alerts.escalation, t.alerts.assignedTo, t.alerts.status].map(h => (
                                <th key={h} className="text-left text-[9px] font-semibold text-[var(--text-muted)] uppercase tracking-wider pb-2 pr-4 whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={7} className="py-2">
                                        <div className="h-5 rounded bg-[var(--bg-surface)] animate-pulse" />
                                    </td>
                                </tr>
                            ))
                            : history?.map(entry => {
                                const status = statusConfig[entry.status]
                                return (
                                    <tr key={entry.id} className="border-b border-[var(--bg-border)] last:border-0 hover:bg-[var(--bg-surface)] transition-colors">
                                        <td className="py-2.5 pr-4 font-mono text-[var(--text-muted)] whitespace-nowrap">
                                            {entry.time}
                                        </td>
                                        <td className="py-2.5 pr-4 text-[var(--text-secondary)] max-w-[180px] truncate">
                                            {entry.event[language]}
                                        </td>
                                        <td className="py-2.5 pr-4">
                                            <AlertSeverityBadge severity={entry.severity} />
                                        </td>
                                        <td className="py-2.5 pr-4 text-[var(--text-muted)] whitespace-nowrap">
                                            {entry.triggeredBy}
                                        </td>
                                        <td className="py-2.5 pr-4">
                                            <div className="flex items-center gap-1">
                                                <ChevronsUp className="w-3 h-3 text-[var(--status-warn)]" />
                                                <span className="text-[var(--text-muted)]">Level {entry.escalationLevel}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 pr-4 text-[var(--text-secondary)] whitespace-nowrap">
                                            {entry.assignedTo}
                                        </td>
                                        <td className="py-2.5">
                                            <span
                                                className="px-2 py-0.5 rounded text-[9px] font-semibold border"
                                                style={{ color: status.color, borderColor: status.color }}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}