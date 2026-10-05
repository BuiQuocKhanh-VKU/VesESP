import { get, limitToLast, orderByKey, query, ref } from "firebase/database";

import { realtimeDb } from "@/lib/firebase";

import type { TimeRange } from "@/shared/types/common.types";

import {
    mockAnalyticsOverview,
    mockTrendData,
    mockRiskItems,
    mockAnomalyEvents,
    mockBehaviorMetrics,
} from "@/services/mock/data/analytics.mock";

import { SENSOR_THRESHOLDS } from "@/shared/constants/thresholds";

import {
    getTemperatureRiskLevel,
    getTemperatureStatus,
} from "@/shared/utils/sensorStatus";

import { buildRecommendations } from "@/services/mock/data/buildRecommendations";

const VESSEL_ID = "vessel_001";

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

// TREND LIMIT

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

// TIMESTAMP

const toDisplayTimestamp = (timestamp?: number, index = 0, total = 1) => {
    if (!timestamp || timestamp < 1_000_000_000_000) {
        return new Date(Date.now() - (total - index - 1) * 5000).toISOString();
    }

    return new Date(timestamp).toISOString();
};

// TEMPERATURE RISK

const getTemperatureRiskScore = (temperature?: number | null) => {
    if (temperature == null || !Number.isFinite(temperature)) {
        return 0;
    }

    const threshold = SENSOR_THRESHOLDS.temperature;

    const baseTemperature = 25;

    if (temperature <= baseTemperature) {
        return 0;
    }

    if (temperature < threshold.warning) {
        const progress =
            (temperature - baseTemperature) /
            (threshold.warning - baseTemperature);

        return Math.round(progress * 34);
    }

    if (temperature < threshold.danger) {
        const progress =
            (temperature - threshold.warning) /
            (threshold.danger - threshold.warning);

        return Math.round(35 + progress * 34);
    }

    return 100;
};

const getRiskLevel = (score: number) => {
    if (score >= 70) {
        return "high" as const;
    }

    if (score >= 35) {
        return "medium" as const;
    }

    return "low" as const;
};

// FIREBASE - LATEST

const getLatest = async (): Promise<FirebaseTelemetry | null> => {
    try {
        const snapshot = await get(
            ref(realtimeDb, `vessels/${VESSEL_ID}/latest`),
        );

        if (!snapshot.exists()) {
            console.warn("Firebase latest does not exist");

            return null;
        }

        return snapshot.val() as FirebaseTelemetry;
    } catch (error) {
        console.warn("Firebase latest read error:", error);

        return null;
    }
};

// FIREBASE - TELEMETRY HISTORY

const getTelemetry = async (limit = 300): Promise<FirebaseTelemetry[]> => {
    try {
        const telemetryQuery = query(
            ref(realtimeDb, `vessels/${VESSEL_ID}/telemetry`),

            orderByKey(),

            limitToLast(limit),
        );

        const snapshot = await get(telemetryQuery);

        if (!snapshot.exists()) {
            return [];
        }

        const raw = snapshot.val() as Record<string, FirebaseTelemetry>;

        return Object.entries(raw)
            .map(([id, value]) => ({
                id,
                ...value,
            }))
            .sort((a, b) => safeNumber(a.timestamp) - safeNumber(b.timestamp));
    } catch (error) {
        console.warn("Firebase telemetry read error:", error);

        return [];
    }
};

// SERVICE

export class AnalyticsService {
    // OVERVIEW

    async getOverview() {
        const latest = await getLatest();

        if (!latest) {
            return mockAnalyticsOverview;
        }

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

        const healthScore = Math.max(
            0,
            Math.min(firebaseHealthScore, 100 - anomalyScore),
        );

        return {
            ...mockAnalyticsOverview,

            healthScore,
            anomalyScore,
        };
    }

    // TREND

    async getTrendData(range: TimeRange) {
        const telemetry = await getTelemetry(getTrendLimit(range));

        if (!telemetry.length) {
            return mockTrendData;
        }

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

    // RISK

    async getRiskItems() {
        const latest = await getLatest();

        if (!latest) {
            return mockRiskItems;
        }

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
                if (latest.power == null) {
                    return {
                        ...item,

                        score: 0,

                        level: "low" as const,
                    };
                }

                return item;
            }

            return item;
        });
    }

    // ANOMALY EVENTS

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

        if (!events.length) {
            return mockAnomalyEvents;
        }

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

    // BEHAVIOR

    async getBehaviorMetrics() {
        const latest = await getLatest();

        if (!latest) {
            return mockBehaviorMetrics;
        }

        const vibration = safeNumber(latest.vibration);

        const normalVib = safeNumber(latest.normalVib, 0.12);

        const temperature = latest.temperature ?? 0;

        const humidity = latest.humidity ?? 0;

        const power = latest.power ?? 0;

        return mockBehaviorMetrics.map((item) => {
            const labelText = `${item.label.en} ${item.label.vi}`.toLowerCase();

            // TEMPERATURE

            if (
                labelText.includes("temperature") ||
                labelText.includes("nhiệt")
            ) {
                const threshold = SENSOR_THRESHOLDS.temperature;

                const status = getTemperatureStatus(temperature);

                return {
                    ...item,

                    current: Number(temperature.toFixed(2)),

                    normalMin: threshold.normalMin,

                    normalMax: threshold.normalMax,

                    unit: threshold.unit,

                    status,
                };
            }

            // VIBRATION

            if (labelText.includes("vibration") || labelText.includes("rung")) {
                return {
                    ...item,

                    current: Number(vibration.toFixed(4)),

                    normalMin: 0,

                    normalMax: Number(
                        Math.max(
                            normalVib * 2.2,

                            0.2,
                        ).toFixed(4),
                    ),

                    unit: "RMS",
                };
            }

            // HUMIDITY

            if (labelText.includes("humidity") || labelText.includes("ẩm")) {
                return {
                    ...item,

                    current: Number(humidity.toFixed(2)),

                    normalMin: 30,
                    normalMax: 80,

                    unit: "%",
                };
            }

            // POWER

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

    // RECOMMENDATIONS

    async getRecommendations() {
        const latest = await getLatest();

        return buildRecommendations(latest);
    }
}

export const analyticsService = new AnalyticsService();
