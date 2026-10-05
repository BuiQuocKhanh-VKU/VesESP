import {
    mockAlerts,
    mockAlertSummary,
    mockAlertHistory,
} from "@/services/mock/data/alerts.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class AlertService {
    // Danh sách cảnh báo
    async getAlerts() {
        await delay();

        return mockAlerts;
    }

    // Chi tiết một cảnh báo
    async getAlertById(id: string) {
        await delay();

        return mockAlerts.find((alert) => alert.id === id);
    }

    // Tổng quan cảnh báo
    async getAlertSummary() {
        await delay();

        return mockAlertSummary;
    }

    // Lịch sử cảnh báo
    async getAlertHistory() {
        await delay();

        return mockAlertHistory;
    }
}

export const alertService = new AlertService();
