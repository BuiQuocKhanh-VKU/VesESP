import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useMonthlyTrend, useReportStats } from '../hooks/useReports'
import { useTranslation } from '@/shared/hooks/useTranslation'

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] p-2 text-[10px]">
            <p className="text-[var(--text-muted)] mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
            ))}
        </div>
    )
}

export const MonthlyTrendChart = () => {
    const { data: trend, isLoading } = useMonthlyTrend()
    const { data: stats } = useReportStats()
    const { t } = useTranslation()



    return (
        <div className="rounded-xl border border-[var(--bg-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                    {t.reports.monthlyTrend}
                </p>
                <span className="text-[10px] text-[var(--text-muted)] border border-[var(--bg-border)] px-2 py-1 rounded">
                    {t.reports.viewAll}
                </span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
                {[
                    { label: t.reports.totalMaintenance, color: 'var(--accent-cyan)' },
                    { label: t.reports.totalIncidents, color: 'var(--status-warn)' },
                ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span className="w-5 h-0.5 rounded" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                    </div>
                ))}
            </div>

            {isLoading ? (
                <div className="h-36 rounded-lg bg-[var(--bg-surface)] animate-pulse" />
            ) : (
                <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={trend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="maintenanceCases" stroke="var(--accent-cyan)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--accent-cyan)' }} name={t.reports.totalMaintenance} isAnimationActive={false} />
                        <Line type="monotone" dataKey="incidents" stroke="var(--status-warn)" strokeWidth={1.5} dot={{ r: 3, fill: 'var(--status-warn)' }} name={t.reports.totalIncidents} isAnimationActive={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--bg-border)]">
                {[
                    { label: t.reports.totalMaintenance, value: stats?.totalMaintenanceCases ?? 0 },
                    { label: t.reports.totalIncidents, value: stats?.totalIncidents ?? 0 },
                    { label: t.reports.avgResolution, value: `${stats?.avgResolutionHours ?? 0} hrs` },
                ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <p className="text-lg font-bold font-mono text-[var(--text-primary)]">{value}</p>
                        <p className="text-[9px] text-[var(--text-muted)] mt-0.5">{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}