import type { RiskLevel } from '@/shared/types/common.types'

export interface AnalyticsOverview {
  healthScore: number
  healthLabel: string
  anomalyScore: number
  anomalyLabel: string
}

export interface TrendDataPoint {
  timestamp: string
  temperature: number
  vibration: number
  humidity: number
  power: number
}

export interface RiskItem {
  id: string
  name: string
  score: number
  level: RiskLevel
  icon: string
}

export interface AnomalyEvent {
  id: string
  timestamp: string
  parameter: string
  value: number
  unit: string
  deviation: string
  component: string
  severity: 'high' | 'medium' | 'low'
}

export interface BehaviorMetric {
  label: string
  unit: string
  current: number
  normalMin: number
  normalMax: number
}

export interface Recommendation {
  id: string
  level: 'danger' | 'warning' | 'info' | 'ok'
  title: string
  description: string
}