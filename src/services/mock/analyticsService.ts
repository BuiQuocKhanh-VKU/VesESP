import type { TimeRange } from "@/shared/types/common.types";
import {
    mockAnalyticsOverview,
    mockTrendData,
    mockRiskItems,
    mockAnomalyEvents,
    mockBehaviorMetrics,
    mockRecommendations,
} from "./data/analytics.mock";

const FIREBASE_DB_URL =
    "https://vesesp-predictive-maintenance-default-rtdb.asia-southeast1.firebasedatabase.app";

const VESSEL_ID = "vessel_001";

// ================== TEMP THRESHOLDS ==================
// < 35°C      → low / Thông tin
// >= 35°C     → medium / Cảnh báo
// >= 36.5°C   → high / Nguy hiểm
const TEMP_WARNING_C = 35;
const TEMP_DANGER_C = 36.5;
const TEMP_BASE_C = 25;

type FirebaseTelemetry = {
    id?: string;
    timestamp?: number;
    loopCount?: number;
    vibration?: number;
    normalVib?: number;
    ratio?: number;
    delta?: number;
    machineStatus?: string;
    sensorStatus?: string;
    anomalyScore?: number;
    healthScore?: number;
    temperature?: number | null;
    humidity?: number | null;
    power?: number | null;
    current?: number | null;
    voltage?: number | null;
    waterLeak?: boolean | null;
    failCount?: number;
};

const safeNumber = (value: unknown, fallback = 0) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

const getTrendLimit = (range: TimeRange) => {
    switch (range) {
        case "1H":
            return 120;
        case "6H":
            return 240;
        case "12H":
            return 360;
        case "24H":
            return 500;
        case "7D":
            return 800;
        default:
            return 300;
    }
};

const toDisplayTimestamp = (timestamp?: number, index = 0, total = 1) => {
    if (!timestamp || timestamp < 1000000000000) {
        return new Date(Date.now() - (total - index - 1) * 5000).toISOString();
    }

    return new Date(timestamp).toISOString();
};

const getRiskLevel = (score: number) => {
    if (score >= 70) return "high" as const;
    if (score >= 35) return "medium" as const;
    return "low" as const;
};

const getTemperatureRiskScore = (temperature?: number | null) => {
    if (temperature == null || !Number.isFinite(temperature)) return 0;

    // Dưới 25°C coi như 0 điểm.
    if (temperature <= TEMP_BASE_C) return 0;

    // 25°C → 35°C: thanh vẫn chạy nhưng vẫn là Thông tin.
    // Điểm 0 → 34.
    if (temperature < TEMP_WARNING_C) {
        const progress =
            (temperature - TEMP_BASE_C) / (TEMP_WARNING_C - TEMP_BASE_C);

        return Math.round(progress * 34);
    }

    // 35°C → 36.5°C: Cảnh báo.
    // Điểm 35 → 69.
    if (temperature < TEMP_DANGER_C) {
        const progress =
            (temperature - TEMP_WARNING_C) / (TEMP_DANGER_C - TEMP_WARNING_C);

        return Math.round(35 + progress * 34);
    }

    // Từ 36.5°C trở lên: Nguy hiểm.
    return 100;
};

const getTemperatureRiskLevel = (temperature?: number | null) => {
    if (temperature == null || !Number.isFinite(temperature))
        return "low" as const;
    if (temperature >= TEMP_DANGER_C) return "high" as const;
    if (temperature >= TEMP_WARNING_C) return "medium" as const;
    return "low" as const;
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.warn("Firebase fetch failed:", response.status, url);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.warn("Firebase fetch error:", error);
        return null;
    }
};

const getLatest = async () => {
    return fetchJson<FirebaseTelemetry>(
        `${FIREBASE_DB_URL}/vessels/${VESSEL_ID}/latest.json`,
    );
};

const getTelemetry = async (limit = 300) => {
    const raw = await fetchJson<Record<string, FirebaseTelemetry>>(
        `${FIREBASE_DB_URL}/vessels/${VESSEL_ID}/telemetry.json?orderBy=%22$key%22&limitToLast=${limit}`,
    );

    if (!raw) return [];

    return Object.entries(raw)
        .map(([id, value]) => ({
            id,
            ...value,
        }))
        .sort((a, b) => safeNumber(a.timestamp) - safeNumber(b.timestamp));
};

export class AnalyticsService {
    async getOverview() {
        const latest = await getLatest();

        if (!latest) return mockAnalyticsOverview;

        const temperatureScore = getTemperatureRiskScore(latest.temperature);

        const firebaseHealthScore = safeNumber(
            latest.healthScore,
            mockAnalyticsOverview.healthScore,
        );

        const firebaseAnomalyScore = safeNumber(
            latest.anomalyScore,
            mockAnalyticsOverview.anomalyScore,
        );

        const anomalyScore = Math.max(firebaseAnomalyScore, temperatureScore);
        const healthScore = Math.min(firebaseHealthScore, 100 - anomalyScore);

        return {
            ...mockAnalyticsOverview,
            healthScore,
            anomalyScore,
        };
    }

    async getTrendData(range: TimeRange) {
        const telemetry = await getTelemetry(getTrendLimit(range));

        if (!telemetry.length) return mockTrendData;

        return telemetry.map((item, index) => ({
            timestamp: toDisplayTimestamp(
                item.timestamp,
                index,
                telemetry.length,
            ),
            vibration: safeNumber(item.vibration),
            temperature: item.temperature ?? 0,
            humidity: item.humidity ?? 0,
            power: item.power ?? 0,
        }));
    }

    async getRiskItems() {
        const latest = await getLatest();

        if (!latest) return mockRiskItems;

        const anomalyScore = safeNumber(latest.anomalyScore);
        const ratio = safeNumber(latest.ratio);
        const delta = Math.abs(safeNumber(latest.delta));

        const vibrationScore = Math.min(100, anomalyScore);

        const bearingScore = Math.min(100, Math.round(ratio * 18 + delta * 35));

        const temperatureScore = getTemperatureRiskScore(latest.temperature);
        const temperatureLevel = getTemperatureRiskLevel(latest.temperature);

        return mockRiskItems.map((item) => {
            if (item.icon === "bearing") {
                return {
                    ...item,
                    score: bearingScore,
                    level: getRiskLevel(bearingScore),
                };
            }

            if (item.icon === "temp") {
                return {
                    ...item,
                    score: temperatureScore,
                    level: temperatureLevel,
                };
            }

            if (item.icon === "vibration") {
                return {
                    ...item,
                    score: vibrationScore,
                    level: getRiskLevel(vibrationScore),
                };
            }

            if (item.icon === "power") {
                return {
                    ...item,
                    score: latest.power == null ? 0 : item.score,
                    level: latest.power == null ? ("low" as const) : item.level,
                };
            }

            return item;
        });
    }

    async getAnomalyEvents() {
        const telemetry = await getTelemetry(120);

        const events = telemetry
            .filter((item) => {
                const temperatureLevel = getTemperatureRiskLevel(
                    item.temperature,
                );

                return (
                    item.machineStatus === "WARNING" ||
                    item.machineStatus === "DANGER" ||
                    item.sensorStatus === "SENSOR_WARNING" ||
                    item.sensorStatus === "SENSOR_ERROR" ||
                    temperatureLevel === "medium" ||
                    temperatureLevel === "high"
                );
            })
            .slice(-8)
            .reverse();

        if (!events.length) return mockAnomalyEvents;

        const base = mockAnomalyEvents[0];

        return events.map((item, index) => {
            const temperatureLevel = getTemperatureRiskLevel(item.temperature);

            const isSensorIssue =
                item.sensorStatus === "SENSOR_WARNING" ||
                item.sensorStatus === "SENSOR_ERROR";

            const isTempIssue =
                temperatureLevel === "medium" || temperatureLevel === "high";

            const isDanger =
                item.machineStatus === "DANGER" ||
                item.sensorStatus === "SENSOR_ERROR" ||
                temperatureLevel === "high";

            return {
                ...base,
                id: item.id ?? `AN-${index}`,
                timestamp: new Date(
                    toDisplayTimestamp(item.timestamp, index, events.length),
                ).toLocaleTimeString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }),
                value: isSensorIssue
                    ? safeNumber(item.failCount)
                    : isTempIssue
                      ? Number(safeNumber(item.temperature).toFixed(2))
                      : Number(safeNumber(item.vibration).toFixed(4)),
                unit: isSensorIssue ? "fail" : isTempIssue ? "°C" : "RMS",
                severity: isDanger ? ("high" as const) : ("medium" as const),
            };
        });
    }

    async getBehaviorMetrics() {
        const latest = await getLatest();

        if (!latest) return mockBehaviorMetrics;

        const vibration = safeNumber(latest.vibration);
        const normalVib = safeNumber(latest.normalVib, 0.12);
        const temperature = latest.temperature ?? 0;
        const humidity = latest.humidity ?? 0;
        const power = latest.power ?? 0;

        return mockBehaviorMetrics.map((item) => {
            const labelText = `${item.label.en} ${item.label.vi}`.toLowerCase();

            // ================== NHIỆT ĐỘ REALTIME ==================
            if (
                labelText.includes("temperature") ||
                labelText.includes("nhiệt")
            ) {
                const tempStatus =
                    temperature >= 36.5
                        ? "danger"
                        : temperature >= 35
                          ? "warning"
                          : "normal";

                return {
                    ...item,
                    current: Number(temperature.toFixed(2)),
                    normalMin: 0,
                    normalMax: 100,
                    unit: "°C",
                    status: tempStatus,
                };
            }

            // ================== RUNG ĐỘNG REALTIME ==================
            if (labelText.includes("vibration") || labelText.includes("rung")) {
                return {
                    ...item,
                    current: Number(vibration.toFixed(4)),
                    normalMin: 0,
                    normalMax: Number(
                        Math.max(normalVib * 2.2, 0.2).toFixed(4),
                    ),
                    unit: "RMS",
                };
            }

            // ================== ĐỘ ẨM ==================
            // Hiện tại chưa có cảm biến độ ẩm nên để 0.
            // Sau này gắn DHT/SHT thì Firebase có humidity và tự chạy.
            if (labelText.includes("humidity") || labelText.includes("ẩm")) {
                return {
                    ...item,
                    current: Number(humidity.toFixed(2)),
                    normalMin: 30,
                    normalMax: 80,
                    unit: "%",
                };
            }

            // ================== POWER ==================
            // Hiện tại chưa có INA219 nên để 0.
            if (
                labelText.includes("power") ||
                labelText.includes("công suất")
            ) {
                return {
                    ...item,
                    current: Number(power.toFixed(2)),
                    normalMin: 0,
                    normalMax: 1,
                    unit: "kW",
                };
            }

            return item;
        });
    }

    async getRecommendations() {
        const latest = await getLatest();

        if (!latest) return mockRecommendations;

        const machineStatus = latest.machineStatus;
        const sensorStatus = latest.sensorStatus;
        const temperatureLevel = getTemperatureRiskLevel(latest.temperature);

        if (
            machineStatus === "DANGER" ||
            sensorStatus === "SENSOR_ERROR" ||
            temperatureLevel === "high"
        ) {
            return mockRecommendations.filter(
                (item) => item.level === "danger",
            );
        }

        if (
            machineStatus === "WARNING" ||
            sensorStatus === "SENSOR_WARNING" ||
            temperatureLevel === "medium"
        ) {
            return mockRecommendations.filter(
                (item) => item.level === "warning" || item.level === "info",
            );
        }

        return mockRecommendations.filter((item) => item.level === "ok");
    }
}
