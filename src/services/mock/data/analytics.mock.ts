import type {
    AnalyticsOverview,
    TrendDataPoint,
    RiskItem,
    AnomalyEvent,
    BehaviorMetric,
    Recommendation,
} from '@/features/analytics/types/analytics.types'

export const mockAnalyticsOverview: AnalyticsOverview = {
    healthScore: 92,
    healthLabel: { en: 'Excellent',  vi: 'Tốt'     },
    anomalyScore: 54,
    anomalyLabel: { en: 'Moderate',  vi: 'Cảnh báo'   },
}

export const mockTrendData: TrendDataPoint[] = Array.from({ length: 48 }, (_, i) => ({
    timestamp:   new Date(Date.now() - (48 - i) * 30 * 60000).toISOString(),
    temperature: 80 + Math.sin(i * 0.3) * 8 + Math.random() * 4,
    vibration:   0.15 + Math.sin(i * 0.2) * 0.05 + Math.random() * 0.02,
    humidity:    62 + Math.sin(i * 0.15) * 5 + Math.random() * 3,
    power:       18 + Math.sin(i * 0.25) * 6 + Math.random() * 3,
}))

export const mockRiskItems: RiskItem[] = [
    { id: 'R1', name: { en: 'Bearing Wear Risk',       vi: 'Rủi ro mòn bạc đạn'      }, score: 78, level: 'high',   icon: 'bearing'   },
    { id: 'R2', name: { en: 'Overheating Risk',        vi: 'Rủi ro quá nhiệt'         }, score: 54, level: 'medium', icon: 'temp'      },
    { id: 'R3', name: { en: 'Vibration Anomaly Risk',  vi: 'Rủi ro rung động bất thường' }, score: 46, level: 'medium', icon: 'vibration' },
    { id: 'R4', name: { en: 'Power Deviation Risk',    vi: 'Rủi ro lệch công suất'    }, score: 22, level: 'low',    icon: 'power'     },
]

export const mockAnomalyEvents: AnomalyEvent[] = [
    {
        id: 'AN-001',
        timestamp: '14:34',
        parameter: { en: 'Vibration',   vi: 'Rung động'  },
        value: 1.62,
        unit: 'g',
        deviation: { en: '+65% from baseline', vi: '+65% so với chuẩn' },
        component: 'Main Engine - Bearing #2',
        severity: 'high',
    },
    {
        id: 'AN-002',
        timestamp: '13:15',
        parameter: { en: 'Temperature', vi: 'Nhiệt độ'   },
        value: 88.4,
        unit: '°C',
        deviation: { en: '+12% from baseline', vi: '+12% so với chuẩn' },
        component: 'Exhaust System',
        severity: 'medium',
    },
]

export const mockBehaviorMetrics: BehaviorMetric[] = [
    { label: { en: 'Temperature', vi: 'Nhiệt độ'  }, unit: '°C', current: 71.2, normalMin: 50, normalMax: 90  },
    { label: { en: 'Vibration',   vi: 'Rung động' }, unit: 'g',  current: 0.18, normalMin: 0,  normalMax: 0.5 },
    { label: { en: 'Humidity',    vi: 'Độ ẩm'     }, unit: '%',  current: 62,   normalMin: 30, normalMax: 80  },
]

export const mockRecommendations: Recommendation[] = [
    {
        id: 'REC-001',
        level: 'danger',
        title:       { en: 'Inspect bearing assembly',               vi: 'Kiểm tra cụm bạc đạn'                    },
        description: { en: 'Elevated vibration levels detected on Bearing #2.', vi: 'Phát hiện rung động cao tại bạc đạn số 2.' },
    },
    {
        id: 'REC-002',
        level: 'warning',
        title:       { en: 'Temperature trend rising above baseline',  vi: 'Xu hướng nhiệt độ tăng vượt chuẩn'       },
        description: { en: 'Monitor cooling system and check for obstructions.', vi: 'Theo dõi hệ thống làm mát và kiểm tra tắc nghẽn.' },
    },
    {
        id: 'REC-003',
        level: 'info',
        title:       { en: 'Increase monitoring frequency',            vi: 'Tăng tần suất giám sát'                  },
        description: { en: 'Anomaly score is moderate. Increase sampling rate.', vi: 'Điểm bất thường ở mức trung bình. Tăng tần suất lấy mẫu.' },
    },
    {
        id: 'REC-004',
        level: 'ok',
        title:       { en: 'System performing within normal range',    vi: 'Hệ thống hoạt động trong ngưỡng bình thường' },
        description: { en: 'Power usage and humidity levels are optimal.', vi: 'Mức tiêu thụ điện và độ ẩm đang tối ưu.' },
    },
]