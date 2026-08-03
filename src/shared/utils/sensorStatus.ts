import {
    SENSOR_THRESHOLDS,
    type RiskLevel,
    type SensorStatus,
} from "@/shared/constants/thresholds";

export const getTemperatureStatus = (value: number): SensorStatus => {
    const threshold = SENSOR_THRESHOLDS.temperature;

    if (value >= threshold.danger) {
        return "danger";
    }

    if (value >= threshold.warning) {
        return "warning";
    }

    return "normal";
};

export const getTemperatureRiskLevel = (value?: number | null): RiskLevel => {
    if (value == null || !Number.isFinite(value)) {
        return "low";
    }

    const status = getTemperatureStatus(value);

    if (status === "danger") {
        return "high";
    }

    if (status === "warning") {
        return "medium";
    }

    return "low";
};

export const getVibrationStatus = (value: number): SensorStatus => {
    const threshold = SENSOR_THRESHOLDS.vibration;

    if (value >= threshold.danger) {
        return "danger";
    }

    if (value >= threshold.warning) {
        return "warning";
    }

    return "normal";
};

export const getHumidityStatus = (value: number): SensorStatus => {
    const threshold = SENSOR_THRESHOLDS.humidity;

    if (value >= threshold.danger) {
        return "danger";
    }

    if (value >= threshold.warning) {
        return "warning";
    }

    return "normal";
};
