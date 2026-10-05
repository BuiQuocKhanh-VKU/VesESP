import {
    mockReports,
    mockMaintenanceSchedules,
    mockMonthlyTrend,
    mockReportStats,
} from "@/services/mock/data/reports.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export class ReportService {
    async getReports() {
        await delay();

        return mockReports;
    }

    async getMaintenanceSchedules() {
        await delay();

        return mockMaintenanceSchedules;
    }

    async getMonthlyTrend() {
        await delay();

        return mockMonthlyTrend;
    }

    async getReportStats() {
        await delay();

        return mockReportStats;
    }
}

export const reportService = new ReportService();
