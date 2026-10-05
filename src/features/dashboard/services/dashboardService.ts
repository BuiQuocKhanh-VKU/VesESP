import { get, ref } from "firebase/database";

import { realtimeDb } from "@/lib/firebase";
import {
    mockSensorCards,
    mockSystemEvents,
} from "@/services/mock/data/sensors.mock";
import { SENSOR_THRESHOLDS } from "@/shared/constants/thresholds";
import { getTemperatureStatus } from "@/shared/utils/sensorStatus";

const VESSEL_ID = "vessel_001";

type FirebaseLatest = {
    timestamp?: number;
    vibration?: number;
    normalVib?: number;
    ratio?: number;
    delta?: number;
    temperature?: number | null;
    humidity?: number | null;
    power?: number | null;
    machineStatus?: string;
    sensorStatus?: string;
};

const safeNumber = (value: unknown, fallback = 0) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

const getLatest = async (): Promise<FirebaseLatest | null> => {
    try {
        const snapshot = await get(
            ref(realtimeDb, `vessels/${VESSEL_ID}/latest`),
        );

        if (!snapshot.exists()) {
            console.warn("Firebase latest data does not exist");
            return null;
        }

        return snapshot.val() as FirebaseLatest;
    } catch (error) {
        console.warn("Firebase latest read error:", error);
        return null;
    }
};

export class DashboardService {
    async getSensorCards() {
        const latest = await getLatest();

        // Firebase lỗi hoặc chưa có dữ liệu
        // => UI vẫn chạy bằng mock
        if (!latest) {
            return mockSensorCards;
        }

        return mockSensorCards.map((card) => {
            // TEMPERATURE

            if (card.id === "temperature") {
                const value =
                    latest.temperature != null
                        ? latest.temperature
                        : card.value;

                const threshold = SENSOR_THRESHOLDS.temperature;
                const status = getTemperatureStatus(value);

                return {
                    ...card,
                    value: Number(value.toFixed(2)),
                    unit: threshold.unit,
                    normalMin: threshold.normalMin,
                    normalMax: threshold.normalMax,
                    isWithinRange: status === "normal",
                    sparkline: [
                        ...card.sparkline.slice(1),
                        {
                            timestamp: new Date().toISOString(),
                            value,
                        },
                    ],
                };
            }

            // VIBRATION

            if (card.id === "vibration") {
                const value = safeNumber(latest.vibration, card.value);

                const normalVib = safeNumber(latest.normalVib, 0.12);

                return {
                    ...card,
                    value: Number(value.toFixed(4)),
                    unit: "RMS",
                    normalMin: 0,
                    normalMax: Math.max(normalVib * 2.2, 0.2),

                    isWithinRange:
                        latest.machineStatus !== "WARNING" &&
                        latest.machineStatus !== "DANGER",

                    sparkline: [
                        ...card.sparkline.slice(1),
                        {
                            timestamp: new Date().toISOString(),
                            value,
                        },
                    ],
                };
            }

            // HUMIDITY

            if (card.id === "humidity") {
                // Nếu Firebase đã có humidity thì lấy realtime
                if (latest.humidity != null) {
                    return {
                        ...card,
                        value: Number(latest.humidity.toFixed(2)),
                        sparkline: [
                            ...card.sparkline.slice(1),
                            {
                                timestamp: new Date().toISOString(),
                                value: latest.humidity,
                            },
                        ],
                    };
                }

                // Chưa có cảm biến thì giữ mock
                return card;
            }

            return card;
        });
    }

    async getSystemEvents() {
        // Hiện Firebase chưa có system events riêng
        // nên vẫn giữ mock
        return mockSystemEvents;
    }
}

export const dashboardService = new DashboardService();
