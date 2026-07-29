import type { IDashboardService } from '../interfaces/IDashboardService'
import { mockSensorCards, mockSystemEvents } from './data/sensors.mock'

const FIREBASE_DB_URL =
  'https://vesesp-predictive-maintenance-default-rtdb.asia-southeast1.firebasedatabase.app'

const VESSEL_ID = 'vessel_001'

type FirebaseLatest = {
  timestamp?: number
  vibration?: number
  normalVib?: number
  ratio?: number
  delta?: number
  temperature?: number | null
  humidity?: number | null
  power?: number | null
  machineStatus?: string
  sensorStatus?: string
}

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

const safeNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const fetchLatest = async (): Promise<FirebaseLatest | null> => {
  try {
    const response = await fetch(
      `${FIREBASE_DB_URL}/vessels/${VESSEL_ID}/latest.json`
    )

    if (!response.ok) {
      console.warn('Firebase latest fetch failed:', response.status)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn('Firebase latest fetch error:', error)
    return null
  }
}

export class MockDashboardService implements IDashboardService {
  async getSensorCards() {
    const latest = await fetchLatest()

    if (!latest) {
      await delay()
      return mockSensorCards
    }

    return mockSensorCards.map(card => {
      if (card.id === 'temperature') {
        const value = latest.temperature ?? card.value

        return {
          ...card,
          value: Number(value.toFixed(2)),
          unit: '°C',
          isWithinRange: value >= card.normalMin && value <= card.normalMax,
          sparkline: [
            ...card.sparkline.slice(1),
            {
              timestamp: new Date().toISOString(),
              value,
            },
          ],
        }
      }

      if (card.id === 'vibration') {
        const value = safeNumber(latest.vibration, card.value)

        return {
          ...card,
          value: Number(value.toFixed(4)),
          unit: 'RMS',
          normalMin: 0,
          normalMax: Math.max(safeNumber(latest.normalVib, 0.12) * 2.2, 0.2),
          isWithinRange:
            latest.machineStatus !== 'WARNING' &&
            latest.machineStatus !== 'DANGER',
          sparkline: [
            ...card.sparkline.slice(1),
            {
              timestamp: new Date().toISOString(),
              value,
            },
          ],
        }
      }

      if (card.id === 'humidity') {
        // Chưa có cảm biến độ ẩm nên giữ mock hoặc cho 0 tùy bạn.
        // Ở đây giữ mock để UI không bị trống.
        return card
      }

      return card
    })
  }

  async getSystemEvents() {
    await delay()
    return mockSystemEvents
  }
}