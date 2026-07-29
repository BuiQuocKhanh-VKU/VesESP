import { useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { Calendar } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { useAnalyticsTrend } from '../hooks/useAnalytics'
import type { TimeRange } from '@/shared/types/common.types'
import { useTranslation } from '@/shared/hooks/useTranslation'

const timeRanges: TimeRange[] = ['1H', '6H', '12H', '24H', '7D']

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    return (
        <div className="rounded-lg border border-[var(--bg-border)] bg-[var(--bg-surface)] p-2.5 text-[10px] shadow-xl">
            <p className="text-[var(--text-muted)] mb-1.5 font-mono">{label}</p>

            {payload.map((p: any) => (
                <p key={p.dataKey} className="font-mono" style={{ color: p.color }}>
                    {p.name}: {typeof p.value === 'number' ? p.value.toFixed(3) : p.value}
                </p>
            ))}
        </div>
    )
}

export const MultiParamTrendChart = () => {
    const [activeRange, setActiveRange] = useState<TimeRange>('24H')
    const { data, isLoading } = useAnalyticsTrend(activeRange)
    const { t } = useTranslation()

    const chartData = data?.map(d => ({
        ...d,
        time: new Date(d.timestamp).toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }),
    })) ?? []

    const allLines = [
        {
            key: 'temperature',
            label: t.dashboard.temperature + ' (°C)',
            color: 'var(--chart-temp)',
            yAxisId: 'left',
        },
        {
            key: 'vibration',
            label: t.dashboard.vibration + ' (RMS)',
            color: 'var(--chart-vibration)',
            yAxisId: 'right',
        },
        {
            key: 'humidity',
            label: t.dashboard.humidity + ' (%)',
            color: 'var(--chart-humidity)',
            yAxisId: 'left',
        },
        {
            key: 'power',
            label: 'Power (kW)',
            color: 'var(--chart-power)',
            yAxisId: 'left',
        },
    ]

    // Chỉ hiện humidity / power khi có dữ liệu thật.
    // Temperature và vibration luôn hiện.
    const lines = allLines.filter(line => {
        if (line.key === 'temperature' || line.key === 'vibration') return true

        return chartData.some((item: any) => {
            const value = item[line.key]
            return typeof value === 'number' && value !== 0
        })
    })

    return (
        <Card className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-[var(--accent-cyan)] bg-opacity-20 text-[10px] font-bold text-[var(--accent-cyan)]">
                        1
                    </span>

                    <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                        {t.analytics.trendAnalysis}
                    </h2>
                </div>

                <div className="flex items-center gap-1">
                    {timeRanges.map(r => (
                        <button
                            key={r}
                            onClick={() => setActiveRange(r)}
                            className={[
                                'px-2.5 py-1 rounded text-[10px] font-semibold transition-all',
                                activeRange === r
                                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-base)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                            ].join(' ')}
                        >
                            {r}
                        </button>
                    ))}

                    <Calendar className="w-4 h-4 text-[var(--text-muted)] ml-1" />
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                {lines.map(({ key, label, color }) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <span className="w-6 h-0.5 rounded" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                    </div>
                ))}
            </div>

            {/* Chart */}
            {isLoading ? (
                <div className="h-56 rounded-lg bg-[var(--bg-surface)] animate-pulse" />
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 4, right: 18, left: -18, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--bg-border)"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                        />

                        {/* Trục trái: nhiệt độ */}
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                        />

                        {/* Trục phải: rung động */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'auto']}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        {lines.map(({ key, label, color, yAxisId }) => (
                            <Line
                                key={key}
                                yAxisId={yAxisId}
                                type="monotone"
                                dataKey={key}
                                stroke={color}
                                strokeWidth={key === 'vibration' ? 2 : 1.5}
                                dot={false}
                                name={label}
                                isAnimationActive={false}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Card>
    )
}