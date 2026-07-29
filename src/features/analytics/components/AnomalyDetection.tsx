import { useState } from 'react'
import { AlertTriangle, Activity } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { useAnomalyEvents } from '../hooks/useAnalytics'
import type { AnomalyEvent } from '../types/analytics.types'
import { useTranslation } from '@/shared/hooks/useTranslation'

const severityColor = {
    high: 'var(--status-danger)',
    medium: 'var(--status-warn)',
    low: 'var(--status-ok)',
}

const timelinePoints = [
    { time: '12:30', severity: 'low' as const },
    { time: '13:00', severity: 'low' as const },
    { time: '13:30', severity: 'medium' as const },
    { time: '14:00', severity: 'medium' as const },
    { time: '14:30', severity: 'high' as const },
    { time: '15:00', severity: 'low' as const },
]

export const AnomalyDetection = () => {
    const { data: anomalies, isLoading } = useAnomalyEvents()
    const [selected, setSelected] = useState<AnomalyEvent | null>(null)
    const latest = anomalies?.[0] ?? null

    const displayed = selected ?? latest

    const { t, language } = useTranslation()

    return (
        <Card className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded flex items-center justify-center bg-[var(--accent-cyan)] bg-opacity-20 text-[10px] font-bold text-[var(--accent-cyan)]">
                    3
                </span>
                <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                    {t.analytics.anomalyDetection}
                </h2>
            </div>

            {/* Timeline */}
            <div className="flex items-center justify-between px-2">
                {timelinePoints.map((pt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div
                            className="w-3 h-3 rounded-full border-2 border-[var(--bg-base)] cursor-pointer transition-transform hover:scale-125"
                            style={{
                                backgroundColor: severityColor[pt.severity],
                                boxShadow: pt.severity === 'high'
                                    ? `0 0 8px ${severityColor.high}`
                                    : 'none',
                            }}
                        />
                        <span className="text-[8px] font-mono text-[var(--text-muted)]">{pt.time}</span>
                    </div>
                ))}
            </div>

            {/* Timeline line */}
            <div className="relative -mt-6 mb-2 mx-2">
                <div className="h-px bg-[var(--bg-border)] w-full" />
            </div>

            {/* Detail box */}
            {isLoading ? (
                <div className="h-24 rounded-lg bg-[var(--bg-surface)] animate-pulse" />
            ) : displayed ? (
                <div className="grid grid-cols-2 gap-3">
                    {/* Latest Anomaly */}
                    <div className="rounded-lg bg-[var(--bg-surface)] border border-[var(--status-danger)] border-opacity-40 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Activity className="w-3.5 h-3.5 text-[var(--status-danger)]" />
                            <span className="text-[10px] font-semibold text-[var(--status-danger)] uppercase tracking-wider">
                                {t.analytics.latestAnomaly}
                            </span>
                        </div>
                        <p className="text-[11px] font-semibold text-[var(--text-primary)] leading-tight">
                            {displayed.parameter[language]} lúc {displayed.timestamp}
                        </p>
                        <span
                            className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[9px] font-bold border"
                            style={{
                                color: severityColor[displayed.severity],
                                borderColor: severityColor[displayed.severity],
                                backgroundColor: `${severityColor[displayed.severity]}15`,
                            }}
                        >
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {displayed.severity.toUpperCase()} SEVERITY
                        </span>
                    </div>

                    {/* Event Details */}
                    <div className="rounded-lg bg-[var(--bg-surface)] border border-[var(--bg-border)] p-3">
                        <p className="text-[10px] font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                            {t.analytics.eventDetails}
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {[
                                { label: t.analytics.parameter, value: displayed.parameter[language] },
                                { label: t.analytics.value, value: `${displayed.value} ${displayed.unit}` },
                                { label: t.analytics.deviation, value: displayed.deviation[language] },
                                { label: t.analytics.component, value: displayed.component },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between gap-2">
                                    <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                                    <span className="text-[10px] text-[var(--text-secondary)] font-medium text-right truncate max-w-[120px]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            <button className="text-[10px] text-[var(--accent-cyan)] hover:underline self-end">
                {t.analytics.viewAnomalies}
            </button>
        </Card>
    )
}