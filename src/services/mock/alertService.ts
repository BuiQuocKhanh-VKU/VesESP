import {
    mockAlerts,
    mockAlertSummary,
    mockAlertHistory,
} from "./data/alerts.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export class AlertService {
    async getAlerts() {
        await delay();
        return mockAlerts;
    }
    async getAlertById(id: string) {
        await delay();
        return mockAlerts.find((a) => a.id === id);
    }
    async getAlertSummary() {
        await delay();
        return mockAlertSummary;
    }
    async getAlertHistory() {
        await delay();
        return mockAlertHistory;
    }
}
