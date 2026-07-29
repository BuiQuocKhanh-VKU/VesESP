import { Card } from '@/shared/components/ui/Card'
import { useBehaviorMetrics } from '../hooks/useAnalytics'
import type { BehaviorMetric } from '../types/analytics.types'
import { useTranslation } from '@/shared/hooks/useTranslation'

const getGaugeState = (metric: BehaviorMetric) => {
    const { current, normalMin, normalMax, label } = metric
    const labelText = `${label.en} ${label.vi}`.toLowerCase()

    // ================== NHIỆT ĐỘ ==================
    // Gauge vẫn tính theo 0 - 100 để vòng không bị đầy quá nhanh.
    // Nhưng màu thì dùng ngưỡng riêng:
    // < 35°C: xanh
    // >= 35°C: vàng
    // >= 36.5°C: đỏ
    if (
        labelText.includes('temperature') ||
        labelText.includes('nhiệt')
    ) {
        const pct = Math.min(Math.max(current / 100, 0), 1)

        const arcColor =
            current >= 36.5
                ? '#ef4444' // đỏ
                : current >= 35
                ? '#f59e0b' // vàng/cam
                : '#22c55e' // xanh

        return {
            pct,
            arcColor,
            normalLabel: 'Normal: < 35',
        }
    }

    // ================== CÁC CHỈ SỐ KHÁC ==================
    const range = normalMax - normalMin
    const pct = range > 0
        ? Math.min(Math.max((current - normalMin) / range, 0), 1)
        : 0

    const isWithin = current >= normalMin && current <= normalMax

    return {
        pct,
        arcColor: isWithin ? 'var(--status-ok)' : 'var(--status-danger)',
        normalLabel: `Normal: ${normalMin} – ${normalMax}`,
    }
}

const GaugeDial = ({
    metric,
    language,
}: {
    metric: BehaviorMetric
    language: 'en' | 'vi'
}) => {
    const { current, label, unit } = metric
    const { pct, arcColor, normalLabel } = getGaugeState(metric)

    // SVG arc math
    const r = 44
    const cx = 56
    const cy = 56
    const startAngle = -210
    const endAngle = 30
    const totalDeg = endAngle - startAngle

    const toRad = (deg: number) => (deg * Math.PI) / 180
    const arcX = (angle: number) => cx + r * Math.cos(toRad(angle))
    const arcY = (angle: number) => cy + r * Math.sin(toRad(angle))

    const bgStart = startAngle
    const bgEnd = endAngle
    const fillEnd = startAngle + totalDeg * pct

    const describeArc = (start: number, end: number) => {
        const s = { x: arcX(start), y: arcY(start) }
        const e = { x: arcX(end), y: arcY(end) }
        const large = end - start > 180 ? 1 : 0

        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative">
                <svg width="112" height="80" viewBox="0 0 112 80">
                    {/* Background arc */}
                    <path
                        d={describeArc(bgStart, bgEnd)}
                        fill="none"
                        stroke="var(--bg-surface)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Value arc */}
                    {pct > 0 && (
                        <path
                            d={describeArc(bgStart, fillEnd)}
                            fill="none"
                            stroke={arcColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                    )}

                    {/* Center value */}
                    <text
                        x={cx}
                        y={cy - 4}
                        textAnchor="middle"
                        fill="var(--text-primary)"
                        fontSize="16"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono, monospace"
                    >
                        {current}
                    </text>

                    <text
                        x={cx}
                        y={cy + 12}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize="9"
                    >
                        {unit}
                    </text>
                </svg>
            </div>

            <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
                {label[language]}
            </p>

            <p className="text-[9px] text-[var(--text-muted)]">
                {normalLabel}
            </p>
        </div>
    )
}

export const BehaviorComparison = () => {
    const { data: metrics, isLoading } = useBehaviorMetrics()
    const { t, language } = useTranslation()

    return (
        <Card className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-[var(--accent-cyan)] bg-opacity-20 text-[10px] font-bold text-[var(--accent-cyan)]">
                        4
                    </span>

                    <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                        {t.analytics.behaviorCompare}
                    </h2>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
                {[
                    {
                        label: t.analytics.normalRange,
                        dashed: true,
                    },
                    {
                        label: t.analytics.current,
                        dashed: false,
                    },
                ].map(({ label, dashed }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <span
                            className={`w-6 h-0 border-t ${
                                dashed
                                    ? 'border-dashed border-[var(--text-muted)]'
                                    : 'border-[var(--accent-cyan)]'
                            }`}
                        />

                        <span className="text-[10px] text-[var(--text-muted)]">
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Gauges */}
            {isLoading ? (
                <div className="flex gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-28 rounded-lg bg-[var(--bg-surface)] animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-around">
                    {metrics?.map(metric => (
                        <GaugeDial
                            key={metric.label[language]}
                            metric={metric}
                            language={language}
                        />
                    ))}
                </div>
            )}

            <button className="text-[10px] text-[var(--accent-cyan)] hover:underline self-end">
                {t.analytics.viewComparison}
            </button>
        </Card>
    )
}