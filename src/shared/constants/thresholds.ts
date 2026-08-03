export const SENSOR_THRESHOLDS = {
    temperature: {
        normalMin: 0,
        normalMax: 35,
        warning: 35,
        danger: 36.5,
        unit: "°C",
    },

    vibration: {
        normalMin: 0,
        normalMax: 0.2,
        warning: 0.2,
        danger: 0.5,
        unit: "RMS",
    },

    humidity: {
        normalMin: 30,
        normalMax: 80,
        warning: 80,
        danger: 90,
        unit: "%",
    },
} as const;

export type SensorStatus = "normal" | "warning" | "danger";
export type RiskLevel = "low" | "medium" | "high";
