import type { SensorCard, SystemEvent } from "@/shared/types/sensor.types";
import { SENSOR_THRESHOLDS } from "@/shared/constants/thresholds";

const generateSparkline = (base: number, count = 20) =>
    Array.from({ length: count }, (_, i) => ({
        timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
        value: base + (Math.random() - 0.5) * base * 0.1,
    }));

const temperatureThreshold = SENSOR_THRESHOLDS.temperature;
export const mockSensorCards: SensorCard[] = [
    {
        id: "temperature",
        label: {
            en: "Temperature",
            vi: "Nhiệt độ",
        },
        value: 33.25,
        unit: temperatureThreshold.unit,
        normalMin: temperatureThreshold.normalMin,
        normalMax: temperatureThreshold.normalMax,
        isWithinRange: true,
        sparkline: generateSparkline(33.25),
    },

    {
        id: "vibration",
        label: { en: "Vibration", vi: "Rung động" },
        value: 0.18,
        unit: "g",
        normalMin: 0,
        normalMax: 0.5,
        isWithinRange: true,
        sparkline: generateSparkline(0.18),
    },
    {
        id: "humidity",
        label: { en: "Humidity", vi: "Độ ẩm" },
        value: 62,
        unit: "%",
        normalMin: 30,
        normalMax: 80,
        isWithinRange: true,
        sparkline: generateSparkline(62),
    },
];

export const mockSystemEvents: SystemEvent[] = [
    {
        id: "EVT-001",
        timestamp: "14:32:45",
        message: {
            en: "Data synchronized successfully",
            vi: "Đồng bộ dữ liệu thành công",
        },
        source: "System",
        category: "system",
    },
    {
        id: "EVT-002",
        timestamp: "14:30:12",
        message: { en: "Sensor data received", vi: "Đã nhận dữ liệu cảm biến" },
        source: "Engine Room",
        category: "sensor",
    },
    {
        id: "EVT-003",
        timestamp: "14:28:05",
        message: {
            en: "Edge gateway heartbeat",
            vi: "Tín hiệu cổng kết nối hoạt động",
        },
        source: "Connectivity",
        category: "connectivity",
    },
];
