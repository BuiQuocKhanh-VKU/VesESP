import type { Recommendation } from "@/features/analytics/types/analytics.types";
import { getTemperatureRiskLevel } from "@/shared/utils/sensorStatus";

export interface RecommendationTelemetry {
    temperature?: number | null;
    vibration?: number;
    normalVib?: number;
    machineStatus?: string;
    sensorStatus?: string;
}

const safeNumber = (value: unknown, fallback = 0) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const buildRecommendations = (
    latest: RecommendationTelemetry | null,
): Recommendation[] => {
    if (!latest) {
        return [
            {
                id: "REC-NO-DATA",
                level: "info",
                title: {
                    en: "Waiting for sensor data",
                    vi: "Đang chờ dữ liệu cảm biến",
                },
                description: {
                    en: "The system has not received the latest telemetry from Firebase.",
                    vi: "Hệ thống chưa nhận được dữ liệu mới nhất từ Firebase.",
                },
            },
        ];
    }

    const recommendations: Recommendation[] = [];

    const temperature = latest.temperature;
    const vibration = safeNumber(latest.vibration);
    const normalVibration = safeNumber(latest.normalVib, 0.12);

    const temperatureLevel = getTemperatureRiskLevel(temperature);

    if (temperatureLevel === "high") {
        recommendations.push({
            id: "REC-TEMP-DANGER",
            level: "danger",
            title: {
                en: "Critical engine temperature detected",
                vi: "Phát hiện nhiệt độ động cơ nguy hiểm",
            },
            description: {
                en: `Current temperature is ${temperature?.toFixed(2) ?? 0}°C. Reduce engine load and inspect the cooling system immediately.`,
                vi: `Nhiệt độ hiện tại là ${temperature?.toFixed(2) ?? 0}°C. Cần giảm tải và kiểm tra hệ thống làm mát ngay.`,
            },
        });
    }

    if (temperatureLevel === "medium") {
        recommendations.push({
            id: "REC-TEMP-WARNING",
            level: "warning",
            title: {
                en: "Engine temperature is rising",
                vi: "Nhiệt độ động cơ đang tăng",
            },
            description: {
                en: `Current temperature is ${temperature?.toFixed(2) ?? 0}°C. Continue monitoring and inspect the cooling system.`,
                vi: `Nhiệt độ hiện tại là ${temperature?.toFixed(2) ?? 0}°C. Cần tiếp tục theo dõi và kiểm tra hệ thống làm mát.`,
            },
        });
    }

    if (
        latest.machineStatus === "WARNING" ||
        latest.machineStatus === "DANGER" ||
        vibration > normalVibration * 2.2
    ) {
        recommendations.push({
            id: "REC-VIBRATION",
            level: latest.machineStatus === "DANGER" ? "danger" : "warning",
            title: {
                en: "Abnormal vibration detected",
                vi: "Phát hiện rung động bất thường",
            },
            description: {
                en: `Current vibration is ${vibration.toFixed(4)} RMS. Inspect the bearing, mounting and lubrication system.`,
                vi: `Rung động hiện tại là ${vibration.toFixed(4)} RMS. Cần kiểm tra bạc đạn, chân đế và hệ thống bôi trơn.`,
            },
        });
    }

    if (
        latest.sensorStatus === "SENSOR_WARNING" ||
        latest.sensorStatus === "SENSOR_ERROR"
    ) {
        recommendations.push({
            id: "REC-SENSOR",
            level:
                latest.sensorStatus === "SENSOR_ERROR" ? "danger" : "warning",
            title: {
                en: "Sensor connection issue",
                vi: "Cảm biến có dấu hiệu kết nối bất thường",
            },
            description: {
                en: "Check the sensor wiring, power supply and ESP32 connection.",
                vi: "Kiểm tra dây cảm biến, nguồn cấp và kết nối với ESP32.",
            },
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            id: "REC-NORMAL",
            level: "ok",
            title: {
                en: "System operating normally",
                vi: "Hệ thống đang hoạt động bình thường",
            },
            description: {
                en: `Temperature: ${temperature?.toFixed(2) ?? 0}°C, vibration: ${vibration.toFixed(4)} RMS. No abnormal condition detected.`,
                vi: `Nhiệt độ: ${temperature?.toFixed(2) ?? 0}°C, rung động: ${vibration.toFixed(4)} RMS. Chưa phát hiện dấu hiệu bất thường.`,
            },
        });
    }

    return recommendations;
};
